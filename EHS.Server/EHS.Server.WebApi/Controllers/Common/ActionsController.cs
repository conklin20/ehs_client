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
using EHS.Server.WebApi.Helpers.Queries;
using EHS.Server.DataAccess.Queries;

namespace EHS.Server.WebApi.Controllers.Common
{
    [Authorize]
    [Produces("application/json")]
    //[Route("api/v{version:apiVersion}/[controller]")]
    [Route("api/v1/[controller]")]
    [ApiController]
    public class ActionsController : ControllerBase
    {
        private readonly ILogger<ActionsController> _logger;
        private readonly IActionRepository _actionRepo;
        private readonly IMapper _mapper;

        public ActionsController(ILogger<ActionsController> logger, IMapper mapper, IActionRepository actionRepo)
        {
            _logger = logger;
            _actionRepo = actionRepo;
            _mapper = mapper;
        }

        // GET: api/Actions
        [HttpGet]
        public async Task<ActionResult<List<DataAccess.DatabaseModels.Action>>> Get([FromQuery] ActionsQuery queryParams)
        {
            try
            {
                //parse the queryParams object and send list to repo
                List<DynamicParam> dynamicParamList = new List<DynamicParam>();
                if (queryParams.EventId != null)
                {
                    dynamicParamList.Add(new DynamicParam { TableAlias = "ac.", FieldName = "EventId", Operator = "=", ParamName = "@EventId", SingleValue = queryParams.EventId });
                }
                if (queryParams.UserId != null)
                {
                    dynamicParamList.Add(new DynamicParam { TableAlias = "ac.", FieldName = "AssignedTo", Operator = "=", ParamName = "@UserId", SingleValue = queryParams.UserId });
                }
                if (queryParams.EventStatus != null)
                {
                    dynamicParamList.Add(new DynamicParam { TableAlias = "e.", FieldName = "EventStatus", Operator = "=", ParamName = "@EventStatus", SingleValue = queryParams.EventStatus });
                }


                //get the list of actions 
                var actions = await _actionRepo.GetAllAsync(dynamicParamList);

                if (actions == null)
                {
                    _logger.LogError("No Actions found. {0}", NotFound().ToString());
                    return NotFound();
                }

                //map the list from the domain/database model objects, to data transfer objects to pass back to the client 
                return Ok(actions.Select(_mapper.Map<DataAccess.DatabaseModels.Action, ActionDto>).ToList());
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.InnerException, ex.Message);
                return BadRequest(ex);
            }
        }

        [HttpGet("{eventId}", Name = "GetEventActions")]
        public async Task<ActionResult<List<DataAccess.DatabaseModels.Action>>> GetByEventId([FromRoute]int eventId)
        {
            try
            {
                //get the action 
                var actions = await _actionRepo.GetByEventId(eventId);

                if (actions == null)
                {
                    _logger.LogError("Actions for event {0} not found. {1}", eventId, NotFound().ToString());
                    return NotFound();
                }

                //map the action from the domain/database model object, to data transfer object to pass back to the client 
                return Ok(actions.Select(_mapper.Map<DataAccess.DatabaseModels.Action, ActionDto>).ToList());
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.InnerException, ex.Message);
                return BadRequest(ex);
            }
        }

        // GET: api/Actions/5
        [HttpGet("/AssignedToMe", Name = "GetMyActions")]
        public async Task<ActionResult<List<DataAccess.DatabaseModels.Action>>> Get(string userId)
        {
            try
            {
                //get the action 
                var actions = await _actionRepo.GetMyActionsAsync(userId);

                if (actions == null)
                {
                    _logger.LogError("Actions for user {0} not found. {1}", userId, NotFound().ToString());
                    return NotFound();
                }

                //map the action from the domain/database model object, to data transfer object to pass back to the client 
                return Ok(actions.Select(_mapper.Map<DataAccess.DatabaseModels.Action, ActionDto>).ToList());
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.InnerException, ex.Message);
                return BadRequest(ex);
            }
        }

        // GET: api/Actions/5
        //[HttpGet("{id}", Name = "GetAction")]
        //public async Task<ActionResult<DataAccess.DatabaseModels.Action>> Get([FromRoute]int id)
        //{
        //    try
        //    {
        //        //get the action 
        //        var action = await  _actionRepo.GetByIdAsync(id);

        //        if (action == null)
        //        {
        //            _logger.LogError("Action {0} not found. {1}", id, NotFound().ToString());
        //            return NotFound();
        //        }

        //        //map the action from the domain/database model object, to data transfer object to pass back to the client 
        //        return Ok(_mapper.Map<DataAccess.DatabaseModels.Action, ActionDto>(action));
        //    }
        //    catch (Exception ex)
        //    {
        //        _logger.LogError(ex.InnerException, ex.Message);
        //        return BadRequest();
        //    }
        //}

        // POST: api/Actions
        [HttpPost]
        public async Task<ActionResult<DataAccess.DatabaseModels.Action>> Post([FromBody]List<DataAccess.DatabaseModels.Action> actionsToAdd)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    var modelState = new BadRequestObjectResult(ModelState);
                    _logger.LogError(BadRequest(modelState).ToString());
                    return BadRequest(modelState);
                }

                //map the new action from the incoming dto object to the domain/database model object so we can pass it to the Add() method
                //var actionToAdd = _mapper.Map<ActionDto, DataAccess.DatabaseModels.Action>(actionToAddDto);
                var addedActions = await _actionRepo.AddAsync(actionsToAdd);

                //map back to dto, to pass back to client 
                //return CreatedAtAction("GetHierarchy", new { id = addedAction.HierarchyId }, addedAction); 
                //return CreatedAtAction("GetAction", new { id = addedAction.ActionId }, _mapper.Map<DataAccess.DatabaseModels.Action, ActionDto>(addedAction));
           
                return CreatedAtAction("Post", "Actions");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.InnerException, ex.Message);
                return BadRequest(ex);
            }
        }

        // PUT: api/Actions/5
        [HttpPut("{id}")]
        public async Task<ActionResult<DataAccess.DatabaseModels.Action>> Put([FromBody]DataAccess.DatabaseModels.Action actionToUpdate)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    var modelState = new BadRequestObjectResult(ModelState);
                    _logger.LogError(BadRequest(modelState).ToString());
                    return BadRequest(modelState);
                }

                //map the action from the incoming dto object to the domain/database model object so we can pass it to the Update() method
                var updatedAction = await _actionRepo.UpdateAsync(actionToUpdate);

                //map back to dto, to pass back to client 
                return Accepted(_mapper.Map<DataAccess.DatabaseModels.Action, ActionDto>(updatedAction));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.InnerException, ex.Message);
                return BadRequest(ex);
            }
        }

        // DELETE: api/ApiWithActions/5
        [HttpDelete("{actionId}")]
        public async Task<ActionResult<ActionDto>> Delete( [FromRoute]int actionId, [FromQuery]string userId)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    var modelState = new BadRequestObjectResult(ModelState);
                    _logger.LogError(BadRequest(modelState).ToString());
                    return BadRequest(modelState);
                }

                //map the action from the incoming dto object to the domain/database model object so we can pass it to the Delete() method
                var deletedAction = await _actionRepo.DeleteAsync(actionId, userId);

                //map back to dto, to pass back to client 
                return AcceptedAtAction("Delete", "Actions");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.InnerException, ex.Message);
                return BadRequest(ex);
            }
        }
    }
}
