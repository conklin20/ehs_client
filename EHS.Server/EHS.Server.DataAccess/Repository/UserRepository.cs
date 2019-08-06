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
        
        public async Task<User> GetByIdAsync(string id)
        {
            using (IDbConnection sqlCon = Connection)
            {
                string tsql = @"select u.UserId, u.FirstName, u.LastName, u.LogicalHierarchyId, u.PhysicalHierarchyId, u.Email, u.Phone, u.RoleId, u.TimeZone, u.DateFormat, u.CreatedBy, u.CreatedOn, u.ModifiedBy, u.ModifiedOn
                                from Users u 
                                where u.UserId = @UserId";
                
                var result = await sqlCon.QueryAsync<User>(tsql, new { userId = id });
                return result.FirstOrDefault();
            }
        }

        public async Task<List<User>> GetAllAsync()
        {
            using (IDbConnection sqlCon = Connection)
            {
                string tsql = @"select u.UserId, u.FirstName, u.LastName, u.LogicalHierarchyId, u.PhysicalHierarchyId, u.Email, u.Phone, u.RoleId, u.TimeZone, u.DateFormat, u.CreatedBy, u.CreatedOn, u.ModifiedBy, u.ModifiedOn
                                from Users u ";
                
                var result = await sqlCon.QueryAsync<User>(tsql);
                return result.AsList();
            }
        }

        public async Task<User> AddAsync(User userToAdd)
        {
            using (IDbConnection sqlCon = Connection)
            {
                
                var result = await sqlCon.ExecuteAsync(
                    "dbo.spUserAddOrUpdate",
                    new
                    {
                        userToAdd.UserId,
                        userToAdd.Email, 
                        userToAdd.FirstName,
                        userToAdd.LastName,
                        userToAdd.Phone, 
                        userToAdd.RoleId, 
                        userToAdd.TimeZone, 
                        userToAdd.DateFormat, 
                        userToAdd.CreatedBy, 
                        userToAdd.ModifiedBy                        
                    },
                    commandType: CommandType.StoredProcedure
                    );
                return userToAdd;
            }
        }


        public async Task<User> UpdateAsync(User userToUpdate)
        {
            using (IDbConnection sqlCon = Connection)
            {
                
                var result = await sqlCon.ExecuteAsync(
                    "dbo.spUserAddOrUpdate",
                    new
                    {
                        userToUpdate.UserId,
                        userToUpdate.Email,
                        userToUpdate.FirstName,
                        userToUpdate.LastName,
                        userToUpdate.Phone,
                        userToUpdate.RoleId,
                        userToUpdate.TimeZone,
                        userToUpdate.DateFormat,
                        userToUpdate.CreatedBy,
                        userToUpdate.ModifiedBy
                    },
                    commandType: CommandType.StoredProcedure
                    );
                return userToUpdate;
            }
        }

        public async Task<User> DeleteAsync(User userToDelete)
        {
            using (IDbConnection sqlCon = Connection)
            {
                
                var result = await sqlCon.ExecuteAsync(
                    "dbo.spUserDelete",
                    new
                    {
                        userToDelete.UserId, 
                        userToDelete.ModifiedBy
                    },
                    commandType: CommandType.StoredProcedure
                    );
                return userToDelete;
            }
        }

        public async Task<User> ReactivateAsync(User userToDelete)
        {
            using (IDbConnection sqlCon = Connection)
            {
                
                var result = await sqlCon.ExecuteAsync(
                    "dbo.spUserReactivate",
                    new
                    {
                        userToDelete.UserId,
                        userToDelete.ModifiedBy
                    },
                    commandType: CommandType.StoredProcedure
                    );
                return userToDelete;
            }
        }
    }
}
