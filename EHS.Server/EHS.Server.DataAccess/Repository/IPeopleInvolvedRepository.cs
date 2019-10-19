using System.Collections.Generic;
using System.Threading.Tasks;
using EHS.Server.DataAccess.DatabaseModels;

namespace EHS.Server.DataAccess.Repository
{
    public interface IPeopleInvolvedRepository
    {
        Task<int> SavePeopleInvolved(List<PeopleInvolved> peopleInvolved, string userId);
    }
}
