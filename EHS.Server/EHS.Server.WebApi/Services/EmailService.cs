using EHS.Server.Common.Emailer;
using EHS.Server.DataAccess.DatabaseModels;
using MailKit.Net.Smtp;
using Microsoft.AspNetCore.Hosting;
using MimeKit;
using MimeKit.Text;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using EHS.Server.DataAccess.Repository;
using Microsoft.Extensions.Logging;

namespace EHS.Server.WebApi.Services
{
    public class EmailService : IEmailService
    {
        private readonly IConfiguration _config;
        private readonly IEmailConfiguration _emailConfiguration;
        private readonly ILogger<EmailService> _logger;
        private readonly IWebHostEnvironment _env;
        private readonly IEmployeeRepository _employeesRepo;
        private readonly string _rootUrl = "";

        public EmailService(IConfiguration config, 
            IEmailConfiguration emailConfiguration, 
            ILogger<EmailService> logger, 
            IWebHostEnvironment hostingEnvironment, 
            IEmployeeRepository employeesRepo)
        {
            _config = config;
            _emailConfiguration = emailConfiguration;
            _logger = logger; 
            _env = hostingEnvironment;
            _employeesRepo = employeesRepo;
            _rootUrl = _config.GetValue("AppSettings:RootUrl", _env.ContentRootPath);
        }

        public void Send(EmailMessage emailMessage)
        {
            var message = new MimeMessage();
            message.To.AddRange(emailMessage.ToAddresses.Select(x => new MailboxAddress(x.Name, x.Address)));

            //moving the FromAddress code into the service as it wont change within the environment
            List<EmailAddress> fromAddresses = new List<EmailAddress>();
            EmailAddress fromAddress = new EmailAddress();
            fromAddress.Address = _emailConfiguration.FromAddress.Address;
            fromAddress.Name = _emailConfiguration.FromAddress.Name;
            fromAddresses.Add(fromAddress);
            message.From.AddRange(fromAddresses.Select(x => new MailboxAddress(x.Name, x.Address)));

            message.Subject = emailMessage.Subject;
            
            var builder = new BodyBuilder { HtmlBody = emailMessage.Content };
            if (emailMessage.Attachments.Count > 0)
            {
                foreach (var attachment in emailMessage.Attachments)
                {
                    //message.Attachments = emailMessage.Attachments;
                    string fileDir = _config.GetValue("AppSettings:EventFilesDir", _env.ContentRootPath);

                    builder.Attachments.Add(attachment.FileName, File.ReadAllBytes($"{fileDir}/{attachment.SysFileName}"));  //, ContentType.Parse(attachmentType));
                }
            }
            message.Body = builder.ToMessageBody();

            //Be careful that the SmtpClient class is the one from Mailkit not the framework!
            using (var emailClient = new SmtpClient())
            {
                //The last parameter here is to use SSL (Which you should!)
                emailClient.Connect(_emailConfiguration.SmtpServer, _emailConfiguration.SmtpPort);

                //Remove any OAuth functionality as we won't be using it. 
                emailClient.AuthenticationMechanisms.Remove("XOAUTH2");

                if (!_config.GetValue("EmailConfiguration:AnonymousAuth", false))
                {
                    emailClient.Authenticate(_emailConfiguration.SmtpUsername, _emailConfiguration.SmtpPassword);
                }

                emailClient.Send(message);

                emailClient.Disconnect(true);
            }
        }

