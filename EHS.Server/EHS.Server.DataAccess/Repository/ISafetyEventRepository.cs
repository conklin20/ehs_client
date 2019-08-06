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
        Task<SafetyEvent> AddAsync(SafetyEvent safetyEventAdd);
        Task<SafetyEvent> UpdateAsync(SafetyEvent safetyEventUpdate, int id);
        Task<int> DeleteAsync(int id);
    }
}
