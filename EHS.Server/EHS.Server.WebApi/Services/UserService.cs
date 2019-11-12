using EHS.Server.DataAccess.DatabaseModels;
using EHS.Server.DataAccess.Repository;
using Microsoft.Extensions.Logging;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.IdentityModel.Tokens;
using Microsoft.Extensions.Options;
using System;
using System.Threading.Tasks;
using System.Text;
using EHS.Server.WebApi.Helpers;
using System.Security.Claims;
using System.DirectoryServices.AccountManagement;

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
            if (Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") == "Development")
            {
                //Using local machine for testing
                using (PrincipalContext pc = new PrincipalContext(ContextType.Machine, null))
                {
                    success = pc.ValidateCredentials(username, password);
                }
            } else
            {
                using (PrincipalContext pc = new PrincipalContext(ContextType.Domain, "VSTO.VistaOutdoor.com"))
                {
                    try
                    {
                        _logger.LogDebug($"{username} logging in...");
                        success = pc.ValidateCredentials(username, password);
                        _logger.LogDebug($"Log In Result: {success.ToString()}");
                    }
                    catch (Exception ex)
                    {
                        _logger.LogError(ex.InnerException, $"Error authenticating user: {ex.Message}");
                    }

                }
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
                    new Claim(ClaimTypes.NameIdentifier, user.UserId),
                    new Claim(ClaimTypes.GivenName, user.FirstName),
                    new Claim(ClaimTypes.Surname, user.LastName),
                    new Claim(ClaimTypes.Email, user.Email),
                    new Claim(ClaimTypes.UserData, user.LogicalHierarchyId.ToString()),
                    new Claim(ClaimTypes.UserData, user.PhysicalHierarchyId.ToString()),
                    new Claim(ClaimTypes.MobilePhone, user.Phone),
                    new Claim(ClaimTypes.Role, user.RoleId.ToString()),
                    new Claim(ClaimTypes.UserData, user.TimeZone),
                    new Claim(ClaimTypes.UserData, user.DateFormat),
                    new Claim(ClaimTypes.UserData, user.ApprovalLevel.ToString()),
                    new Claim(ClaimTypes.UserData, user.ApprovalLevelName.ToString()),
                    new Claim(ClaimTypes.UserData, user.RoleName.ToString()),
                    new Claim(ClaimTypes.UserData, user.RoleCapabilities.ToString()),
                    new Claim(ClaimTypes.UserData, user.RoleLevel.ToString()),
                    new Claim(ClaimTypes.UserData, user.LogicalHierarchyPath),
                    new Claim(ClaimTypes.UserData, user.PhysicalHierarchyPath)
                }),
                Expires = DateTime.UtcNow.AddDays(7),
                //Expires = DateTime.UtcNow.AddHours(1),
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
