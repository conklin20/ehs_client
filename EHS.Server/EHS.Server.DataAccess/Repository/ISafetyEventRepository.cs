using System.Collections.Generic;
using System.Threading.Tasks;
using EHS.Server.DataAccess.DatabaseModels;
using EHS.Server.DataAccess.Queries;

namespace EHS.Server.DataAccess.Repository
{
    public interface ISafetyEventRepository
    {
        Task<SafetyEvent> GetByIdAsync(int id);
        Task<List<SafetyEvent>> GetAllAsync(List<DynamicParam> queryParams);
        int Add(SafetyEvent safetyEventAdd);
        int Update(SafetyEvent safetyEventUpdate, int id, string userId);
        Task<int> DeleteAsync(int eventId, string userId);
    }
}
