using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using EHS.Server.DataAccess.DatabaseModels;
using EHS.Server.DataAccess.Dtos;
using EHS.Server.DataAccess.Repository;
using EHS.Server.WebApi.Helpers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace EHS.Server.WebApi.Controllers.Common
{
    [Authorize]
    [Produces("application/json")]
    [Route("api/v{version:apiVersion}/[controller]")]
    [ApiController]
    public class EventFilesController : ControllerBase
    {
        private readonly ILogger<EventFilesController> _logger;
        private readonly IEventFileRepository _eventFileRepository;
        private readonly IMapper _mapper;
        private readonly IConfiguration _config;
        
        public EventFilesController(ILogger<EventFilesController> logger, IMapper mapper, IEventFileRepository eventFileRepository, IConfiguration config)
        {
            _logger = logger;
            _eventFileRepository = eventFileRepository;
            _mapper = mapper;
            _config = config;
        }

        [HttpPost]
        [DisableFormValueModelBinding]
        [RequestFormLimits(MultipartBodyLengthLimit = 10500000)] // ~10mb
        public async Task<IActionResult> Index()
        {
            try
            {
                string fileDir = _config.GetValue("AppSettings:EventFilesDir", "C:\\ehstemp");
                List<EventFile> eventFiles = new List<EventFile>();
                using (var stream = System.IO.File.Create(fileDir + "fstemp.temp")) ;
                {
                    //formModel = await Request.StreamFile(stream);
                    eventFiles = await Request.StreamFile(fileDir);
                }

                //var viewModel = new MyViewModel();
                //var model = new EventFile();

                //var bindingSuccessful = await TryUpdateModelAsync(model, prefix: "",
                //   valueProvider: formModel);

                //if (!bindingSuccessful)
                //{
                //    if (!ModelState.IsValid)
                //    {
                //        return BadRequest(ModelState);
                //    }
                //}

                if (eventFiles == null)
                {
                    _logger.LogError("No Files Found. {0}", NotFound().ToString());
                    return NotFound();
                }

                int success = await _eventFileRepository.AddFileAsync(eventFiles);
                
                if (success != 1)
                {
                    _logger.LogError("Files saved to server, but failed to save to Database. Please reach out for assistance.");
                    return NotFound();
                }

                //map the list from the domain/database model objects, to data transfer objects to pass back to the client 
                return Ok(eventFiles.Select(_mapper.Map<EventFile, EventFileDto>).ToList());
            }
            catch(Exception ex)
            {
                _logger.LogError(ex.InnerException, ex.Message);
                return BadRequest();
            }
        }

        [HttpGet("{eventId}", Name = "GetEventFiles")]
        public async Task<ActionResult<List<EventFile>>> GetByEventId([FromRoute]int eventId)
        {
            try
            {
                //get the action 
                var eventFiles = await _eventFileRepository.GetFilesByEventIdAsync(eventId);

                if (eventFiles == null)
                {
                    _logger.LogError("Files for event {0} not found. {1}", eventId, NotFound().ToString());
                    return NotFound();
                }

                //map the action from the domain/database model object, to data transfer object to pass back to the client 
                return Ok(eventFiles.Select(_mapper.Map<EventFile, EventFileDto>).ToList());
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.InnerException, ex.Message);
                return BadRequest();
            }
        }


        [HttpDelete("{eventFileId}")]
        public async Task<ActionResult<List<EventFile>>> Delete([FromRoute]int eventFileId, [FromQuery]string userId)
        {
            try
            {
                //get the action 
                var eventFiles = await _eventFileRepository.DeleteEventFileAsync(eventFileId, userId);

                //map the action from the domain/database model object, to data transfer object to pass back to the client 
                return Accepted(); 
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.InnerException, ex.Message);
                return BadRequest();
            }
        }
    }
}