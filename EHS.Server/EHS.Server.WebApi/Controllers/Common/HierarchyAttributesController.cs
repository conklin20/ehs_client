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
using EHS.Server.WebApi.Helpers.Queries;
using EHS.Server.DataAccess.Queries;

namespace EHS.Server.WebApi.Controllers.Common
{
    [Authorize]
    [Produces("application/json")]
    //[Route("api/v{version:apiVersion}/[controller]")]
    [Route("api/v1/[controller]")]
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
        public async Task<ActionResult<List<HierarchyAttribute>>> Get([FromQuery] HierarchyAttributesQuery queryParams)
        {
            try
            {
                //parse the queryParams object and send list to repo
                List<DynamicParam> dynamicParamList = new List<DynamicParam>();
                if (queryParams.Enabled != null)
                {
                    dynamicParamList.Add(new DynamicParam { TableAlias = "ha.", FieldName = "Enabled", Operator = "=", ParamName = "@Enabled", SingleValue = queryParams.Enabled });
                    dynamicParamList.Add(new DynamicParam { TableAlias = "a.", FieldName = "Enabled", Operator = "=", ParamName = "@AttrEnabled", SingleValue = queryParams.Enabled });
                }
                if (queryParams.AttributeType != null) //a value should ALWAYS be passed in 
                {
                    dynamicParamList.Add(new DynamicParam { TableAlias = "a.", FieldName = "AttributeName", Operator = "=", ParamName = "@AttributeName", SingleValue = queryParams.AttributeType });
                }

                //get the list of hierarchyAttributes 
                var hierarchyAttributes = await _hierarchyAttributeRepo.GetAllAsync(dynamicParamList);

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
                _logger.LogError(ex.InnerException, ex.Message);
                return BadRequest(ex);
            }
        }

        // GET: api/Hierarchies
        [HttpGet("fulltree/{id}", Name = "GetFullTreeWithAttr")]
        public async Task<ActionResult<List<HierarchyAttribute>>> GetFullTree([FromQuery] HierarchyAttributesQuery queryParams, [FromRoute] int id)
        {
            try
            {
                //parse the queryParams object and send list to repo
                List<DynamicParam> dynamicParamList = new List<DynamicParam>();
                if (queryParams.Enabled != null)
                {
                    dynamicParamList.Add(new DynamicParam { TableAlias = "ha.", FieldName = "Enabled", Operator = "=", ParamName = "@Enabled", SingleValue = queryParams.Enabled });
                    dynamicParamList.Add(new DynamicParam { TableAlias = "a.", FieldName = "Enabled", Operator = "=", ParamName = "@AttrEnabled", SingleValue = queryParams.Enabled });
                }
                if (queryParams.AttributeType != null) //a value should ALWAYS be passed in 
                {
                    dynamicParamList.Add(new DynamicParam { TableAlias = "a.", FieldName = "AttributeName", Operator = "=", ParamName = "@AttributeName", SingleValue = queryParams.AttributeType });
                }



                //global, logical, or physical
                string attributeType = queryParams.AttributeType;

                //get the list of hierarchyAttributes 
                var hierarchyAttributes = await _hierarchyAttributeRepo.GetFullTreeAsync(dynamicParamList, id);

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
                _logger.LogError(ex.InnerException, ex.Message);
                return BadRequest(ex);
            }
        }

