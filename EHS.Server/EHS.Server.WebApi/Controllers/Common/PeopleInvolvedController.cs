using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using EHS.Server.DataAccess.Repository;
using EHS.Server.DataAccess.DatabaseModels;
using AutoMapper;
using System.Linq;
using EHS.Server.DataAccess.Dtos;

namespace EHS.Server.WebApi.Controllers.Common
{
    [Authorize]
    [Produces("application/json")]
    //[Route("api/v{version:apiVersion}/[controller]")]
    [Route("api/v1/[controller]")]
    [ApiController]
    public class PeopleInvolvedController : ControllerBase
    {
        private readonly ILogger<PeopleInvolvedController> _logger;
        private readonly IPeopleInvolvedRepository _peopleInvolvedRepo;
        private readonly IMapper _mapper;

        public PeopleInvolvedController(ILogger<PeopleInvolvedController> logger, IMapper mapper, IPeopleInvolvedRepository peopleInvolvedRepo)
        {
            _logger = logger;
            _peopleInvolvedRepo = peopleInvolvedRepo;
            _mapper = mapper;
        }

        // POST: api/peopleinvolved
        [HttpPost]
        public async Task<ActionResult<PeopleInvolved>> Post([FromBody]List<PeopleInvolved> peopleInvolved, [FromQuery]string userId)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    _logger.LogError(BadRequest().ToString());
                    return BadRequest();
                }

                var addedActions = await _peopleInvolvedRepo.SavePeopleInvolvedAsync(peopleInvolved, userId); 

                return CreatedAtAction("Post", "PeopleInvolved");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.InnerException, ex.Message);
                return BadRequest();
            }
        }

        [HttpGet("{eventId}", Name = "GetEventPeople")]
        public async Task<ActionResult<List<PeopleInvolved>>> GetByEventId([FromRoute]int eventId)
        {
            try
            {
                //get the action 
                var peopleInvolved = await _peopleInvolvedRepo.GetPeopleByEventIdAsync(eventId); 

                if (peopleInvolved == null)
                {
                    _logger.LogError("People for event {0} not found. {1}", eventId, NotFound().ToString());
                    return NotFound();
                }

                //map the action from the domain/database model object, to data transfer object to pass back to the client 
                return Ok(peopleInvolved.Select(_mapper.Map<PeopleInvolved, PeopleInvolvedDto>).ToList());
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.InnerException, ex.Message);
                return BadRequest();
            }
        }
    }
}