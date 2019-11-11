using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace EHS.Server.WebApi.Controllers.Common
{
    [Route("api/v{version:apiVersion}/[controller]")]
    [ApiController]
    public class IndexController : ControllerBase
    {
        private readonly ILogger<IndexController> _logger;
        public static IConfiguration _configuration { get; private set; }
        private string environment = "";

        public IndexController(ILogger<IndexController> logger, IConfiguration configuration)
        {
            this._logger = logger;
            _configuration = configuration;
            environment = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT");
        }

        [HttpGet]
        public ActionResult<IEnumerable<string>> Get()
        {
            _logger.LogInformation($"Web API Is Running! Environment: {environment}");
            return new string[] 
            { 
                "Web API Is Running!", 
                $"Environment: {environment}",
                $"DB Connection: {_configuration.GetConnectionString("EHSConnectionString")}"
            };
            //return Ok();
        }
    }

}

