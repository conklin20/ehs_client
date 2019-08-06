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
    public class HierarchiesController : ControllerBase
    {
        private readonly ILogger<HierarchiesController> _logger;
        private readonly IHierarchyRepository _hierarchyRepo;
        private readonly IMapper _mapper; 
        
        public HierarchiesController(ILogger<HierarchiesController> logger, IMapper mapper, IHierarchyRepository hierarchyRepo)
        {
            _logger = logger;
            _hierarchyRepo = hierarchyRepo;
            _mapper = mapper;
        }

        // GET: api/Hierarchies
        [HttpGet]
        public async Task<ActionResult<List<Hierarchy>>> Get()
        {
            try
            {
                //get the list of hierarchies 
                var hierarchies = await _hierarchyRepo.GetAllAsync();

                if (hierarchies == null)
                {
                    _logger.LogError("No Hierarchies found. {0}", NotFound().ToString());
                    return NotFound();
                }

                //map the list from the domain/database model objects, to data transfer objects to pass back to the client 
                return Ok(hierarchies.Select(_mapper.Map<Hierarchy, HierarchyDto>).ToList());
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
                return BadRequest(); 
            }
        }

        // GET: api/Hierarchies
        [HttpGet("{id}/{minLevel}", Name = "GetFullTree")]
        public async Task<ActionResult<List<Hierarchy>>> Get([FromRoute] int id, [FromRoute] int minLevel = 0)
        {
            try
            {
                //get the list of hierarchies 
                var hierarchies = await _hierarchyRepo.GetFullTreeAsync(id, minLevel);

                if (hierarchies == null)
                {
                    _logger.LogError("No Hierarchies found. {0}", NotFound().ToString());
                    return NotFound();
                }

                //map the list from the domain/database model objects, to data transfer objects to pass back to the client 
                return Ok(hierarchies.Select(_mapper.Map<Hierarchy, HierarchyDto>).ToList());
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
                //get the hierarchy 
                var hierarchy = await _hierarchyRepo.GetByIdAsync(id);

                if (hierarchy == null)
                {
                    _logger.LogError("Hierarchy {0} not found. {1}", id, NotFound().ToString());
                    return NotFound(); 
                }

                //map the hierarchy from the domain/database model object, to data transfer object to pass back to the client 
                return Ok(_mapper.Map<Hierarchy, HierarchyDto>(hierarchy));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
                return BadRequest();
            }
        }

        // POST: api/Hierarchies
        [HttpPost]
        public async Task<ActionResult<Hierarchy>> Post([FromBody]Hierarchy hierarchyToAdd)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    _logger.LogError(BadRequest().ToString());
                    return BadRequest();
                }

                //map the new hierarchy from the incoming dto object to the domain/database model object so we can pass it to the Add() method
                //var hierarchyToAdd = _mapper.Map<HierarchyDto, Hierarchy>(hierarchyToAddDto);
                var addedHierarchy = await _hierarchyRepo.AddAsync(hierarchyToAdd);

                //map back to dto, to pass back to client 
                //return CreatedAtAction("GetHierarchy", new { id = addedHierarchy.HierarchyId }, addedHierarchy); 
                return CreatedAtAction("GetHierarchy", new { id = addedHierarchy.HierarchyId }, _mapper.Map<Hierarchy, HierarchyDto>(addedHierarchy));
                //return _mapper.Map<Hierarchy, HierarchyDto>(addedHierarchy);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
                return BadRequest();
            }
        }

        // PUT: api/Hierarchies/5
        [HttpPut("{id}")]
        public async Task<ActionResult<Hierarchy>> Put([FromBody]Hierarchy hierarchyToUpdate, [FromHeader]string userId)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    _logger.LogError(BadRequest().ToString());
                    return BadRequest();
                }

                //map the hierarchy from the incoming dto object to the domain/database model object so we can pass it to the Update() method
                //var hierarchyToUpdate = _mapper.Map<HierarchyDto, Hierarchy>(hierarchyToUpdateDto);
                var updatedHierarchy = await _hierarchyRepo.UpdateAsync(hierarchyToUpdate, userId);

                //map back to dto, to pass back to client 
                return Accepted(_mapper.Map<Hierarchy, HierarchyDto>(updatedHierarchy));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
                return BadRequest();
            }
        }

        // DELETE: api/ApiWithActions/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<Hierarchy>> Delete([FromBody]Hierarchy hierarchyToDelete, [FromHeader]string userId)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    _logger.LogError(BadRequest().ToString());
                    return BadRequest();
                }

                //map the hierarchy from the incoming dto object to the domain/database model object so we can pass it to the Delete() method
                //var hierarchyToDelete = _mapper.Map<HierarchyDto, Hierarchy>(hierarchyToDeleteDto);
                var deletedHierarchy =  await _hierarchyRepo.DeleteAsync(hierarchyToDelete, userId);

                //map back to dto, to pass back to client 
                return Accepted(_mapper.Map<Hierarchy, HierarchyDto>(deletedHierarchy)); 
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
                return BadRequest();
            }
        }
    }
}
