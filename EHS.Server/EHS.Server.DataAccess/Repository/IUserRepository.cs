using System.Collections.Generic;
using System.Threading.Tasks;
using EHS.Server.DataAccess.DatabaseModels;

namespace EHS.Server.DataAccess.Repository
{
    public interface IUserRepository
    {
        Task<User> GetByIdAsync(string username);
        Task<List<User>> GetAllAsync();
        Task<User> AddOrUpdateAsync(User userToAddOrUpdate, string userId);
        //Task<User> UpdateAsync(User userToUpdate);
        Task<string> DeleteAsync(string userIdToDelete, string userId);
        Task<string> ReactivateAsync(string userIdToReactivate, string userId);
    }
}
