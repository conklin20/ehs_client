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
    public class ApprovalsController : ControllerBase
    {
        private readonly ILogger<ApprovalsController> _logger;
        private readonly IApprovalRepository _approvalRepo;
        private readonly IMapper _mapper;

        public ApprovalsController(ILogger<ApprovalsController> logger, IMapper mapper, IApprovalRepository approvalRepo)
        {
            _logger = logger;
            _approvalRepo = approvalRepo;
            _mapper = mapper;
        }

        // GET: api/Actions
        [HttpGet]
        public async Task<ActionResult<List<ApprovalDto>>> Get()
        {
            try
            {
                //get the list of approvals 
                var approvals = await _approvalRepo.GetAllAsync();

                if (approvals == null)
                {
                    _logger.LogError("No Actions found. {0}", NotFound().ToString());
                    return NotFound();
                }

                //map the list from the domain/database model objects, to data transfer objects to pass back to the client 
                return Ok(approvals.Select(_mapper.Map<Approval, ApprovalDto>).ToList());
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
                return BadRequest();
            }
        }
        
        // GET: api/Actions/5
        [HttpGet("{id}", Name = "GetApproval")]
        public async Task<ActionResult<ApprovalDto>> Get([FromRoute]int id)
        {
            try
            {
                //get the approval 
                var approval = await _approvalRepo.GetByIdAsync(id);

                if (approval == null)
                {
                    _logger.LogError("Approval {0} not found. {1}", id, NotFound().ToString());
                    return NotFound();
                }

                //map the approval from the domain/database model object, to data transfer object to pass back to the client 
                return Ok(_mapper.Map<Approval, ApprovalDto>(approval));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
                return BadRequest();
            }
        }

        // POST: api/Actions
        [HttpPost]
        public async Task<ActionResult<ApprovalDto>> Post([FromBody]ApprovalDto approvalToAddDto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    _logger.LogError(BadRequest().ToString());
                    return BadRequest();
                }

                //map the new approval from the incoming dto object to the domain/database model object so we can pass it to the Add() method
                var approvalToAdd = _mapper.Map<ApprovalDto, Approval>(approvalToAddDto);
                var addedApproval = await _approvalRepo.AddAsync(approvalToAdd);

                //map back to dto, to pass back to client 
                return CreatedAtAction("GetApproval", new { id = addedApproval.ApprovalId }, _mapper.Map<Approval, ApprovalDto>(addedApproval));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
                return BadRequest();
            }
        }

        // PUT: api/Actions/5
        [HttpPut("{id}")]
        public async Task<ActionResult<ApprovalDto>> Put([FromBody]ApprovalDto approvalToUpdateDto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    _logger.LogError(BadRequest().ToString());
                    return BadRequest();
                }

                //map the approval from the incoming dto object to the domain/database model object so we can pass it to the Update() method
                var approvalToUpdate = _mapper.Map<ApprovalDto, Approval>(approvalToUpdateDto);
                var approvalAction = await _approvalRepo.UpdateAsync(approvalToUpdate);

                //map back to dto, to pass back to client 
                return Accepted(_mapper.Map<Approval, ApprovalDto>(approvalAction));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
                return BadRequest();
            }
        }

        // DELETE: api/ApiWithActions/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<ApprovalDto>> Delete([FromBody]ApprovalDto approvalToDeleteDto, [FromRoute]int id)
        {
            try
            {
                approvalToDeleteDto.ApprovalId = id;

                if (!ModelState.IsValid)
                {
                    _logger.LogError(BadRequest().ToString());
                    return BadRequest();
                }

                //map the approval from the incoming dto object to the domain/database model object so we can pass it to the Delete() method
                var approvalToDelete = _mapper.Map<ApprovalDto, Approval>(approvalToDeleteDto);
                var deletedApproval = await _approvalRepo.DeleteAsync(approvalToDelete);

                //map back to dto, to pass back to client 
                return Accepted(_mapper.Map<Approval, ApprovalDto>(deletedApproval));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
                return BadRequest();
            }
        }
    }
}
