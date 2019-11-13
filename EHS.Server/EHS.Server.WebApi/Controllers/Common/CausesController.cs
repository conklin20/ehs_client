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
    public class CausesController : ControllerBase
    {
        private readonly ILogger<CausesController> _logger;
        private readonly ICausesRepository _causesRepository;
        private readonly IMapper _mapper;

        public CausesController(ILogger<CausesController> logger, IMapper mapper, ICausesRepository causesRepository)
        {
            _logger = logger;
            _causesRepository = causesRepository;
            _mapper = mapper;
        }

        // POST: api/causes
        [HttpPost]
        public async Task<ActionResult<Cause>> Post([FromBody]List<Cause> causes, [FromQuery]string userId)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    _logger.LogError(BadRequest().ToString());
                    return BadRequest();
                }

                var addedActions = await _causesRepository.SaveCausesAsync(causes, userId); 

                return CreatedAtAction("Post", "Causes");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.InnerException, ex.Message);
                return BadRequest();
            }
        }

        [HttpGet("{eventId}", Name = "GetEventCauses")]
        public async Task<ActionResult<List<Cause>>> GetByEventId([FromRoute]int eventId)
        {
            try
            {
                //get the action 
                var causes = await _causesRepository.GetCausesByEventIdAsync(eventId); 

                if (causes == null)
                {
                    _logger.LogError("Causes for event {0} not found. {1}", eventId, NotFound().ToString());
                    return NotFound();
                }

                //map the action from the domain/database model object, to data transfer object to pass back to the client 
                return Ok(causes.Select(_mapper.Map<Cause, CauseDto>).ToList());
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.InnerException, ex.Message);
                return BadRequest();
            }
        }
    }
}