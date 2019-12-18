using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Text;
using System.Data;
using System.Data.SqlClient;
using System.Threading.Tasks;
using System.Linq;
using EHS.Server.DataAccess.DatabaseModels;
using Dapper;

namespace EHS.Server.DataAccess.Repository
{
    public class EmployeeRepository : IEmployeeRepository
    {
        private readonly IConfiguration _config;

        public EmployeeRepository(IConfiguration config)
        {
            _config = config;
        }

        public IDbConnection Connection
        {
            get
            {
                return new SqlConnection(_config.GetConnectionString("EHSConnectionString"));
            }
        }

        public async Task<Employee> GetByIdAsync(string id)
        {
            using (IDbConnection sqlCon = Connection)
            {
                string tsql = @"select e.EmployeeId, e.FirstName, e.LastName, e.BirthDate, e.Sex, e.SupervisorId, e.LastUpdatedOn, e.POET, e.Active, e.Email, e.HierarchyId, e.IsSupervisor
                                from Employees e
                                where e.EmployeeId = @employeeId ";

                var result = await sqlCon.QueryAsync<Employee>(tsql, new { employeeId = id });
                return result.FirstOrDefault();
            }
        }

        public Employee GetById(string id)
        {
            using (IDbConnection sqlCon = Connection)
            {
                string tsql = @"select e.EmployeeId, e.FirstName, e.LastName, e.BirthDate, e.Sex, e.SupervisorId, e.LastUpdatedOn, e.POET, e.Active, e.Email, e.HierarchyId, e.IsSupervisor
                                from Employees e
                                where e.EmployeeId = @employeeId ";

                var result = sqlCon.Query<Employee>(tsql, new { employeeId = id });
                return result.FirstOrDefault();
            }
        }

        public async Task<List<Employee>> GetAllAsync()
        {
            using (IDbConnection sqlCon = Connection)
            {
                string tsql = @"select e.EmployeeId, e.FirstName, e.LastName, e.BirthDate, e.Sex, e.SupervisorId, e.LastUpdatedOn, e.POET, e.Active, e.Email, e.HierarchyId, e.IsSupervisor
                                from Employees e 
                                order by e.FirstName";

                var result = await sqlCon.QueryAsync<Employee>(tsql);
                return result.AsList();
            }
        }
    }
}
