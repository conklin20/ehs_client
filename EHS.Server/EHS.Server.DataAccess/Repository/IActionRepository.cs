using System.Collections.Generic;
using System.Threading.Tasks;
using EHS.Server.DataAccess.DatabaseModels;

namespace EHS.Server.DataAccess.Repository
{
    public interface IActionRepository
    {
        Task<Action> GetByIdAsync(int id);
        Task<List<Action>> GetAllAsync();
        Task<List<Action>> GetMyActionsAsync(string userId); 
        Task<Action> AddAsync(Action actionToAdd);
        Task<Action> UpdateAsync(Action actionToUpdate);
        Task<Action> DeleteAsync(Action actionToDelete);
    }
}
