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
    public class ActionRepository : IActionRepository
    {
        private readonly IConfiguration _config;

        public ActionRepository(IConfiguration config)
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

        public async Task<Action> GetByIdAsync(int id)
        {
            using (IDbConnection sqlCon = Connection)
            {
                //build sql query 
                string tsql = @"select a.*, 
	                                   e.*
                                from Actions a 
	                                 join SafetyEvents e on e.EventId = a.EventId
                                where a.ActionId = @ActionId";
                //build param list 
                var p = new
                {
                    ActionId = id
                };

                var result = await sqlCon.QueryAsync<Action, SafetyEvent, Action>(
                    tsql, 
                    (action, safetyEvent) =>
                    {
                        action.SafetyEvent = safetyEvent;
                        return action;
                    },
                    p,
                    splitOn: "EventId");

                return result.FirstOrDefault();
            }
        }

        public async Task<List<Action>> GetMyActionsAsync(string userId)
        {
            using (IDbConnection sqlCon = Connection)
            {
                //build sql query
                string tsql = @"select a.*, 
	                                   e.*
                                from Actions a 
	                                 join SafetyEvents e on e.EventId = a.EventId
                                where a.AssignedTo = @AssignedTo";

                //build param list 
                var p = new
                {
                    AssignedTo = userId
                };

                var result = await sqlCon.QueryAsync<Action, SafetyEvent, Action>(
                    tsql,
                    (action, safetyEvent) =>
                    {
                        action.SafetyEvent = safetyEvent;
                        return action;
                    },
                    p,
                    splitOn: "EventId");
                return result.AsList();
            }
        }

        public async Task<List<Action>> GetAllAsync()
        {
            using (IDbConnection sqlCon = Connection)
            {
                //build sql query 
                string tsql = @"select a.*, 
	                                   e.*
                                from Actions a 
	                                 join SafetyEvents e on e.EventId = a.EventId";

                var result = await sqlCon.QueryAsync<Action, SafetyEvent, Action>(
                    tsql,
                    (actions, safetyEvents) =>
                    {
                        actions.SafetyEvent = safetyEvents;
                        return actions;
                    },
                    splitOn: "EventId");

                return result.AsList();
            }
        }

        public async Task<Action> AddAsync(Action ActionToAdd)
        {
            using (IDbConnection sqlCon = Connection)
            {
                var result = await sqlCon.ExecuteAsync(
                    "dbo.spActionAddOrUpdate",
                    new
                    {
                        ActionToAdd.EventId,
                        ActionToAdd.EventType,
                        ActionToAdd.AssignedTo,
                        ActionToAdd.ActionToTake,
                        ActionToAdd.ActionType,
                        ActionToAdd.DueDate, 
                        ActionToAdd.CompletionDate, 
                        ActionToAdd.ApprovalDate,
                        userId = ActionToAdd.CreatedBy
                    },
                    commandType: CommandType.StoredProcedure
                    );
                return ActionToAdd;
            }
        }

        public async Task<Action> UpdateAsync(Action ActionToUpdate)
        {
            using (IDbConnection sqlCon = Connection)
            {
                
                var result = await sqlCon.ExecuteAsync(
                    "dbo.spActionAddOrUpdate",
                    new
                    {
                        ActionToUpdate.ActionId,
                        ActionToUpdate.EventId,
                        ActionToUpdate.EventType,
                        ActionToUpdate.AssignedTo,
                        ActionToUpdate.ActionToTake,
                        ActionToUpdate.ActionType,
                        ActionToUpdate.DueDate,
                        ActionToUpdate.CompletionDate,
                        ActionToUpdate.ApprovalDate,
                        userId = ActionToUpdate.ModifiedBy
                    },
                    commandType: CommandType.StoredProcedure
                    );
                return ActionToUpdate;
            }
        }

        public async Task<Action> DeleteAsync(Action ActionToDelete)
        {
            using (IDbConnection sqlCon = Connection)
            {
                
                var result = await sqlCon.ExecuteAsync(
                    "dbo.spActionDelete",
                    new
                    {
                        ActionToDelete.ActionId,
                        userId = ActionToDelete.ModifiedBy
                    },
                    commandType: CommandType.StoredProcedure
                    );
                return ActionToDelete;
            }
        }
    }
}
