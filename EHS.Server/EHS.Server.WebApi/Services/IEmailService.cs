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
        void Send(EmailMessage emailMessage);
        Task SendAsync(EmailMessage emailMessage);
        Task<List<EmailAddress>> BuildToListAsync(List<EventHierarchySubscriber> subscribers); 
        string BuildHtmlHead();
        string BuildFooter();

        Task<EmailMessage> BuildNewSafetyIncidentEmailAsync(SafetyEvent safetyEvent, List<EventHierarchySubscriber> subscribers);
        Task<string> BuildBodyAsync<T>(T data) where T : SafetyEvent;
        Task<string> BuildBodyAsync<T>(T data, string message) where T : SafetyEvent;

        Task<EmailMessage> BuildAssignedActionEmailAsync(DataAccess.DatabaseModels.Action action);
        Task<string> BuildActionBodyAsync<T>(T data, string message) where T : DataAccess.DatabaseModels.Action;


        //List<EmailMessage> ReceiveEmail(int maxCount = 10);
    }
}