        public async Task SendAsync(EmailMessage emailMessage)
        {
            try
            {
                var message = new MimeMessage();
                message.To.AddRange(emailMessage.ToAddresses.Select(x => new MailboxAddress(x.Name, x.Address)));

                //moving the FromAddress code into the service as it wont change within the environment
                List<EmailAddress> fromAddresses = new List<EmailAddress>();
                EmailAddress fromAddress = new EmailAddress();
                fromAddress.Address = _emailConfiguration.FromAddress.Address;
                fromAddress.Name = _emailConfiguration.FromAddress.Name;
                fromAddresses.Add(fromAddress);
                message.From.AddRange(fromAddresses.Select(x => new MailboxAddress(x.Name, x.Address)));

                message.Subject = emailMessage.Subject;

                var builder = new BodyBuilder { HtmlBody = emailMessage.Content };
                if (emailMessage.Attachments != null && emailMessage.Attachments.Count > 0)
                {
                    foreach (var attachment in emailMessage.Attachments)
                    {
                        string fileDir = _config.GetValue("AppSettings:EventFilesDir", _env.ContentRootPath);
                        try
                        {
                            builder.Attachments.Add(attachment.FileName, File.ReadAllBytes($"{fileDir}/{attachment.SysFileName}"));  //, ContentType.Parse(attachmentType));
                        }
                        catch (Exception ex)
                        {
                            _logger.LogError(ex, message: $"Failed to attach file to email: {ex.Message}");
                        }
                    }
                }
                message.Body = builder.ToMessageBody();

                //Be careful that the SmtpClient class is the one from Mailkit not the framework!
                using (var emailClient = new SmtpClient())
                {
                    //The last parameter here is to use SSL (Which you should!)
                    emailClient.Connect(_emailConfiguration.SmtpServer, _emailConfiguration.SmtpPort);

                    //Remove any OAuth functionality as we won't be using it. 
                    emailClient.AuthenticationMechanisms.Remove("XOAUTH2");

                    if (_config.GetValue("EmailConfiguration:AnonymousAuth", false) == false)
                    {
                        emailClient.Authenticate(_emailConfiguration.SmtpUsername, _emailConfiguration.SmtpPassword);
                    }

                    var options = FormatOptions.Default.Clone();

                    await emailClient.SendAsync(options, message);

                    emailClient.Disconnect(true);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error sending email: { ex.Message }");
            }
        }

        public async Task<EmailMessage> BuildNewSafetyIncidentEmailAsync(SafetyEvent safetyEvent, List<EventHierarchySubscriber> subscribers)
        {
            //build TO list
            List<EmailAddress> emailAddresses = await BuildToListAsync(subscribers);

            //attachment list 
            List<EmailAttachment> attachments = new List<EmailAttachment>(); 
            foreach(var file in safetyEvent.Files)
            {
                EmailAttachment attachment = new EmailAttachment();
                attachment.FileName = file.UserFileName;
                attachment.SysFileName = file.ServerFileName;
                attachments.Add(attachment);
            }

            EmailMessage newEventMessage = new EmailMessage
            {
                ToAddresses = emailAddresses,
                Subject = $"New Safety Incident Reported - {safetyEvent.EventId.ToString()}",
                Content = await BuildBodyAsync(safetyEvent, "New Safety Incident Reported") +
                          BuildFooter(),
                Attachments = attachments
            };

            return newEventMessage;
        }

        public async Task<EmailMessage> BuildAssignedActionEmailAsync(DataAccess.DatabaseModels.Action action)
        {
            //build TO list
            //Assigned actions will only go to the person its assigned to 
            Employee employee = _employeesRepo.GetById(action.AssignedTo);
            List<EmailAddress> emailAddresses = new List<EmailAddress>();
            EmailAddress email = new EmailAddress();
            if (_env.EnvironmentName == "Development")
            {
                email.Name = "Cary Conklin";
                email.Address = "cary.conklin.20@gmail.com";
                emailAddresses.Add(email);
            } else
            {
                email.Name = employee.FullName;
                email.Address = employee.Email;
                emailAddresses.Add(email);
            }

            EmailMessage newEventMessage = new EmailMessage
            {
                ToAddresses = emailAddresses,
                Subject = $"You've been assigned an action - {action.EventId.ToString()}",
                Content = await BuildActionBodyAsync(action, "New Action Assignment") +
                          BuildFooter()
            };

            return newEventMessage;
        }


        public async Task<List<EmailAddress>> BuildToListAsync(List<EventHierarchySubscriber> subscribers)
        {
            List<EmailAddress> emailAddresses = new List<EmailAddress>();
            //if in Development, only send to specified addresses
            if (_env.EnvironmentName == "Development")
            {
                EmailAddress emailAddress = new EmailAddress
                {
                    Address = "cary.conklin.20@gmail.com",
                    Name = "Cary Conklin"
                };
                emailAddresses.Add(emailAddress);
            }
            else
            {
                //loop through users subscribed to this alert 
                foreach (EventHierarchySubscriber subscriber in subscribers)
                {
                    EmailAddress emailAddress = new EmailAddress
                    {
                        Address = subscriber.Email,
                        Name = subscriber.Name
                    };
                    emailAddresses.Add(emailAddress);
                }
            }

            return emailAddresses;
        }
        
        public async Task<string> BuildBodyAsync<T>(T data) where T : SafetyEvent
        {
            string body = BuildHtmlHead() +
                    $"<body itemscope itemtype=\"http://schema.org/EmailMessage\" style=\"font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; -webkit-font-smoothing: antialiased; -webkit-text-size-adjust: none; width: 100% !important; height: 100%; line-height: 1.6em; background-color: #f6f6f6; margin: 0;\" bgcolor='#f6f6f6' > " +
                        $"<table class=\"body-wrap\" style=\"font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; width: 100%; background-color: #f6f6f6; margin: 0;\" bgcolor=\"#f6f6f6\">" +
                        $"</table> " +
                    $"</body> " +
                $"</html> ";                 

            return body;
        }

        public async Task<string> BuildBodyAsync<T>(T data, string message) where T : SafetyEvent
        {
            Employee employee = _employeesRepo.GetById(data.EmployeeId);
            const string YES = "Yes";
            const string NO = "No";

            string body = BuildHtmlHead() +
                    $"<body itemscope itemtype=\"http://schema.org/EmailMessage\" bgcolor=\"#f6f6f6\" class=\"body\" > " +
                        $"<h3>{message}</h3>" +
                        $"<div class='event-body'> " +
                            "<ul>" +
                                $"<li><span>Event #</span><a href={_rootUrl}/reports/si/event?eventId={data.EventId} target=\"_blank\">{data.EventId}</a></li>" +
                                $"<li><span>Reported On: </span>{data.ReportedOn.ToShortDateString()}</li>" +
                                $"<li><span>Reported By: </span>{(_employeesRepo.GetById(data.ReportedBy) != null ? _employeesRepo.GetById(data.ReportedBy).FullName : data.ReportedBy)}</li>" +
                                $"<li><span>Logical Hierarchy: </span>{data.Division} > {data.Site} > {data.Area} > {data.Department}</li>" +
                                $"<li><span>Physical Hierarchy: </span>{data.LocaleRegion} > {data.LocaleSite} > {data.LocalePlant} > {data.LocalePlantArea}</li>" +
                                $"<li><span>Event Date: </span>{data.EventDate.ToShortDateString()}</li>" +
                                $"<li><span>Employee: </span>{(employee != null ? employee.FullName : data.EmployeeId)}</li>" +
                                $"<li><span>Catagory: </span>{(string.IsNullOrEmpty(data.ResultingCategory) ? data.InitialCategory : $"Initial Catagory: {data.InitialCategory} / Resulting Catagory: {data.ResultingCategory}")}</li>" +
                                $"<li><span>Shift: </span>{data.Shift}</li>" +
                                $"<li><span>Job: </span>{data.JobTitle}</li>" +
                                $"<li><span>What Happened: </span><p>{data.WhatHappened}</p></li>" +
                                $"<li><span>Injury? </span>{(data.IsInjury ? YES : NO)}</li>" +
                                $"{(data.IsInjury ? $"<li><span>Injury Info: </span>Nature of Injury - {data.NatureOfInjury}, Body Part - {data.BodyPart}</li>" : "")}" +
                                $"{(data.FirstAid ? $"<li><span>First Aid:</span> {data.FirstAidType}</li>" : "")} " +
                                $"{(data.Transported ? $"<li><span>Transported To:</span> {data.OffPlantMedicalFacility}</li>" : "")} " +
                                $"<li><span>ER:</span> {(data.ER ? YES : NO)} </li>" +
                                $"<li><span>Illnes:</span> {(data.IsIllness ? YES : NO)} </li>" +
                                $"<li><span>Lost Time:</span> {(data.LostTime ? YES : NO)} </li>" +
                                $"<li><span>Hours worked prior:</span> {data.HoursWorkedPrior}</li>" +
                                $"<li><span>Work Environment: </span>{data.WorkEnvironment}</li>" +
                                $"<li><span>Material Involved: </span>{data.MaterialInvolved}</li>" +
                                $"<li><span>Equipment Involved: </span>{data.EquipmentInvolved}</li>" +
                                $"<li><span>Actions Assigned: </span>{data.Actions.Count}</li>" +
                                $"<li><span>People Involved: </span>{data.PeopleInvolved.Count}</li>" +
                                $"<li><span>Causes: </span>{data.Causes.Count}</li>" +
                            "</ul>" +
                        $"</div>";

            return body;
        }

        public async Task<string> BuildActionBodyAsync<T>(T data, string message) where T : DataAccess.DatabaseModels.Action
        {
            Employee employee = _employeesRepo.GetById(data.AssignedTo);
            Employee assignedBy = _employeesRepo.GetById(data.CreatedBy);

            string body = BuildHtmlHead() +
                    $"<body itemscope itemtype=\"http://schema.org/EmailMessage\" bgcolor=\"#f6f6f6\" class=\"body\" > " +
                        $"<h3>{message}</h3>" +
                        $"<div class='event-body'> " +
                            "<ul>" +
                                $"<li><span>Action #</span><a href={_rootUrl}/events/si/{data.EventId}/step/4 target=\"_blank\">{data.ActionId}</a></li>" +
                                $"<li><span>Event #</span>{data.EventId}</li>" +
                                $"<li><span>Event Type: </span>{data.EventType}</li>" +
                                $"<li><span>Assigned To: </span>{employee.FullName}</li>" +
                                $"<li><span>Assigned By: </span>{assignedBy.FullName}</li>" +
                                $"<li><span>Due Date: </span>{data.DueDate.ToShortDateString()}</li>" +
                                $"<li><span>Action to Take: </span><p>{data.ActionToTake}</p></li>" +
                            "</ul>" +
                        $"</div>";

            return body;
        }


        public string BuildHtmlHead()
        {
            string head = $"<!DOCTYPE html>" +
                $"<html  style=\"font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;\" >" +
                    $"<head>" +
                        $"<meta name='viewport' content='width=device-width' />" +
                        $"<meta http-equiv='Content-Type' content='text / html; charset = UTF-8' />" +
                        $"<title>EHS Notifications</title>" +
                        $"<style type=\"text/css\"> " +
                            @"
                                .body {
                                    -webkit-font-smoothing: antialiased; 
                                    -webkit-text-size-adjust: none; 
                                    width: 100% !important; 
                                    height: 100%; 
                                    line-height: 1.6em; 
                                    background-color: #f6f6f6; 
                                    margin: 0;
                                    font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; 
                                    box-sizing: border-box; font-size: 14px; 
                                    color: rgba(0, 0, 0, 0.54) !important;
                                    padding-bottom: 20px;
                                }
                                h3 {
                                    margin: 10px 0 5px;
                                    padding: 30px 0 0 10px;
                                } 
                                span {
                                    font-weight: bold;
                                }
                                ul {
                                    list-style-type: none;
                                    padding: 0;  
                                }
                                p {
                                    margin-left: 20px;
                                }
                                .event-body {
                                    margin: 20px;
                                }
                                .signature {
                                    margin-top: 15px;
                                    padding-left: 30px;
                                    font-size: 1.5em; 
                                }
                            " + 
                        $"</style> " +
                    $"</head> ";

            return head; 
        }

        public string BuildFooter()
        {
            string footer = $"<div class='signature'> - EHS System Alerts </div>" +
                $"</body> " +
                $"</html> ";

            return footer;
        }



        //public List<EmailMessage> ReceiveEmail(int maxCount = 10)
        //{
        //    using (var emailClient = new Pop3Client())
        //    {
        //        emailClient.Connect(_emailConfiguration.PopServer, _emailConfiguration.PopPort, true);

        //        emailClient.AuthenticationMechanisms.Remove("XOAUTH2");

        //        emailClient.Authenticate(_emailConfiguration.PopUsername, _emailConfiguration.PopPassword);

        //        List<EmailMessage> emails = new List<EmailMessage>();
        //        for (int i = 0; i < emailClient.Count && i < maxCount; i++)
        //        {
        //            var message = emailClient.GetMessage(i);
        //            var emailMessage = new EmailMessage
        //            {
        //                Content = !string.IsNullOrEmpty(message.HtmlBody) ? message.HtmlBody : message.TextBody,
        //                Subject = message.Subject
        //            };
        //            emailMessage.ToAddresses.AddRange(message.To.Select(x => (MailboxAddress)x).Select(x => new EmailAddress { Address = x.Address, Name = x.Name }));
        //            emailMessage.FromAddresses.AddRange(message.From.Select(x => (MailboxAddress)x).Select(x => new EmailAddress { Address = x.Address, Name = x.Name }));
        //            emails.Add(emailMessage);
        //        }

        //        return emails;
        //    }
        //}
    }
}
