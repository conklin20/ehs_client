using System;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using EHS.Server.Contracts;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using EHS.Server.DataAccess.Repository; 

namespace EHS.Server.Worker
{
    public class NagMailWorker : BackgroundService, INagMail
    {
        private readonly ILogger<NagMailWorker> _logger;
        private readonly IConfiguration _config;
        private readonly IEmailRepository _emailRepository;

        public NagMailWorker(ILogger<NagMailWorker> logger, IConfiguration config, IEmailRepository emailRepository)
        {
            _logger = logger;
            _config = config;
            _emailRepository = emailRepository;
        }
        
        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            while (!stoppingToken.IsCancellationRequested)
            {                
                _logger.LogInformation("Starting Nag Mail process...");
                await SendNagMailAsync();

                DateTime now = DateTime.Now;
                DateTime nextRun = DateTime.Today.AddDays(1).AddHours(8); //tomorrow at 8 AM 
                TimeSpan timeSpan = nextRun - now;

                //int delay = _config.GetValue("WorkerSettings:NagMail:Interval", 1440); //default to 1440 mins if no value in appSettings.{env}.json
                int delay = Convert.ToInt32(timeSpan.TotalMilliseconds);
                await Task.Delay(delay, stoppingToken);

                _logger.LogInformation("Nag Mail process completed");
            }
        }

        public async Task SendNagMailAsync()
        {
            //
            try
            {
                var nagMail = await _emailRepository.GetNagMailAsync("Past Due");
            }
            catch (Exception ex)

            {
                _logger.LogError(ex, $"An error occurred while sending NagMail: {ex.Message}");
            }

        }
    }
}
