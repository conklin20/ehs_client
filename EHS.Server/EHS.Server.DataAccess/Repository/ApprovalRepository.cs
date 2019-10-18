using Microsoft.Extensions.Configuration;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Threading.Tasks;
using System.Linq;
using EHS.Server.DataAccess.DatabaseModels;
using Dapper;


namespace EHS.Server.DataAccess.Repository
{ 
    public class ApprovalRepository : IApprovalRepository
    {
        private readonly IConfiguration _config;

        public ApprovalRepository(IConfiguration config)
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

        public async Task<Approval> GetByIdAsync(int id)
        {
            using (IDbConnection sqlCon = Connection)
            {
                //build sql query 
                string tsql = @"select ap.*, 
	                                   ac.*
                                from Approvals ap 
	                                 join Actions ac on ac.ActionId = ap.ActionId
                                where ap.ApprovalId = @ApprovalId";

                //build param list 
                var p = new
                {
                    ApprovalId = id
                };

                var result = await sqlCon.QueryAsync<Approval, Action, Approval>(
                    tsql, 
                    (approval, action) =>
                    {
                        approval.Action = action;
                        return approval;
                    },
                    p,
                    splitOn: "ActionId");

                return result.FirstOrDefault();
            }
        }

        public async Task<List<Approval>> GetAllAsync()
        {
            using (IDbConnection sqlCon = Connection)
            {
                //build sql query 
                string tsql = @"select ap.*, 
	                                   ac.*
                                from Approvals ap 
	                                 join Actions ac on ac.ActionId = ap.ActionId";

                var result = await sqlCon.QueryAsync<Approval, Action, Approval>(
                    tsql,
                    (approvals, actions) =>
                    {
                        approvals.Action = actions;
                        return approvals;
                    },
                    splitOn: "ActionId");

                return result.AsList();
            }
        }

        public async Task<int> AddAsync(Approval approvalToAdd)
        {
            using (IDbConnection sqlCon = Connection)
            {
                try
                {

                var result = await sqlCon.ExecuteAsync(
                    "dbo.spApprovalAddOrUpdate",
                    new
                    {
                        approvalToAdd.ActionId,
                        approvalToAdd.ApprovedBy,
                        approvalToAdd.ApprovedOn,
                        //approvalToAdd.Notes,
                        userId = approvalToAdd.ApprovedBy
                    },
                    commandType: CommandType.StoredProcedure
                    );
                return result;
                }
                catch(SqlException ex)
                {
                    return ex.Number;
                }
            }
        }

        public async Task<Approval> UpdateAsync(Approval approvalToUpdate)
        {
            using (IDbConnection sqlCon = Connection)
            {
                
                var result = await sqlCon.ExecuteAsync(
                    "dbo.spApprovalAddOrUpdate",
                    new
                    {
                        approvalToUpdate.ApprovalId,
                        approvalToUpdate.ActionId,
                        approvalToUpdate.ApprovalLevelId,
                        approvalToUpdate.ApprovedBy,
                        approvalToUpdate.ApprovedOn,
                        approvalToUpdate.Notes,
                        userId = "fix this later!"
                    },
                    commandType: CommandType.StoredProcedure
                    );
                return approvalToUpdate;
            }
        }

        public async Task<Approval> DeleteAsync(Approval approvalToDelete)
        {
            using (IDbConnection sqlCon = Connection)
            {
                
                var result = await sqlCon.ExecuteAsync(
                    "dbo.spApprovalDelete",
                    new
                    {
                        approvalToDelete.ApprovalId,
                        userId = "fix this later!"
                    },
                    commandType: CommandType.StoredProcedure
                    );
                return approvalToDelete;
            }
        }
    }
}
