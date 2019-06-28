using EHS.Server.Contracts;
using System;
using System.Net.Mail; 

namespace EHS.Server.Common
{
    class EmailManager : IEmailManager
    {
        //SmtpClient smtpClient = new SmtpClient("VSTO", 5050);

        public string BuildBody(string Content)
        {
            throw new NotImplementedException();
        }

        public string SendEmail(string To, string Cc, string Subject, string Body, string Attachments, string Signature)
        {
            throw new NotImplementedException();
        }
        //SmtpFailedRecipientException
        //SmtpFailedRecipientsException



    }
}
