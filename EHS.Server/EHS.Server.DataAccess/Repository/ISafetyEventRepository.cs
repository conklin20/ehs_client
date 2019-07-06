using System.Collections.Generic;
using System.Threading.Tasks;
using EHS.Server.DataAccess.DatabaseModels;

namespace EHS.Server.DataAccess.Repository
{
    public interface ISafetyEventRepository
    {
        Task<SafetyEvent> GetByIdAsync(int id);
        Task<List<SafetyEvent>> GetAllAsync();
        Task<SafetyEvent> AddAsync(SafetyEvent safetyEventAdd);
        Task<SafetyEvent> UpdateAsync(SafetyEvent safetyEventUpdate);
        Task<SafetyEvent> DeleteAsync(SafetyEvent safetyEventDelete);
    }
}
