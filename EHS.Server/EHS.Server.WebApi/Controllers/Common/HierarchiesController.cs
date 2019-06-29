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
        
        public HierarchiesController(ILogger<HierarchiesController> logger, IHierarchyRepository attributeRepo)
        {
            _logger = logger;
            _hierarchyRepo = attributeRepo;
        }

        // GET: api/Hierarchies
        [HttpGet]
        public async Task<ActionResult<List<Hierarchy>>> Get()
        {
            try
            {
                _logger.LogInformation("Awaiting hierarchy GetAll() Call");
                return await _hierarchyRepo.GetAll();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
                return BadRequest(); 
            }
        }

        // GET: api/Hierarchies/5
        [HttpGet("{id}", Name = "Get")]
        public async Task<ActionResult<Hierarchy>> Get(int id)
        {
            try
            {
                _logger.LogInformation("Awaiting hierarchy GetById() Call");
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
        public void Post([FromBody] string value)
        {
        }

        // PUT: api/Hierarchies/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody] string value)
        {
        }

        // DELETE: api/ApiWithActions/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
    }
}
