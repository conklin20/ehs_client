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
    public class UserRepository : IUserRepository 
    {
        private readonly IConfiguration _config;

        public UserRepository(IConfiguration config)
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
        
        public async Task<User> GetById(string id)
        {
            using (IDbConnection sqlCon = Connection)
            {
                string sQuery = @"select u.UserId, u.FullName, u.Email, u.Phone, u.RoleId, u.TimeZone, u.DateFormat, u.CreatedBy, u.CreatedOn, u.ModifiedBy, u.ModifiedOn
                                  from Users u 
                                  where u.UserId = @UserId";
                sqlCon.Open();
                var result = await sqlCon.QueryAsync<User>(sQuery, new { userId = id });
                return result.FirstOrDefault();
            }
        }

        public async Task<List<User>> GetAll()
        {
            using (IDbConnection sqlCon = Connection)
            {
                string sQuery = @"select u.UserId, u.FullName, u.Email, u.Phone, u.RoleId, u.TimeZone, u.DateFormat, u.CreatedBy, u.CreatedOn, u.ModifiedBy, u.ModifiedOn
                                  from Users u";
                sqlCon.Open();
                var result = await sqlCon.QueryAsync<User>(sQuery);
                return result.AsList();
            }
        }
    }
}
