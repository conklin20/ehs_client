using System.Collections.Generic;
using System.Threading.Tasks;
using EHS.Server.DataAccess.DatabaseModels;
using EHS.Server.DataAccess.Queries;

namespace EHS.Server.DataAccess.Repository
{
    public interface IActionRepository
    {
        Task<Action> GetByIdAsync(int id);
        Task<List<Action>> GetAllAsync(List<DynamicParam> queryParams);
        Task<List<Action>> GetMyActionsAsync(string userId); 
        Task<int> AddAsync(List<Action> actionsToAdd);
        Task<Action> UpdateAsync(Action actionToUpdate);
        Task<int> DeleteAsync(int actionId, string userId);
        Task<List<Action>> GetByEventId(int eventId); 
    }
}
