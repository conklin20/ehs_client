using AutoMapper;
using EHS.Server.DataAccess.DatabaseModels;
using EHS.Server.DataAccess.Dtos;
using EHS.Server.DataAccess.Repository;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Text;
using EHS.Server.WebApi.Helpers;
using System.Security.Claims;
using System.DirectoryServices.AccountManagement;
using System.Threading;

namespace EHS.Server.WebApi.Services
{
    public class UserService : IUserService
    {
        private readonly AuthSettings _authSettings;
        private readonly ILogger<UserService> _logger;
        private readonly IUserRepository _userRepo;

        public UserService(IOptions<AuthSettings> authSettings, ILogger<UserService> logger, IUserRepository userRepo)
        {
            _authSettings = authSettings.Value;
            _logger = logger;
            _userRepo = userRepo;
        }

        /// <summary>
        /// This method will log a user into the system. It will first check that the userId/account exists in  the database, then check the password against AD, 
        /// and then finally produce a JWT token for the user, which will be used to make API calls from the client. 
        /// </summary>
        /// <seealso cref="https://jasonwatmore.com/post/2018/08/14/aspnet-core-21-jwt-authentication-tutorial-with-example-api"/>
        /// <param name="username">The userId or username. This should be the users Windows/AD Log In UserId</param>
        /// <param name="password">The Windows/AD password</param>
        /// <returns></returns>
        public async Task<User> LoginAsync(string username, string password)
        {
            //check if user exists in db 
            var user = await _userRepo.GetByIdAsync(username);

            if (user == null)
            {
                _logger.LogError("User {0} not found.", username);
                return null;
            }

            //check password against AD 
            bool success = false;
            //using (PrincipalContext pc = new PrincipalContext(ContextType.Domain, "VSTO"))
            //{
            //    success = pc.ValidateCredentials(loginCredentials.Username, loginCredentials.Password); 
            //}
            //Using local machine for testing
            using (PrincipalContext pc = new PrincipalContext(ContextType.Machine, null))
            {
                success = pc.ValidateCredentials(username, password);
            }
            if (!success)
                return null;


            //authentication successful, so generate a json web token (jwt) 
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_authSettings.Secret);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new Claim[]
                {
                    new Claim(ClaimTypes.Name, user.UserId.ToString())
                }),
                Expires = DateTime.UtcNow.AddDays(7),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };
            var token = tokenHandler.CreateToken(tokenDescriptor);
            user.Token = tokenHandler.WriteToken(token);

            //clear pw 
            user.Password = null;

            return user;

        }
    }
}
