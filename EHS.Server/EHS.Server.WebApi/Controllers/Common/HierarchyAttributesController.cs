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
    [Route("api/v{version:apiVersion}/[controller]")]
    [ApiController]
    public class HierarchyAttributesController : ControllerBase
    {
        private readonly ILogger<HierarchyAttributesController> _logger;
        private readonly IHierarchyAttributeRepository _hierarchyAttributeRepo;
        private readonly IMapper _mapper;

        public HierarchyAttributesController(ILogger<HierarchyAttributesController> logger, IMapper mapper, IHierarchyAttributeRepository hierarchyRepo)
        {
            _logger = logger;
            _hierarchyAttributeRepo = hierarchyRepo;
            _mapper = mapper;
        }

        // GET: api/hierarchyAttributes
        [HttpGet]
        public async Task<ActionResult<List<HierarchyAttributeDto>>> Get()
        {
            try
            {
                //get the list of hierarchyAttributes 
                var hierarchyAttributes = await _hierarchyAttributeRepo.GetAllAsync();

                if (hierarchyAttributes == null)
                {
                    _logger.LogError("No HierarchyAttribute Attributes found. {0}", NotFound().ToString());
                    return NotFound();
                }

                //map the list from the domain/database model objects, to data transfer objects to pass back to the client 
                return Ok(hierarchyAttributes.Select(_mapper.Map<HierarchyAttribute, HierarchyAttributeDto>).ToList());
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
                return BadRequest();
            }
        }

        // GET: api/hierarchyAttributes/5
        [HttpGet("{id}", Name = "GetHierarchyAttribute")]
        public async Task<ActionResult<HierarchyAttributeDto>> Get(int id)
        {
            try
            {
                //get the hierarchyAttribute 
                var hierarchyAttribute = await _hierarchyAttributeRepo.GetByIdAsync(id);

                if (hierarchyAttribute == null)
                {
                    _logger.LogError("HierarchyAttribute {0} not found. {1}", id, NotFound().ToString());
                    return NotFound();
                }

                //map the hierarchyAttribute from the domain/database model object, to data transfer object to pass back to the client 
                return Ok(_mapper.Map<HierarchyAttribute, HierarchyAttributeDto>(hierarchyAttribute));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
                return BadRequest();
            }
        }

        // POST: api/hierarchyAttributes
        [HttpPost]
        public async Task<ActionResult<HierarchyAttributeDto>> Post([FromBody]HierarchyAttributeDto hierarchyToAddDto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    _logger.LogError(BadRequest().ToString());
                    return BadRequest();
                }

                //map the new hierarchyAttribute from the incoming dto object to the domain/database model object so we can pass it to the Add() method
                var hierarchyToAdd = _mapper.Map<HierarchyAttributeDto, HierarchyAttribute>(hierarchyToAddDto);
                var addedHierarchy = await _hierarchyAttributeRepo.AddAsync(hierarchyToAdd);

                //map back to dto, to pass back to client 
                //return CreatedAtAction("GetHierarchy", new { id = addedHierarchy.HierarchyId }, addedHierarchy); 
                return CreatedAtAction("GetHierarchyAttribute", new { id = addedHierarchy.HierarchyId }, _mapper.Map<HierarchyAttribute, HierarchyAttributeDto>(addedHierarchy));
                //return _mapper.Map<HierarchyAttribute, HierarchyAttributeDto>(addedHierarchy);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
                return BadRequest();
            }
        }

        // PUT: api/hierarchyAttributes/5
        [HttpPut("{id}")]
        public async Task<ActionResult<HierarchyAttributeDto>> Put([FromBody]HierarchyAttributeDto hierarchyToUpdateDto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    _logger.LogError(BadRequest().ToString());
                    return BadRequest();
                }

                //map the hierarchyAttribute from the incoming dto object to the domain/database model object so we can pass it to the Update() method
                var hierarchyToUpdate = _mapper.Map<HierarchyAttributeDto, HierarchyAttribute>(hierarchyToUpdateDto);
                var updatedHierarchy = await _hierarchyAttributeRepo.UpdateAsync(hierarchyToUpdate);

                //map back to dto, to pass back to client 
                return Accepted(_mapper.Map<HierarchyAttribute, HierarchyAttributeDto>(updatedHierarchy));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
                return BadRequest();
            }
        }

        // DELETE: api/ApiWithActions/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<HierarchyAttributeDto>> Delete([FromBody]HierarchyAttributeDto hierarchyToDeleteDto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    _logger.LogError(BadRequest().ToString());
                    return BadRequest();
                }

                //map the hierarchyAttribute from the incoming dto object to the domain/database model object so we can pass it to the Delete() method
                var hierarchyToDelete = _mapper.Map<HierarchyAttributeDto, HierarchyAttribute>(hierarchyToDeleteDto);
                var deletedHierarchy = await _hierarchyAttributeRepo.DeleteAsync(hierarchyToDelete);

                //map back to dto, to pass back to client 
                return Accepted(_mapper.Map<HierarchyAttribute, HierarchyAttributeDto>(deletedHierarchy));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
                return BadRequest();
            }
        }
    }
}