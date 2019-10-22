using System.Collections.Generic;
using System.Threading.Tasks;
using EHS.Server.DataAccess.DatabaseModels;

namespace EHS.Server.DataAccess.Repository
{
    public interface IPeopleInvolvedRepository
    {
        Task<int> SavePeopleInvolvedAsync(List<PeopleInvolved> peopleInvolved, string userId);
        Task<List<PeopleInvolved>> GetPeopleByEventIdAsync(int eventId);
    }
}