        // GET: api/Hierarchies
        [HttpGet("singlepath/{id}", Name = "GetSinglePath")]
        public async Task<ActionResult<List<HierarchyAttribute>>> GetSinglePath([FromQuery] HierarchyAttributesQuery queryParams, [FromRoute] int id)
        {
            try
            {
                //parse the queryParams object and send list to repo
                List<DynamicParam> dynamicParamList = new List<DynamicParam>();
                if (queryParams.Enabled != null)
                {
                    dynamicParamList.Add(new DynamicParam { TableAlias = "ha.", FieldName = "Enabled", Operator = "=", ParamName = "@Enabled", SingleValue = queryParams.Enabled });
                    dynamicParamList.Add(new DynamicParam { TableAlias = "a.", FieldName = "Enabled", Operator = "=", ParamName = "@AttrEnabled", SingleValue = queryParams.Enabled });
                }
                if (queryParams.AttributeType != null) //a value should ALWAYS be passed in 
                {
                    dynamicParamList.Add(new DynamicParam { TableAlias = "a.", FieldName = "AttributeName", Operator = "=", ParamName = "@AttributeName", SingleValue = queryParams.AttributeType });
                }

                //get the list of hierarchyAttributes 
                var hierarchyAttributes = await _hierarchyAttributeRepo.GetSinglePathAsync(dynamicParamList, id);

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
                _logger.LogError(ex.InnerException, ex.Message);
                return BadRequest(ex);
            }
        }

        // GET: api/hierarchyAttributes/5
        [HttpGet("{id}", Name = "GetHierarchyAttribute")]
        public async Task<ActionResult<HierarchyAttribute>> Get(int id)
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
                _logger.LogError(ex.InnerException, ex.Message);
                return BadRequest(ex);
            }
        }

        // POST: api/hierarchyAttributes
        [HttpPost]
        public async Task<ActionResult<HierarchyAttribute>> Post([FromBody]HierarchyAttribute hierarchyAttributeToAdd, [FromQuery]string userId)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    var modelState = new BadRequestObjectResult(ModelState);
                    _logger.LogError(BadRequest(modelState).ToString());
                    return BadRequest(modelState);
                }

                //map the new hierarchyAttribute from the incoming dto object to the domain/database model object so we can pass it to the Add() method
                var addedHierarchyAttribute = await _hierarchyAttributeRepo.AddAsync(hierarchyAttributeToAdd, userId);

                //selecting the new HierarchyAttribute to retrieve associated data 
                var HierarchyAttribute = await _hierarchyAttributeRepo.GetByIdAsync(addedHierarchyAttribute.HierarchyAttributeId);

                //map back to dto, to pass back to client 
                return CreatedAtAction("Post",  _mapper.Map<HierarchyAttribute, HierarchyAttributeDto>(HierarchyAttribute));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.InnerException, ex.Message);
                return BadRequest(ex);
            }
        }

        // PUT: api/hierarchyAttributes/5
        [HttpPut("{id}")]
        public async Task<ActionResult<HierarchyAttribute>> Put([FromBody]HierarchyAttribute hierarchyAttributeToUpdate, [FromQuery]string userId)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    var modelState = new BadRequestObjectResult(ModelState);
                    _logger.LogError(BadRequest(modelState).ToString());
                    return BadRequest(modelState);
                }

                //map the hierarchyAttribute from the incoming dto object to the domain/database model object so we can pass it to the Update() method
                var updatedHierarchyAttribute = await _hierarchyAttributeRepo.UpdateAsync(hierarchyAttributeToUpdate, userId);

                //map back to dto, to pass back to client 
                return AcceptedAtAction("Put", _mapper.Map<HierarchyAttribute, HierarchyAttributeDto>(updatedHierarchyAttribute));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.InnerException, ex.Message);
                return BadRequest(ex);
            }
        }

        // DELETE: api/ApiWithActions/5
        [HttpDelete("{hierarchyAttributeId}")]
        public async Task<ActionResult<HierarchyAttribute>> Delete([FromRoute]int hierarchyAttributeId, [FromQuery]string userId)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    _logger.LogError(BadRequest(Response).ToString());
                    return BadRequest(Response);
                }

                //map the hierarchyAttribute from the incoming dto object to the domain/database model object so we can pass it to the Delete() method
                var deletedHierarchyAttributeId = await _hierarchyAttributeRepo.DeleteAsync(hierarchyAttributeId, userId);

                //map back to dto, to pass back to client 
                return AcceptedAtAction("Delete", deletedHierarchyAttributeId);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.InnerException, ex.Message);
                return BadRequest(ex);
            }
        }
    }
}