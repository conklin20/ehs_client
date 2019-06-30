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

        public HierarchyLevelsController(ILogger<HierarchyLevelsController> logger, IHierarchyLevelRepository hierarchyLevelRepo)
        {
            _logger = logger;
            _hierarchyLevelRepo = hierarchyLevelRepo;
        }

        // GET: api/Hierarchies
        [HttpGet]
        public async Task<ActionResult<List<HierarchyLevel>>> Get()
        {
            try
            {
                return await _hierarchyLevelRepo.GetAll();
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
                return await _hierarchyLevelRepo.GetById(id);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
                return BadRequest();
            }
        }
    }
}
