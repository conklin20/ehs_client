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
    public class HierarchiesController : ControllerBase
    {
        private readonly ILogger<HierarchiesController> _logger;
        private readonly IHierarchyRepository _hierarchyRepo;
        
        public HierarchiesController(ILogger<HierarchiesController> logger, IHierarchyRepository hierarchyRepo)
        {
            _logger = logger;
            _hierarchyRepo = hierarchyRepo;
        }

        // GET: api/Hierarchies
        [HttpGet]
        public async Task<ActionResult<List<Hierarchy>>> Get()
        {
            try
            {
                return await _hierarchyRepo.GetAll();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
                return BadRequest(); 
            }
        }

        // GET: api/Hierarchies/5
        [HttpGet("{id}", Name = "GetHierarchy")]
        public async Task<ActionResult<Hierarchy>> Get(int id)
        {
            try
            {
                return await _hierarchyRepo.GetById(id); 
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
                return BadRequest();
            }
        }

        // POST: api/Hierarchies
        [HttpPost]
        public async Task<ActionResult<Hierarchy>> Post([FromBody] Hierarchy newHierarchy)
        {
            try
            {
                return await _hierarchyRepo.Add(newHierarchy);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
                return BadRequest();
            }
        }

        // PUT: api/Hierarchies/5
        [HttpPut("{id}")]
        public async Task<ActionResult<Hierarchy>> Put(int id, [FromBody] string userId)
        {
            try
            {
                return await _hierarchyRepo.Update(id, userId);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
                return BadRequest();
            }
        }

        // DELETE: api/ApiWithActions/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<Hierarchy>> Delete(int id, [FromBody] string userId)
        {
            try
            {
                return await _hierarchyRepo.Delete(id, userId);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
                return BadRequest();
            }
        }
    }
}
