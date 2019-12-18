using System;
using System.Collections.Generic;
using System.Text;

namespace EHS.Server.Common.Emailer
{
    public interface IEmailConfiguration
    {
        string SmtpServer { get; }
        int SmtpPort { get; }
        string SmtpUsername { get; set; }
        string SmtpPassword { get; set; }

        public EmailAddress FromAddress { get; set; }
        //for receiving email
        //string PopServer { get; }
        //int PopPort { get; }
        //string PopUsername { get; }
        //string PopPassword { get; }
    }
}
