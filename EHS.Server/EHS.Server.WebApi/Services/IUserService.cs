using EHS.Server.DataAccess.DatabaseModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EHS.Server.WebApi.Services
{
    public interface IUserService
    {
        Task<User> LoginAsync(string username, string password); 
    }
}
