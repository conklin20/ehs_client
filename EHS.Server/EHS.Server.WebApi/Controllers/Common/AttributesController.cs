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
    [Route("api/v{version:apiVersion}/[controller]")]
    [ApiController]
    public class AttributesController : ControllerBase
    {
        private readonly ILogger<AttributesController> _logger;
        private readonly IAttributeRepository _attributesRepo;
        private readonly IMapper _mapper;

        public AttributesController(ILogger<AttributesController> logger, IMapper mapper, IAttributeRepository attributesRepo)
        {
            _logger = logger;
            _attributesRepo = attributesRepo;
            _mapper = mapper;
        }

        // GET: api/Actions
        [HttpGet]
        public async Task<ActionResult<List<DataAccess.DatabaseModels.Attribute>>> Get()
        {
            try
            {
                //get the list of attributes 
                var attributes = await _attributesRepo.GetAllAsync();

                if (attributes == null)
                {
                    _logger.LogError("No Actions found. {0}", NotFound().ToString());
                    return NotFound();
                }

                //map the list from the domain/database model objects, to data transfer objects to pass back to the client 
                return Ok(attributes.Select(_mapper.Map<DataAccess.DatabaseModels.Attribute, AttributeDto>).ToList());
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
                return BadRequest();
            }
        }

        // GET: api/Actions/5
        [HttpGet("{id}", Name = "GetAttribute")]
        public async Task<ActionResult<DataAccess.DatabaseModels.Attribute>> Get([FromRoute]int id)
        {
            try
            {
                //get the attribute 
                var attribute = await _attributesRepo.GetByIdAsync(id);

                if (attribute == null)
                {
                    _logger.LogError("Attribute {0} not found. {1}", id, NotFound().ToString());
                    return NotFound();
                }

                //map the attribute from the domain/database model object, to data transfer object to pass back to the client 
                return Ok(_mapper.Map<DataAccess.DatabaseModels.Attribute, AttributeDto>(attribute));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
                return BadRequest();
            }
        }
    }
}
