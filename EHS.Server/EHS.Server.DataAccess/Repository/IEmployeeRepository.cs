using EHS.Server.DataAccess.DatabaseModels;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace EHS.Server.DataAccess.Repository
{
    public interface IEmployeeRepository
    {
        Task<Employee> GetByIdAsync(string id);
        Task<List<Employee>> GetAllAsync();
    }
}
