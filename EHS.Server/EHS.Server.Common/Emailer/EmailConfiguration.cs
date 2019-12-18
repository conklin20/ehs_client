using System;
using System.Collections.Generic;
using System.Text;

namespace EHS.Server.Common.Emailer
{
    public class EmailConfiguration : IEmailConfiguration
    {
        public string SmtpServer { get; set; }
        public int SmtpPort { get; set; }
        public string SmtpUsername { get; set; }
        public string SmtpPassword { get; set; }

        public EmailAddress FromAddress { get; set; }
        //for receiving email
        //public string PopServer { get; set; }
        //public int PopPort { get; set; }
        //public string PopUsername { get; set; }
        //public string PopPassword { get; set; }
    }
}
