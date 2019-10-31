using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Extensions.Logging;
using EHS.Server.WebApi.Services;
using EHS.Server.DataAccess.DatabaseModels;
using EHS.Server.WebApi.Helpers;
using EHS.Server.DataAccess.Repository;
using EHS.Server.DataAccess.Dtos;
using AutoMapper;

namespace EHS.Server.WebApi.Controllers.Common
{
    [Authorize]
    [Route("api/v{version:apiVersion}/[controller]")]
    [ApiController]
    public class UserRolesController : ControllerBase
    {
        private readonly ILogger<UserRolesController> _logger;
        private readonly IUserRoleRepository _userRoleRepo;
        private readonly IMapper _mapper;

        public UserRolesController(ILogger<UserRolesController> logger, IMapper mapper, IUserRoleRepository userRoleRepo)
        {
            _logger = logger;
            _userRoleRepo = userRoleRepo;
            _mapper = mapper;
        }


        // GET: api/Users
        [HttpGet]
        public async Task<ActionResult<List<UserRole>>> Get()
        {
            try
            {
                //get the list of hierarchies 
                var users = await _userRoleRepo.GetAllAsync();

                if (users == null)
                {
                    _logger.LogError("No users found. {0}", NotFound().ToString());
                    return NotFound();
                }

                //map the list from the domain/database model objects, to data transfer objects to pass back to the client 
                return Ok(users.Select(_mapper.Map<UserRole, UserRoleDto>).ToList());
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
                return BadRequest();
            }
        }
    }
}
