using Microsoft.Extensions.Configuration;
using System;
using System.Configuration;
using System.Linq;

namespace EHS.Server.Common.Emailer
{
    public class EmailClientSettings
    {
        public bool SendMail { get; set; }
        public string Host { get; set; }
        public int Port { get; set; }
        public string Username { get; set; }
        public string Password { get; set; }
        public string Sender { get; set; }
        public string[] Recipients { get; set; }

        private readonly IConfiguration _config;

        public EmailClientSettings(IConfiguration config)
        {
            _config = config; 
        }

        public void LoadFromConfig()
        {
            var emailConfig = _config.GetSection("EmailSettings");
            var sendMail = emailConfig.GetValue<Boolean>("SendMail");
            //SendMail = AppSettingsAccessor.GetBoolSettings("SendMail");
        }

        public static EmailClientSettings CreateFromConfig(IConfiguration config)
        {
            var settings = new EmailClientSettings(config);
            settings.LoadFromConfig();

            return settings; 
        }
    }
}
