using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using EHS.Server.DataAccess.Repository;
using EHS.Server.DataAccess.DatabaseModels;
using EHS.Server.DataAccess.Dtos;
using AutoMapper;
using EHS.Server.DataAccess.Queries;
using EHS.Server.WebApi.Helpers.Queries;

namespace EHS.Server.WebApi.Controllers.Common
{
    [Authorize]
    [Produces("application/json")]
    //[Route("api/v{version:apiVersion}/[controller]")]
    [Route("api/v1/[controller]")]
    //[ApiController]
    public class SafetyIncidentsController : ControllerBase
    {
        private readonly ILogger<SafetyIncidentsController> _logger;
        private readonly ISafetyEventRepository _safetyEventsRepo;
        private readonly IMapper _mapper;
        //private const string apiVersion = HttpContext.GetRequestedApiVersion();

        public SafetyIncidentsController(ILogger<SafetyIncidentsController> logger, IMapper mapper, ISafetyEventRepository safetyEventsRepo)
        {
            _logger = logger;
            _safetyEventsRepo = safetyEventsRepo;
            _mapper = mapper;
        }

        // GET: api/Safety Events
        [HttpGet]
        public async Task<ActionResult<List<SafetyEvent>>> Get([FromQuery] SafetyIncidentsQuery queryParams)
        {
            try
            {
                //parse the queryParams object and send list to repo
                List<DynamicParam> dynamicParamList = new List<DynamicParam>();
                if (queryParams.EventId != null)
                {
                    dynamicParamList.Add(new DynamicParam { TableAlias = "e.", FieldName = "EventId", Operator = "=", ParamName = "@EventId", SingleValue = queryParams.EventId });
                }
                if (queryParams.EventDate != DateTime.MinValue)
                {
                    dynamicParamList.Add(new DynamicParam { TableAlias = "e.", FieldName = "EventDate", Operator = "=", ParamName = "@EventDate", SingleValue = queryParams.EventDate.ToShortDateString() });
                }
                if (queryParams.StartDate != DateTime.MinValue)
                {
                    dynamicParamList.Add(new DynamicParam { TableAlias = "e.", FieldName = "EventDate", Operator = ">", ParamName = "@StartDate", SingleValue = queryParams.StartDate.ToShortDateString() });
                }
                if (queryParams.EndDate != DateTime.MinValue)
                {
                    dynamicParamList.Add(new DynamicParam { TableAlias = "e.", FieldName = "EventDate", Operator = "<", ParamName = "@EndDate", SingleValue = queryParams.EndDate.ToShortDateString() });
                }
                if (queryParams.Statuses != null)
                {
                    dynamicParamList.Add(new DynamicParam { TableAlias = "e.", FieldName = "EventStatus", Operator = "in", ParamName = "@EventStatus", MultiValue = queryParams.Statuses.Split(",") });
                }
                if (queryParams.Site != null)
                {
                    dynamicParamList.Add(new DynamicParam { TableAlias = "e.", FieldName = "Site", Operator = "=", ParamName = "@Site", SingleValue = queryParams.Site });
                }
                if (queryParams.Area != null)
                {
                    dynamicParamList.Add(new DynamicParam { TableAlias = "e.", FieldName = "Area", Operator = "=", ParamName = "@Area", SingleValue = queryParams.Area });
                }
                if (queryParams.Department != null)
                {
                    dynamicParamList.Add(new DynamicParam { TableAlias = "e.", FieldName = "Department", Operator = "=", ParamName = "@Department", SingleValue = queryParams.Department });
                }
                if (queryParams.DepartmentId != null)
                {
                    dynamicParamList.Add(new DynamicParam { TableAlias = "e.", FieldName = "DepartmentId", Operator = "=", ParamName = "@DepartmentId", SingleValue = queryParams.DepartmentId });
                }
                if (queryParams.InitialCategory != null)
                {
                    dynamicParamList.Add(new DynamicParam { TableAlias = "e.", FieldName = "InitialCategory", Operator = "=", ParamName = "@InitialCategory", SingleValue = queryParams.InitialCategory });
                }
                if (queryParams.ResultingCategory != null)
                {
                    dynamicParamList.Add(new DynamicParam { TableAlias = "e.", FieldName = "ResultingCategory", Operator = "=", ParamName = "@ResutingCategory", SingleValue = queryParams.ResultingCategory });
                }
                if (queryParams.IsInjury)
                {
                    dynamicParamList.Add(new DynamicParam { TableAlias = "e.", FieldName = "IsInjury", Operator = "=", ParamName = "@IsInjury", SingleValue = queryParams.IsInjury.ToString() });
                }
                //get the list of safetyEvents 
                var safetyEvents = await _safetyEventsRepo.GetAllAsync(dynamicParamList);

                if (safetyEvents == null || safetyEvents.Count == 0)
                {
                    _logger.LogError("No Safety Events found. {0}", NotFound().ToString());
                    return NotFound(); 
                }

                //map the list from the domain/database model objects, to data transfer objects to pass back to the client 
                return Ok(safetyEvents.Select(_mapper.Map<SafetyEvent, SafetyEventDto>).ToList());
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.InnerException, ex.Message);
                return BadRequest(ex);
            }
        }

