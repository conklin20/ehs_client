using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using EHS.Server.DataAccess.Repository;
using Microsoft.Extensions.Logging;

namespace EHS.Server.WebApi.Controllers.Common
{
    [Produces("application/json")]
    [Route("api/[controller]")]
    [ApiController]
    public class HierarchiesController : ControllerBase
    {
        private readonly ILogger<HierarchiesController> _logger;
        private readonly IHierarchyRepository _db;

        public HierarchiesController(ILogger<HierarchiesController> logger, IHierarchyRepository attributeRepo)
        {
            this._logger = logger;
            this._db = attributeRepo;
        }

        // GET: api/Hierarchies
        [HttpGet]
        public IEnumerable<string> Get()
        {
            return null; 
        }

        // GET: api/Hierarchies/5
        [HttpGet("{id}", Name = "Get")]
        public string Get(int id)
        {
            return "value";
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
