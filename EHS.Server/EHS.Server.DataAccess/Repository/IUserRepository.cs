using System.Collections.Generic;
using System.Threading.Tasks;
using EHS.Server.DataAccess.DatabaseModels;

namespace EHS.Server.DataAccess.Repository
{
    public interface IUserRepository
    {
        Task<User> GetById(string username);
        Task<List<User>> GetAll(); 
    }
}
