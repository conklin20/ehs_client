using System.Collections.Generic;
using System.Threading.Tasks;
using EHS.Server.DataAccess.DatabaseModels;

namespace EHS.Server.DataAccess.Repository
{
    public interface IUserRepository
    {
        Task<User> GetByIdAsync(string username);
        Task<List<User>> GetAllAsync();
        Task<User> AddAsync(User userToAdd);
        Task<User> UpdateAsync(User userToUpdate);
        Task<User> DeleteAsync(User userToDelete);
        Task<User> ReactivateAsync(User userToReactivate);
    }
}
