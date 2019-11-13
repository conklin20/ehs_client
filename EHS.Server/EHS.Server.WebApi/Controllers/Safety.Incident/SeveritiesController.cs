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

namespace EHS.Server.WebApi.Controllers.Common
{
    [Authorize]
    [Produces("application/json")]
    //[Route("api/v{version:apiVersion}/[controller]")]
    [Route("api/v1/[controller]")]
    [ApiController]
    public class SeveritiesController : ControllerBase
    {
        private readonly ILogger<SeveritiesController> _logger;
        private readonly ISeverityRepository _severitiesRepo;
        private readonly IMapper _mapper;

        public SeveritiesController(ILogger<SeveritiesController> logger, IMapper mapper, ISeverityRepository severitiesRepo)
        {
            _logger = logger;
            _severitiesRepo = severitiesRepo;
            _mapper = mapper;
        }

        // GET: api/severities
        [HttpGet]
        public async Task<ActionResult<List<Severity>>> Get()
        {
            try
            {
                //get the list of severities 
                var severities = await _severitiesRepo.GetAllAsync();

                if (severities == null)
                {
                    _logger.LogError("No Severities found. {0}", NotFound().ToString());
                    return NotFound();
                }

                //map the list from the domain/database model objects, to data transfer objects to pass back to the client 
                return Ok(severities.Select(_mapper.Map<Severity, SeverityDto>).ToList());
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.InnerException, ex.Message);
                return BadRequest();
            }
        }
    }
}
