﻿using System;
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
                _logger.LogError(ex.InnerException, ex.Message);
                return BadRequest(ex);
            }
        }

        [HttpGet("fulltree/{id}", Name = "GetFullTree")]
        public async Task<ActionResult<List<Hierarchy>>> GetFullTree([FromRoute] int id)
        {
            try
            {
                //get the list of hierarchies 
                var hierarchies = await _hierarchyRepo.GetFullTreeAsync(id);

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
                _logger.LogError(ex.InnerException, ex.Message);
                return BadRequest(ex);
            }
        }

        [HttpGet("fulltreedepth/{id}", Name = "GetFullTreeWithDepth")]
        public async Task<ActionResult<List<Hierarchy>>> GetFullTreeWithDepth([FromRoute] int id)
        {
            try
            {
                //get the list of hierarchies 
                var hierarchies = await _hierarchyRepo.GetFullTreeWithDepthAsync(id);

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
                _logger.LogError(ex.InnerException, ex.Message);
                return BadRequest(ex);
            }
        }

        [HttpGet("leafnodes/{levelName}", Name = "GetLeafNodes")]
        public async Task<ActionResult<List<Hierarchy>>> GetLeafNodes([FromRoute] string levelName)
        {
            try
            {
                //get the list of hierarchies 
                var hierarchies = await _hierarchyRepo.GetLeafNodesAsync(levelName);

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
                _logger.LogError(ex.InnerException, ex.Message);
                return BadRequest(ex);
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
                _logger.LogError(ex.InnerException, ex.Message);
                return BadRequest(ex);
            }
        }

        // POST: api/Hierarchies
        [HttpPost]
        public async Task<ActionResult<Hierarchy>> Post([FromBody]List<Hierarchy> hierarchies, [FromQuery]bool firstChild, [FromQuery]string userId )
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    var modelState = new BadRequestObjectResult(ModelState);
                    _logger.LogError(BadRequest(modelState).ToString());
                    return BadRequest(modelState);
                }

                //map the new hierarchy from the incoming dto object to the domain/database model object so we can pass it to the Add() method
                var addedHierarchy = await _hierarchyRepo.AddAsync(hierarchies, firstChild, userId);

                //map back to dto, to pass back to client 
                //return CreatedAtAction("GetHierarchy", new { id = addedHierarchy.HierarchyId }, addedHierarchy); 
                return CreatedAtAction("Post", _mapper.Map<Hierarchy, HierarchyDto>(addedHierarchy));
                //return _mapper.Map<Hierarchy, HierarchyDto>(addedHierarchy);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.InnerException, ex.Message);
                return BadRequest(ex);
            }
        }

        // PUT: api/Hierarchies/5
        [HttpPut("{id}")]
        public async Task<ActionResult<Hierarchy>> Put([FromBody]Hierarchy hierarchy, [FromQuery]string userId)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    var modelState = new BadRequestObjectResult(ModelState);
                    _logger.LogError(BadRequest(modelState).ToString());
                    return BadRequest(modelState);
                }

                //map the hierarchy from the incoming dto object to the domain/database model object so we can pass it to the Update() method
                //var hierarchyToUpdate = _mapper.Map<HierarchyDto, Hierarchy>(hierarchyToUpdateDto);
                var updatedHierarchy = await _hierarchyRepo.UpdateAsync(hierarchy, userId);

                //map back to dto, to pass back to client 
                return AcceptedAtAction("Put", _mapper.Map<Hierarchy, HierarchyDto>(updatedHierarchy));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.InnerException, ex.Message);
                return BadRequest(ex);
            }
        }

        // DELETE: api/ApiWithActions/5
        [HttpDelete("{hierarchyId}")]
        public async Task<ActionResult<Hierarchy>> Delete([FromRoute]int hierarchyId, [FromQuery]string userId)
        {
            try
            {
                //map the hierarchy from the incoming dto object to the domain/database model object so we can pass it to the Delete() method
                //var hierarchyToDelete = _mapper.Map<HierarchyDto, Hierarchy>(hierarchyToDeleteDto);
                var deletedHierarchy = await _hierarchyRepo.DeleteAsync(hierarchyId, userId);

                //map back to dto, to pass back to client 
                return AcceptedAtAction("Delete", hierarchyId);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.InnerException, ex.Message);
                return BadRequest();
            }
        }
    }
}
