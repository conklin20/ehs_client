using System.Net.Mail;

namespace EHS.Server.Common.Emailer
{
    public interface IEmailClient
    {
        void Send(string subject, string message);
        void Send(string subject, string message, bool isBodyHtml);
        void Send(string subject, string message, string[] recipients);
        void SetRecipients(string[] recipients); 
    }
}
