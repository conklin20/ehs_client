using System.Collections.Generic;
using System.Threading.Tasks;
using EHS.Server.DataAccess.DatabaseModels;

namespace EHS.Server.DataAccess.Repository
{
    public interface ICausesRepository
    {
        Task<int> SaveCausesAsync(List<Cause> causes, string userId);
        Task<List<Cause>> GetCausesByEventIdAsync(int eventId);
    }
}
