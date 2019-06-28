using System;

namespace EHS.Server.Contracts
{
    public interface IEmailManager
    {
        string SendEmail(string To, string Cc, string Subject, string Body, string Attachments, string Signature);
        string BuildBody(string Content); 

    }
}
