﻿using System;
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
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody]UserCredentials userCredentials)
        {
            try
            {
                //call the authentication method in the userservices class to try to log the user in 
                var user = await _userService.LoginAsync(userCredentials.Username, userCredentials.Password);

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
        public async Task<ActionResult<List<UserDto>>> Get()
        {
            try
            {
                //get the list of hierarchies 
                var users = await _userRepo.GetAllAsync();

                if (users == null)
                {
                    _logger.LogError("No users found. {0}", NotFound().ToString());
                    return NotFound();
                }

                //map the list from the domain/database model objects, to data transfer objects to pass back to the client 
                return Ok(users.Select(_mapper.Map<User, UserDto>).ToList());
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
                return BadRequest();
            }
        }

        // GET: api/Users/5
        [HttpGet("{id}", Name = "GetUser")]
        public async Task<ActionResult<UserDto>> Get(string id)
        {
            try
            {
                //get the user 
                var user = await _userRepo.GetByIdAsync(id);

                if (user == null)
                {
                    _logger.LogError("User {0} not found. {1}", id, NotFound().ToString());
                    return NotFound();
                }

                //map the user from the domain/database model object, to data transfer object to pass back to the client 
                return Ok(_mapper.Map<User, UserDto>(user));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
                return BadRequest();
            }
        }

        // POST: api/Users
        [HttpPost]
        public async Task<ActionResult<UserDto>> Post([FromBody]UserDto userToAddDto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    _logger.LogError(BadRequest().ToString());
                    return BadRequest();
                }

                //map the new user from the incoming dto object to the domain/database model object so we can pass it to the Add() method
                var userToAdd = _mapper.Map<UserDto, User>(userToAddDto);
                var addedUser = await _userRepo.AddAsync(userToAdd);

                //map back to dto, to pass back to client 
                //return CreatedAtAction("Getuser", new { id = addeduser.userId }, addeduser); 
                return CreatedAtAction("GetUser", new { id = addedUser.UserId }, _mapper.Map<User, UserDto>(addedUser));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
                return BadRequest();
            }
        }

        // PUT: api/Users/5
        [HttpPut("{id}")]
        public async Task<ActionResult<UserDto>> Put([FromBody]UserDto userToUpdateDto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    _logger.LogError(BadRequest().ToString());
                    return BadRequest();
                }

                //map the user from the incoming dto object to the domain/database model object so we can pass it to the Update() method
                var userToUpdate = _mapper.Map<UserDto, User>(userToUpdateDto);
                var updatedUser = await _userRepo.UpdateAsync(userToUpdate);

                //map back to dto, to pass back to client 
                return Accepted(_mapper.Map<User, UserDto>(updatedUser));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
                return BadRequest();
            }
        }

        // DELETE: api/ApiWithActions/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<UserDto>> Delete([FromBody]UserDto userToDeleteDto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    _logger.LogError(BadRequest().ToString());
                    return BadRequest();
                }
                
                //map the user from the incoming dto object to the domain/database model object so we can pass it to the Delete() method
                var userToDelete = _mapper.Map<UserDto, User>(userToDeleteDto);
                var deletedUser = await _userRepo.DeleteAsync(userToDelete);

                //map back to dto, to pass back to client 
                return Accepted(_mapper.Map<User, UserDto>(deletedUser));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
                return BadRequest();
            }
        }
    }
}
