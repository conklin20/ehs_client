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
                //STRING_AGG might not be a function on the version we're using. If not, we'll have to build a custom function.
                string tsql = @"select distinct	 u.UserId
					                        , u.FirstName
					                        , u.LastName
					                        , u.LogicalHierarchyId
					                        , u.PhysicalHierarchyId
											, dbo.fnGetHierarchyPath(u.LogicalHierarchyId, '|') LogicalHierarchyPath
											--, (
											--	select STRING_AGG(HierarchyId, '|')
											--	from dbo.fnGetHierarchySinglePath(u.LogicalHierarchyId)
										 --     ) LogicalHierarchyPath
											, dbo.fnGetHierarchyPath(u.PhysicalHierarchyId, '|') PhysicalHierarchyPath
											--, (
											--	select STRING_AGG(HierarchyId, '|')
											--	from dbo.fnGetHierarchySinglePath(u.PhysicalHierarchyId)
										 --     ) PhysicalHierarchyPath                                             
					                        , u.Email
					                        , isnull(u.Phone, '') as Phone
					                        , u.RoleId
					                        , isnull(u.TimeZone, '') as TimeZone
					                        , isnull(u.DateFormat, '') as DateFormat
                                            , u.enabled
					                        , u.CreatedBy
					                        , u.CreatedOn
					                        , u.ModifiedBy
					                        , u.ModifiedOn
                                            , isnull(ar.ApprovalLevel, 0) as ApprovalLevel
					                        , isnull(ar.ApprovalLevelName, '*Non Approval Role') as ApprovalLevelName
	                                        , ur.RoleName
					                        , ur.RoleCapabilities
					                        , ur.RoleLevel
                                from Users u 
	                                    left join ApprovalRoutings ar on ar.UserRoleId = u.RoleId
		                                join UserRoles ur on ur.UserRoleId = u.RoleId
                                where u.UserId = @UserId";
                
                var result = await sqlCon.QueryAsync<User>(tsql, new { userId = id });
                return result.FirstOrDefault();
            }
        }

        public async Task<List<User>> GetAllAsync()
        {
            using (IDbConnection sqlCon = Connection)
            {
                string tsql = @"select distinct	u.UserId
					                        , u.FirstName
					                        , u.LastName
					                        , u.LogicalHierarchyId
					                        , u.PhysicalHierarchyId
                                            /*
											, (
												select STRING_AGG(HierarchyId, '|')
												from dbo.fnGetHierarchySinglePath(u.LogicalHierarchyId)
										      ) LogicalHierarchyPath
											, (
												select STRING_AGG(HierarchyId, '|')
												from dbo.fnGetHierarchySinglePath(u.PhysicalHierarchyId)
										      ) PhysicalHierarchyPath
                                            */
					                        , u.Email
					                        , isnull(u.Phone, '') as Phone
					                        , u.RoleId
					                        , isnull(u.TimeZone, '') as TimeZone
					                        , isnull(u.DateFormat, '') as DateFormat
                                            , u.enabled
					                        , u.CreatedBy
					                        , u.CreatedOn
					                        , u.ModifiedBy
					                        , u.ModifiedOn
                                            , isnull(ar.ApprovalLevel, 0) as ApprovalLevel
					                        , isnull(ar.ApprovalLevelName, '*Non Approval Role') as ApprovalLevelName
	                                        , ur.RoleName
					                        , ur.RoleCapabilities
					                        , ur.RoleLevel
                                from Users u 
	                                    left join ApprovalRoutings ar on ar.UserRoleId = u.RoleId
		                                join UserRoles ur on ur.UserRoleId = u.RoleId ";
                
                var result = await sqlCon.QueryAsync<User>(tsql);
                return result.AsList();
            }
        }

        public async Task<User> AddOrUpdateAsync(User userToAddOrUpdate, string userId)
        {
            using (IDbConnection sqlCon = Connection)
            {
                
                var result = await sqlCon.ExecuteAsync(
                    "dbo.spUserAddOrUpdate",
                    new
                    {
                        userToAddOrUpdate.UserId,
                        userToAddOrUpdate.Email,
                        userToAddOrUpdate.FirstName,
                        userToAddOrUpdate.LastName,
                        userToAddOrUpdate.LogicalHierarchyId, 
                        userToAddOrUpdate.PhysicalHierarchyId,
                        userToAddOrUpdate.Phone,
                        userToAddOrUpdate.RoleId,
                        userToAddOrUpdate.TimeZone,
                        userToAddOrUpdate.DateFormat, 
                        userToAddOrUpdate.Enabled, 
                        ModifiedBy = userId                   
                    },
                    commandType: CommandType.StoredProcedure
                    );
                return userToAddOrUpdate;
            }
        }


        //public async Task<User> UpdateAsync(User userToUpdate)
        //{
        //    using (IDbConnection sqlCon = Connection)
        //    {
                
        //        var result = await sqlCon.ExecuteAsync(
        //            "dbo.spUserAddOrUpdate",
        //            new
        //            {
        //                userToUpdate.UserId,
        //                userToUpdate.Email,
        //                userToUpdate.FirstName,
        //                userToUpdate.LastName,
        //                userToUpdate.Phone,
        //                userToUpdate.RoleId,
        //                userToUpdate.TimeZone,
        //                userToUpdate.DateFormat,
        //                userToUpdate.ModifiedBy
        //            },
        //            commandType: CommandType.StoredProcedure
        //            );
        //        return userToUpdate;
        //    }
        //}

        public async Task<string> DeleteAsync(string userIdToDelete, string userId)
        {
            using (IDbConnection sqlCon = Connection)
            {
                
                var result = await sqlCon.ExecuteAsync(
                    "dbo.spUserDelete",
                    new
                    {
                        UserId = userIdToDelete,
                        ModifiedBy = userId
                    },
                    commandType: CommandType.StoredProcedure
                    );
                return userIdToDelete;
            }
        }

        public async Task<string> ReactivateAsync(string userIdToReactivate, string userId)
        {
            using (IDbConnection sqlCon = Connection)
            {
                
                var result = await sqlCon.ExecuteAsync(
                    "dbo.spUserReactivate",
                    new
                    {
                        UserId = userIdToReactivate,
                        ModifiedBy = userId
                    },
                    commandType: CommandType.StoredProcedure
                    );
                return userIdToReactivate;
            }
        }
    }
}
