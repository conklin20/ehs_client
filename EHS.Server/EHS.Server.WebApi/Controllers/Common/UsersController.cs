using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using EHS.Server.WebApi.Services;
using EHS.Server.DataAccess.DatabaseModels;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using EHS.Server.WebApi.Helpers;
using Microsoft.Extensions.Logging;
using EHS.Server.DataAccess.Repository;
using AutoMapper;
using EHS.Server.DataAccess.Dtos;

namespace EHS.Server.WebApi.Controllers.Common
{
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    [Route("api/v{version:apiVersion}/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly IUserService _userService;
        private readonly ILogger<UsersController> _logger;
        private readonly IUserRepository _userRepo;
        private readonly IMapper _mapper;

        public UsersController(IUserService userService, ILogger<UsersController> logger, IMapper mapper, IUserRepository userRepo)
        {
            _userService = userService;
            _logger = logger;
            _userRepo = userRepo;
            _mapper = mapper;
        }

        // POST: api/users/authenticate
        [AllowAnonymous]
        [HttpPost("authenticate")]
        public async Task<IActionResult> Authenticate([FromBody]UserCredentials userCredentials)
        {
            try
            {
                //call the authentication method in the userservices class to try to log the user in 
                var user = await _userService.AuthenticateAsync(userCredentials.Username, userCredentials.Password);

                if (user == null)
                    return BadRequest(new { message = "Username or password is incorrect." });

                //map the user from the domain/database model object, to data transfer object to pass back to the client 
                return Ok(_mapper.Map<User, UserDto>(user));
            }
            catch(Exception ex)
            {
                _logger.LogError(ex.Message);
                return BadRequest(new { message = "Authentication failed. Please try again." });
            }
        }

        // GET: api/Users
        [HttpGet]
        public IEnumerable<string> Get()
        {
            return new string[] { "value1", "value2" };
        }

        // GET: api/Users/5
        [HttpGet("{id}", Name = "Get")]
        public string Get(int id)
        {
            return "value";
        }

        // POST: api/Users
        [HttpPost]
        public void Post([FromBody] string value)
        {
        }

        // PUT: api/Users/5
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
