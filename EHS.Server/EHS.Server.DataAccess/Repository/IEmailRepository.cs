using EHS.Server.DataAccess.DatabaseModels;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace EHS.Server.DataAccess.Repository
{
    public interface IEmailRepository
    {
        Task<List<EventHierarchySubscriber>> GetEventHierarchySubscribersAsync(int eventId);
        List<EventHierarchySubscriber> GetEventHierarchySubscribers(int eventId);

        //Nag Mail
        Task<List<NagMail>> GetNagMailAsync(string type); 
    }
}
