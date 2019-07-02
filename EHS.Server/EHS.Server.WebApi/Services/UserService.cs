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

        public async Task<User> AuthenticateAsync(string username, string password)
        {
            //check if user exists in db 
            var user = await _userRepo.GetById(username);

            if (user == null)
            {
                _logger.LogError("User {0} not found.", username);
                return null;
            }

            //check password against AD 
            bool success = false;
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
