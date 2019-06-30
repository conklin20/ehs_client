using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.DirectoryServices.AccountManagement;

namespace EHS.Server.WebApi.Controllers.Common
{
    [Produces("application/json")]
    [Route("api/v{version:apiVersion}/[controller]")]
    [ApiController]
    public class AuthenticationController : ControllerBase
    {
        [HttpPost("Login")]
        public IActionResult Login([FromBody] LoginCredentials loginCredentials)
        {
            bool success = false;
            using (PrincipalContext pc = new PrincipalContext(ContextType.Domain, "VSTO"))
            {
                success = pc.ValidateCredentials(loginCredentials.Username, loginCredentials.Password); 
            }

            return Ok(success); 
        }

        public class LoginCredentials
        {
            public string Username { get; set; }
            public string Password { get; set; }
        }
    }
}