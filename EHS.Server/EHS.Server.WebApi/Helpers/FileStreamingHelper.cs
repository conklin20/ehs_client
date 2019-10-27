using EHS.Server.DataAccess.DatabaseModels;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.Features;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.Net.Http.Headers;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EHS.Server.WebApi.Helpers
{
    /// <summary>
    /// This code taken from: https://dotnetcoretutorials.com/2017/03/12/uploading-files-asp-net-core/
    /// </summary>
    public static class FileStreamingHelper
    {
        private static readonly FormOptions _defaultFormOptions = new FormOptions();

        public static async Task<List<EventFile>> StreamFile(this HttpRequest request, string fileDir) //, Stream targetStream)
        {
            //get the eventId and userId from the query string 
            
            int.TryParse(request.Query["eventId"], out int eventId); 
            string userId = request.Query["userId"].ToString();

            if (!MultipartRequestHelper.IsMultipartContentType(request.ContentType))
            {
                throw new Exception($"Expected a multipart request, but got {request.ContentType}");
            }
            
            // Used to accumulate all the form url encoded key value pairs in the 
            // request.
            var formAccumulator = new KeyValueAccumulator();
            string targetFilePath = fileDir;

            var boundary = MultipartRequestHelper.GetBoundary(
            MediaTypeHeaderValue.Parse(request.ContentType),
            _defaultFormOptions.MultipartBoundaryLengthLimit);
            var reader = new MultipartReader(boundary, request.Body);

            var section = await reader.ReadNextSectionAsync();
            List<EventFile> eventFilesSavedToServerDir = new List<EventFile>(); 
            
            while (section != null)
            {
                ContentDispositionHeaderValue contentDisposition;
                var hasContentDispositionHeader = ContentDispositionHeaderValue.TryParse(section.ContentDisposition, out contentDisposition);

                if (hasContentDispositionHeader)
                {
                    if (MultipartRequestHelper.HasFileContentDisposition(contentDisposition))
                    {
                        FileMultipartSection currentFile = section.AsFileSection();
                        string fileExtension = Path.GetExtension(currentFile.FileName); 
                        string serverFileName = eventId.ToString() + "_" + userId + "_" + DateTime.Now.ToString("yyyyMMddHHmmssfff") + fileExtension; 
                        string filePath = Path.Combine(targetFilePath, serverFileName);

                        using (var targetStream = File.Create(filePath))
                        {
                            await section.Body.CopyToAsync(targetStream).ConfigureAwait(false);

                            //file saved to server successfully, now save to DB 
                            EventFile eventFile = new EventFile();
                            eventFile.EventId = eventId;
                            eventFile.UserId = userId;
                            eventFile.ServerFileName = serverFileName;
                            eventFile.UserFileName = currentFile.FileName;
                            eventFilesSavedToServerDir.Add(eventFile); 
                        }
                    }
                    else if (MultipartRequestHelper.HasFormDataContentDisposition(contentDisposition))
                    {
                        // Content-Disposition: form-data; name="key"
                        //
                        // value

                        // Do not limit the key name length here because the 
                        // multipart headers length limit is already in effect.
                        var key = HeaderUtilities.RemoveQuotes(contentDisposition.Name);
                        var encoding = GetEncoding(section);
                        using (var streamReader = new StreamReader(
                        section.Body,
                        encoding,
                        detectEncodingFromByteOrderMarks: true,
                        bufferSize: 1024,
                        leaveOpen: true))
                        {
                            // The value length limit is enforced by MultipartBodyLengthLimit
                            var value = await streamReader.ReadToEndAsync();
                            if (String.Equals(value, "undefined", StringComparison.OrdinalIgnoreCase))
                            {
                                value = String.Empty;
                            }
                            formAccumulator.Append(key.Value, value); // For .NET Core <2.0 remove ".Value" from key

                            if (formAccumulator.ValueCount > _defaultFormOptions.ValueCountLimit)
                            {
                                throw new InvalidDataException($"Form key count limit {_defaultFormOptions.ValueCountLimit} exceeded.");
                            }
                        }
                    }
                }

                // Drains any remaining section body that has not been consumed and
                // reads the headers for the next section.
                section = await reader.ReadNextSectionAsync();
            }

            // Bind form data to a model
            //var formValueProvider = new FormValueProvider(
            //BindingSource.Form,
            //new FormCollection(formAccumulator.GetResults()),
            //CultureInfo.CurrentCulture);

            //return formValueProvider;
            return eventFilesSavedToServerDir;
        }

        private static Encoding GetEncoding(MultipartSection section)
        {
            MediaTypeHeaderValue mediaType;
            var hasMediaTypeHeader = MediaTypeHeaderValue.TryParse(section.ContentType, out mediaType);
            // UTF-7 is insecure and should not be honored. UTF-8 will succeed in 
            // most cases.
            if (!hasMediaTypeHeader || Encoding.UTF7.Equals(mediaType.Encoding))
            {
                return Encoding.UTF8;
            }
            return mediaType.Encoding;
        }
    }
}