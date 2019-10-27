using Microsoft.Extensions.Configuration;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Threading.Tasks;
using System.Linq;
using EHS.Server.DataAccess.DatabaseModels;
using Dapper;
using EHS.Server.DataAccess.Queries;

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

        public async Task<List<Action>> GetAllAsync(List<DynamicParam> queryParams)
        {
            using (IDbConnection sqlCon = Connection)
            {
                //build sql query 
                //string tsql = @"select a.*, 
                //                       ap.*
                //                from Actions a 
                //                     left join Approvals ap on a.ActionId = ap.ActionId
                //                where 1 = 1 ";

                string tsql = @"select ac.*, 
	                                   ar.*,
	                                   ap.*
                                from Actions ac
	                                 join SafetyEvents e on e.EventId = ac.EventId
	                                 join ApprovalRoutings ar on ar.SeverityId = dbo.fnGetEventSeverity(isnull(e.InitialCategory, e.ResultingCategory))
	                                 left join Approvals ap on ap.ActionId = ac.ActionId and ap.ApprovalLevelId = ar.ApprovalLevel
                                where 1 = 1 ";

                //build param list 
                DynamicParameters paramList = new DynamicParameters();

                foreach (DynamicParam param in queryParams)
                {
                    //add the where clause to the sql string 
                    tsql += $" and {param.TableAlias}{param.FieldName} {param.Operator} {param.ParamName}";
                    //then add the param to the param list 
                    //a value should always either be single string, or string[], never both 
                    if (param.SingleValue != null)
                    {
                        paramList.Add($"{param.ParamName}", param.SingleValue); //, DbType.String, ParameterDirection.Input);
                    }
                    else
                    {
                        paramList.Add($"{param.ParamName}", param.MultiValue.ToList());
                    }
                }

                tsql += " order by ac.DueDate desc, ac.CompletionDate desc, ar.ApprovalLevel ";

                //var result = await sqlCon.QueryAsync<Action>(tsql, paramList);

                var actionDictionary = new Dictionary<int, Action>();

                var result = await sqlCon.QueryAsync<Action, ApprovalRouting, Approval, Action>(
                    tsql,
                    (action, approvalLevel, approval) =>
                    {

                        if (!actionDictionary.TryGetValue(action.ActionId, out Action actionEntry))
                        {
                            actionEntry = action;
                            actionEntry.ApprovalsNeeded = new List<ApprovalRouting>();
                            actionEntry.Approvals = new List<Approval>();
                            actionDictionary.Add(actionEntry.ActionId, actionEntry);
                        }

                        if (approvalLevel != null)
                        {
                            //check if this approval level has already been added to the event
                            if (!actionEntry.ApprovalsNeeded.Any(approvalLevelToAdd => approvalLevelToAdd.ApprovalRoutingId == approvalLevel.ApprovalRoutingId)
                                //If this approval level hasnt already been approved 
                                && (approval != null ? approvalLevel.ApprovalLevel != approval.ApprovalLevelId : true))
                            {
                                actionEntry.ApprovalsNeeded.Add(approvalLevel);
                            }
                        }

                        if (approval != null)
                        {
                            //check if this approval has already been added to the event
                            if (!actionEntry.Approvals.Any(approvalToAdd => approvalToAdd.ApprovalId == approval.ApprovalId))
                            {
                                approval.ApprovalLevel = approvalLevel; 
                                actionEntry.Approvals.Add(approval);
                            }
                        }

                        return action;
                    },
                    paramList,
                    splitOn: "ApprovalRoutingId, ApprovalId");

                return actionDictionary.Values.ToList();
            }
        }

        public async Task<List<Action>> GetAllByEventAsync(int eventId)
        {
            using (IDbConnection sqlCon = Connection)
            {
                //build sql query 
                string tsql = @"select a.*
                                from Actions a 
                                where a.eventId = @EventId";

                //build param list 
                var p = new
                {
                    EventId = eventId
                };

                var result = await sqlCon.QueryAsync<Action>(tsql, p);
                
                return result.AsList();
            }
        }

        public async Task<int> AddAsync(List<Action> ActionsToAdd)
        {   

            using (IDbConnection sqlCon = Connection)
            {
                for (var i = 0; i < ActionsToAdd.Count; i++)
                {
                    var result = await sqlCon.ExecuteAsync(
                    "dbo.spActionAddOrUpdate",
                    new
                    {
                        //parameters
                        ActionsToAdd[i].EventId,
                        ActionsToAdd[i].EventType,
                        ActionsToAdd[i].AssignedTo,
                        ActionsToAdd[i].ActionToTake,
                        ActionsToAdd[i].ActionType,
                        ActionsToAdd[i].DueDate,
                        ActionsToAdd[i].CompletionDate,
                        userId = ActionsToAdd[i].CreatedBy
                    },
                    commandType: CommandType.StoredProcedure
                    );
                }

                return 1;
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

        public async Task<int> DeleteAsync(int actionId, string userId)
        {
            using (IDbConnection sqlCon = Connection)
            {
                
                var result = await sqlCon.ExecuteAsync(
                    "dbo.spActionDelete",
                    new
                    {
                        actionId,
                        userId
                    },
                    commandType: CommandType.StoredProcedure
                    );
                return actionId;
            }
        }
    }
}