        // GET: api/Safety Events/5
        [HttpGet("{eventId}", Name = "GetSafetyEvent")]
        public async Task<ActionResult<SafetyEvent>> Get([FromRoute]int eventId)
        {
            try
            {
                //get the SafetyEvent 
                var SafetyEvent = await _safetyEventsRepo.GetByIdAsync(eventId);

                if (SafetyEvent == null)
                {
                    _logger.LogError("SafetyEvent {0} not found. {1}", eventId, NotFound().ToString());
                    return NotFound();
                }

                //map the SafetyEvent from the domain/database model object, to data transfer object to pass back to the client 
                return Ok(_mapper.Map<SafetyEvent, SafetyEventDto>(SafetyEvent));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.InnerException, ex.Message);
                return BadRequest(ex);
            }
        }

        // POST: api/Safety Events
        [HttpPost]
        public async Task<ActionResult<SafetyEvent>> Post([FromBody]SafetyEvent safetyEventToAdd)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    var modelState = new BadRequestObjectResult(ModelState);
                    _logger.LogError(BadRequest(modelState).ToString());
                    return BadRequest(modelState);
                }

                //map the new SafetyEvent from the incoming dto object to the domain/database model object so we can pass it to the Add() method
                int newId = await _safetyEventsRepo.AddAsync(safetyEventToAdd);

                safetyEventToAdd.EventId = newId; // <--not how i should do this
                return CreatedAtAction("Post", new { eventId = newId },  _mapper.Map<SafetyEvent, SafetyEventDto>(safetyEventToAdd));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.InnerException, ex.Message);
                return BadRequest(ex);
            }
        }

        // PUT: api/Safety Events/5
        [HttpPut("{eventId}")]
        public async Task<ActionResult<SafetyEvent>> Put([FromBody]SafetyEvent safetyEventToUpdate, [FromRoute]int eventId, [FromQuery]string userId)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    var modelState = new BadRequestObjectResult(ModelState); 
                    _logger.LogError(BadRequest(modelState).ToString());
                    return BadRequest(modelState);
                }

                //map the SafetyEvent from the incoming dto object to the domain/database model object so we can pass it to the Update() method
                var success = await _safetyEventsRepo.UpdateAsync(safetyEventToUpdate, eventId, userId);

                //map back to dto, to pass back to client 
                return Accepted(_mapper.Map<SafetyEvent, SafetyEventDto>(safetyEventToUpdate));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.InnerException, ex.Message);
                return BadRequest(ex);
            }
        }

        // DELETE: 
        [HttpDelete("{eventId}")]
        public async Task<ActionResult<SafetyEvent>> Delete([FromRoute]int eventId, [FromQuery]string userId)
        {
            try
            {
                var deletedSafetyEventStatus = await _safetyEventsRepo.DeleteAsync(eventId, userId);
                
                return AcceptedAtAction("Delete", "SafetyIncidents");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.InnerException, ex.Message);
                return BadRequest(ex);
            }
        }
    }
}
