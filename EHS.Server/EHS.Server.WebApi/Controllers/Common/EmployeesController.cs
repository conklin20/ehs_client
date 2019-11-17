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
    //[Route("api/v{version:apiVersion}/[controller]")]
    [Route("api/v1/[controller]")]
    [ApiController]
    public class EmployeesController : ControllerBase
    {
        private readonly ILogger<EmployeesController> _logger;
        private readonly IEmployeeRepository _employeesRepo;
        private readonly IMapper _mapper;

        public EmployeesController(ILogger<EmployeesController> logger, IMapper mapper, IEmployeeRepository employeesRepo)
        {
            _logger = logger;
            _employeesRepo = employeesRepo;
            _mapper = mapper;
        }

        // GET: api/Actions
        [HttpGet]
        public async Task<ActionResult<List<Employee>>> Get()
        {
            try
            {
                //get the list of attributes 
                var employees = await _employeesRepo.GetAllAsync();

                if (employees == null)
                {
                    _logger.LogError("No Employees found. {0}", NotFound().ToString());
                    return NotFound();
                }

                //map the list from the domain/database model objects, to data transfer objects to pass back to the client 
                return Ok(employees.Select(_mapper.Map<Employee, EmployeeDto>).ToList());
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.InnerException, ex.Message);
                return BadRequest(ex);
            }
        }

        // GET: api/Actions/5
        [HttpGet("{id}", Name = "GetEmployee")]
        public async Task<ActionResult<Employee>> Get([FromRoute]string id)
        {
            try
            {
                //get the attribute 
                var employee = await _employeesRepo.GetByIdAsync(id);

                if (employee == null)
                {
                    _logger.LogError("Employee {0} not found. {1}", id, NotFound().ToString());
                    return NotFound();
                }

                //map the attribute from the domain/database model object, to data transfer object to pass back to the client 
                return Ok(_mapper.Map<Employee, EmployeeDto>(employee));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.InnerException, ex.Message);
                return BadRequest(ex);
            }
        }
    }
}