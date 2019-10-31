using Dapper;
using EHS.Server.DataAccess.DatabaseModels;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EHS.Server.DataAccess.Repository
{
    public class UserRoleRepository : IUserRoleRepository
    {
        private readonly IConfiguration _config;

        public UserRoleRepository(IConfiguration config)
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
        
        public async Task<List<UserRole>> GetAllAsync()
        {
            using (IDbConnection sqlCon = Connection)
            {
                string tsql = @"select ur.* from dbo.UserRoles ur order by ur.RoleLevel";
                
                var result = await sqlCon.QueryAsync<UserRole>(tsql);
                return result.AsList();
            }
        }

    }
}
