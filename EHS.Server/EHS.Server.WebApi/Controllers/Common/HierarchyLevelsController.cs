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
    public class HierarchyLevelsController : ControllerBase
    {
        private readonly ILogger<HierarchyLevelsController> _logger;
        private readonly IHierarchyLevelRepository _hierarchyLevelRepo;
        private readonly IMapper _mapper;

        public HierarchyLevelsController(ILogger<HierarchyLevelsController> logger, IHierarchyLevelRepository hierarchyLevelRepo, IMapper mapper)
        {
            _logger = logger;
            _hierarchyLevelRepo = hierarchyLevelRepo;
            _mapper = mapper;
        }

        // GET: api/Hierarchies
        [HttpGet]
        public async Task<ActionResult<List<HierarchyLevel>>> Get()
        {
            try
            {
                var hierarchyLevels = await _hierarchyLevelRepo.GetAllAsync();

                if (hierarchyLevels == null)
                {
                    _logger.LogError("No Hierarchy Levels found. {0}", NotFound().ToString());
                    return NotFound();
                }

                //map the list from the domain/database model objects, to data transfer objects to pass back to the client 
                return Ok(hierarchyLevels.Select(_mapper.Map<HierarchyLevel, HierarchyLevelDto>).ToList());
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
                return BadRequest();
            }
        }

        // GET: api/Hierarchies/5
        [HttpGet("{id}", Name = "GetHierarchyLevel")]
        public async Task<ActionResult<HierarchyLevel>> Get(int id)
        {
            try
            {
                var hierarchyLevel = await _hierarchyLevelRepo.GetByIdAsync(id);

                if (hierarchyLevel == null)
                {
                    _logger.LogError("Hierarchy {0} not found. {1}", id, NotFound().ToString());
                    return NotFound();
                }
                
                //map the hierarchy from the domain/database model object, to data transfer object to pass back to the client 
                return Ok(_mapper.Map<HierarchyLevel, HierarchyLevelDto>(hierarchyLevel));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
                return BadRequest();
            }
        }
    }
}
