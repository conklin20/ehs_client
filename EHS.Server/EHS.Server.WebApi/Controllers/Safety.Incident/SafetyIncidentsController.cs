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
    public class SafetyIncidentsController : ControllerBase
    {
        private readonly ILogger<SafetyIncidentsController> _logger;
        private readonly ISafetyEventRepository _safetyEventsRepo;
        private readonly IMapper _mapper;

        public SafetyIncidentsController(ILogger<SafetyIncidentsController> logger, IMapper mapper, ISafetyEventRepository safetyEventsRepo)
        {
            _logger = logger;
            _safetyEventsRepo = safetyEventsRepo;
            _mapper = mapper;
        }

        // GET: api/Safety Events
        [HttpGet]
        public async Task<ActionResult<List<SafetyEventDto>>> Get()
        {
            try
            {
                //get the list of safetyEvents 
                var safetyEvents = await _safetyEventsRepo.GetAllAsync();

                if (safetyEvents == null)
                {
                    _logger.LogError("No Safety Events found. {0}", NotFound().ToString());
                    return NotFound();
                }

                //map the list from the domain/database model objects, to data transfer objects to pass back to the client 
                return Ok(safetyEvents.Select(_mapper.Map<SafetyEvent, SafetyEventDto>).ToList());
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
                return BadRequest();
            }
        }

        // GET: api/Safety Events/5
        [HttpGet("{id}", Name = "GetSafetyEvent")]
        public async Task<ActionResult<SafetyEventDto>> Get([FromRoute]int id)
        {
            try
            {
                //get the SafetyEvent 
                var SafetyEvent = await _safetyEventsRepo.GetByIdAsync(id);

                if (SafetyEvent == null)
                {
                    _logger.LogError("SafetyEvent {0} not found. {1}", id, NotFound().ToString());
                    return NotFound();
                }

                //map the SafetyEvent from the domain/database model object, to data transfer object to pass back to the client 
                return Ok(_mapper.Map<SafetyEvent, SafetyEventDto>(SafetyEvent));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
                return BadRequest();
            }
        }

        // POST: api/Safety Events
        [HttpPost]
        public async Task<ActionResult<SafetyEventDto>> Post([FromBody]SafetyEventDto safetyEventToAddDto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    _logger.LogError(BadRequest().ToString());
                    return BadRequest();
                }

                //map the new SafetyEvent from the incoming dto object to the domain/database model object so we can pass it to the Add() method
                var safetyEventToAdd = _mapper.Map<SafetyEventDto, SafetyEvent>(safetyEventToAddDto);
                var addedSafetyEvent = await _safetyEventsRepo.AddAsync(safetyEventToAdd);

                //map back to dto, to pass back to client 
                return CreatedAtAction("GetSafetyEvent", new { id = addedSafetyEvent.EventId }, _mapper.Map<SafetyEvent, SafetyEventDto>(addedSafetyEvent));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
                return BadRequest();
            }
        }

        // PUT: api/Safety Events/5
        [HttpPut("{id}")]
        public async Task<ActionResult<SafetyEventDto>> Put([FromBody]SafetyEventDto safetyEventToUpdateDto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    _logger.LogError(BadRequest().ToString());
                    return BadRequest();
                }

                //map the SafetyEvent from the incoming dto object to the domain/database model object so we can pass it to the Update() method
                var safetyEventToUpdate = _mapper.Map<SafetyEventDto, SafetyEvent>(safetyEventToUpdateDto);
                var updatedSafetyEvent = await _safetyEventsRepo.UpdateAsync(safetyEventToUpdate);

                //map back to dto, to pass back to client 
                return Accepted(_mapper.Map<SafetyEvent, SafetyEventDto>(updatedSafetyEvent));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
                return BadRequest();
            }
        }

        // DELETE: api/ApiWithActions/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<SafetyEventDto>> Delete([FromBody]SafetyEventDto safetyEventToDeleteDto, [FromRoute]int id)
        {
            try
            {
                safetyEventToDeleteDto.EventId = id;

                if (!ModelState.IsValid)
                {
                    _logger.LogError(BadRequest().ToString());
                    return BadRequest();
                }

                //map the SafetyEvent from the incoming dto object to the domain/database model object so we can pass it to the Delete() method
                var safetyEventToDelete = _mapper.Map<SafetyEventDto, SafetyEvent>(safetyEventToDeleteDto);
                var deletedSafetyEvent = await _safetyEventsRepo.DeleteAsync(safetyEventToDelete);

                //map back to dto, to pass back to client 
                return Accepted(_mapper.Map<SafetyEvent, SafetyEventDto>(deletedSafetyEvent));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
                return BadRequest();
            }
        }
    }
}