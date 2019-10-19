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
    [Route("api/v{version:apiVersion}/[controller]")]
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

                var addedActions = await _peopleInvolvedRepo.SavePeopleInvolved(peopleInvolved, userId); 

                return CreatedAtAction("Post", "PeopleInvolved");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
                return BadRequest();
            }
        }
    }
}