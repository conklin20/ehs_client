using System;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using EHS.Server.Contracts;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using EHS.Server.DataAccess.Repository; 

namespace EHS.Server.Worker
{
    public class FileSweeperWorker : BackgroundService, ILogSweeper
    {
        private readonly ILogger<FileSweeperWorker> _logger;
        private readonly IConfiguration _config; 
        private readonly IFileSweeperRepository _fileSweeperRepository;

        public FileSweeperWorker(ILogger<FileSweeperWorker> logger, IConfiguration config, IFileSweeperRepository fileSweeperRepository)
        {
            _logger = logger;
            _config = config; 
            _fileSweeperRepository = fileSweeperRepository;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            while (!stoppingToken.IsCancellationRequested)
            {
                _logger.LogInformation("Starting File Sweeper process...");
                MoveLogFiles();
                int delay = _config.GetValue("WorkerSettings:FileSweeper:Interval", 600000); //default to 10 mins if no value in appSettings.{env}.json
                await Task.Delay(delay, stoppingToken); 
            }
        }

        public void MoveLogFiles()
        {
            try
            {
                string currentDir = Directory.GetCurrentDirectory();
                string[] dirs = Directory.GetDirectories(currentDir, "pickup", SearchOption.AllDirectories);
                //looping through any logs\pickup dir, as there may be multiple in dev (debug/release)
                foreach (string dir in dirs)
                {
                    try
                    {
                        string[] files = Directory.GetFiles(dir, "*.log", SearchOption.TopDirectoryOnly);
                        foreach (string logFile in files)
                        {
                            _logger.LogInformation($"Processing file {logFile}...");

                            //convert file to DataTable and save data to db
                            SaveToDb(ConvertLogToTable(dir, logFile));

                            //delete the file 
                            DeleteFile(logFile);
                        }
                    }
                    catch (Exception ex)
                    {
                        _logger.LogError(ex.Message); 
                    }
                }

                //call stored proc to process the staged data (async)
                ProcessStagedData(); 

            }
            catch (Exception ex)
            {
                _logger.LogError($"File Sweeper Process failed. Error: {ex.Message}", ex);
            }

            _logger.LogInformation("File Sweeper process completed.");
        }

        public DataTable ConvertLogToTable(string dir, string fileName)
        {
            using DataTable dt = new DataTable("Logs");
            dt.Columns.Add("AppId", typeof(int));
            dt.Columns.Add("Level", typeof(string));
            dt.Columns.Add("Logger", typeof(string));
            dt.Columns.Add("UserName", typeof(string));
            dt.Columns.Add("MachineName", typeof(string));
            dt.Columns.Add("LoggedOn", typeof(DateTime));
            dt.Columns.Add("Thread", typeof(string));
            dt.Columns.Add("Message", typeof(string));
            dt.Columns.Add("CallSite", typeof(string));
            dt.Columns.Add("Exception", typeof(string));
            dt.Columns.Add("StackTrace", typeof(string));


            //NEED TO FIND OUT HOW TO PARSE THE FILE WHEN IT SPANS MULTIPLE LINES (ON ERRORS) 
            var lines = File.ReadAllLines(fileName);

            //byte[] bytes = File.ReadAllBytes(fileName);
            //var fs = new FileStream(fileName, FileMode.Open, FileAccess.Read);
            //var file = fs.Read(bytes, 1, bytes.Length);


            // reading rest of the data
            for (int i = 1; i < lines.Count(); i++)
            {
                try
                {
                    DataRow dr = dt.NewRow();
                    string[] values = lines[i].Split(new char[] { '|' });

                    for (int j = 0; j < values.Count() && j < dt.Columns.Count; j++)
                       
                        dr[j] = values[j];

                    dt.Rows.Add(dr);
                } 
                catch (Exception ex)
                {
                    _logger.LogError($"Errors occurred while processing file {fileName}. Some data may not have been loaded to the database. Inspect the file for more information", ex);

                    //move file to error directory
                    //fileName being passed in includes the path + filename
                    string fileNameOnly = Path.GetFileName(fileName);
                    string sourcePath = Path.GetFullPath(dir);
                    string destPath = $"{sourcePath}\\errors\\";

                    if (!Directory.Exists(destPath))
                    {
                        try
                        {
                            Directory.CreateDirectory(destPath);
                        }
                        catch (Exception ex2)
                        {
                            _logger.LogError($"Coultnt create /errors directory. Error: {ex.Message}", ex);

                        }
                    }

                    File.Move(fileName, destPath + fileNameOnly);
                }
            }
            return dt;
        }

        public void SaveToDb(DataTable dt)
        {
            try
            {
                _logger.LogInformation($"Inserting {dt.Rows.Count} rows to db...");
                long InsertedRows = _fileSweeperRepository.StageData(dt);
                //_logger.LogInformation($"{InsertedRows} saved to db");
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed to insert rows. Error: {ex.Message}", ex);
            }
        }

        public void DeleteFile(string fileName)
        {
            try
            {
                _logger.LogInformation($"Processing file {fileName} finished. File deleted");
                File.Delete(fileName);
            }
            catch(Exception ex)
            {
                _logger.LogError($"Failed to delete file. This needs addressed asap. Error: {ex.Message}", ex);
            }
        }

        public void ProcessStagedData()
        {
            try
            {
                _logger.LogInformation("Initiating 'Process Staged Data' process. ");
                _fileSweeperRepository.ProcessData();
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed to process the staged data. This needs addressed asap. Error: {ex.Message}", ex);
            }
        }
    }
}
