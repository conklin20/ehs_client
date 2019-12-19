using EHS.Server.Common.Emailer;
using EHS.Server.DataAccess.DatabaseModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EHS.Server.WebApi.Services
{
    public interface IEmailService
    {
        // Send Methods 
        void Send(EmailMessage emailMessage);
        Task SendAsync(EmailMessage emailMessage);

        //Build Methods 
        List<EmailAddress> BuildToList(List<EventHierarchySubscriber> subscribers);
        string BuildHtmlHead();
        string BuildFooter();

        //Safety Incident Specific
        Task<EmailMessage> BuildNewSafetyIncidentEmailAsync(SafetyEvent safetyEvent, List<EventHierarchySubscriber> subscribers);
        string BuildBody<T>(T data) where T : SafetyEvent;
        string BuildBody<T>(T data, string message) where T : SafetyEvent;

        //Action Specific 
        Task<EmailMessage> BuildAssignedActionEmailAsync(DataAccess.DatabaseModels.Action action);
        Task<string> BuildActionBodyAsync<T>(T data, string message) where T : DataAccess.DatabaseModels.Action;


        //List<EmailMessage> ReceiveEmail(int maxCount = 10);
    }
}
