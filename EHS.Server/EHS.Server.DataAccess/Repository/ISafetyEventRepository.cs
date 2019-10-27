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
        Task<int> AddAsync(SafetyEvent safetyEventAdd);
        Task<int> UpdateAsync(SafetyEvent safetyEventUpdate, int id, string userId);
        Task<int> DeleteAsync(int eventId, string userId);
    }
}
