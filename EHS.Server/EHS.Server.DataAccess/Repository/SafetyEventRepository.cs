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
    public class SafetyEventRepository : ISafetyEventRepository
    {
        private readonly IConfiguration _config;

        public SafetyEventRepository(IConfiguration config)
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

        public async Task<SafetyEvent> GetByIdAsync(int id)
        {
            using (IDbConnection sqlCon = Connection)
            {
                //build sql query 
                string tsql = @"select e.*
	                                  ,a.*
	                                  ,p.*
                                from SafetyEvents e
	                                 join Actions a on a.EventId = e.EventId 
	                                 join PeopleInvolved p on p.EventId = e.EventId
                                where e.EventId = @EventId";

                //build param list 
                var p = new
                {
                    EventId = id
                };

                var safetyEventDictionary = new Dictionary<int, SafetyEvent>();

                var result = await sqlCon.QueryAsync<SafetyEvent, Action, PeopleInvolved, SafetyEvent>(
                    tsql,
                    (safetyEvent, action, personInvolved) =>
                    {
                        if (!safetyEventDictionary.TryGetValue(safetyEvent.EventId, out SafetyEvent eventEntry))
                        {
                            eventEntry = safetyEvent;

                            eventEntry.Actions = new List<Action>();
                            eventEntry.PeopleInvolved = new List<PeopleInvolved>();
                            safetyEventDictionary.Add(eventEntry.EventId, eventEntry);
                        }

                        //check if this action has already been added to the event
                        if(!eventEntry.Actions.Any(actionToAdd => actionToAdd.ActionId == action.ActionId))
                        {
                            eventEntry.Actions.Add(action);
                        }

                        //check if this person has already been added to the event
                        if(!eventEntry.PeopleInvolved.Any(personToAdd => personToAdd.PeopleInvolvedId == personInvolved.PeopleInvolvedId))
                        {
                            eventEntry.PeopleInvolved.Add(personInvolved);
                        }
                        
                        return eventEntry;
                    },
                    p,
                    splitOn: "ActionId, PeopleInvolvedId");


                return result.Distinct().AsList().FirstOrDefault();
            }
        }

        public async Task<List<SafetyEvent>> GetAllAsync()
        {
            using (IDbConnection sqlCon = Connection)
            {
                //build sql query 
                string tsql = @"select e.*
	                                  ,a.*
	                                  ,p.*
                                from SafetyEvents e
	                                 join Actions a on a.EventId = e.EventId 
	                                 join PeopleInvolved p on p.EventId = e.EventId";

                var safetyEventDictionary = new Dictionary<int, SafetyEvent>();

                var result = await sqlCon.QueryAsync<SafetyEvent, Action, PeopleInvolved, SafetyEvent>(
                    tsql,
                    (safetyEvent, action, personInvolved) =>
                    {
                        if (!safetyEventDictionary.TryGetValue(safetyEvent.EventId, out SafetyEvent eventEntry))
                        {
                            eventEntry = safetyEvent;
                            eventEntry.Actions = new List<Action>();
                            eventEntry.PeopleInvolved = new List<PeopleInvolved>();
                            safetyEventDictionary.Add(eventEntry.EventId, eventEntry);
                        }

                        //check if this action has already been added to the event
                        if (!eventEntry.Actions.Any(actionToAdd => actionToAdd.ActionId == action.ActionId))
                        {
                            eventEntry.Actions.Add(action);
                        }

                        //check if this person has already been added to the event
                        if (!eventEntry.PeopleInvolved.Any(personToAdd => personToAdd.PeopleInvolvedId == personInvolved.PeopleInvolvedId))
                        {
                            eventEntry.PeopleInvolved.Add(personInvolved);
                        }

                        return eventEntry;
                    },
                    splitOn: "ActionId, PeopleInvolvedId");


                return result.Distinct().AsList();
            }
        }

        public async Task<SafetyEvent> AddAsync(SafetyEvent SafetyEventToAdd)
        {
            using (IDbConnection sqlCon = Connection)
            {
                var result = await sqlCon.ExecuteAsync(
                    "dbo.spSafetyEventAddOrUpdate",
                    new
                    {
                        //Add a millin params
                        userId = SafetyEventToAdd.CreatedBy
                    },
                    commandType: CommandType.StoredProcedure
                    );
                return SafetyEventToAdd;
            }
        }

        public async Task<SafetyEvent> UpdateAsync(SafetyEvent SafetyEventToUpdate)
        {
            using (IDbConnection sqlCon = Connection)
            {
                
                var result = await sqlCon.ExecuteAsync(
                    "dbo.spSafetyEventAddOrUpdate",
                    new
                    {
                        //Add a millin params
                        userId = SafetyEventToUpdate.ModifiedBy
                    },
                    commandType: CommandType.StoredProcedure
                    );
                return SafetyEventToUpdate;
            }
        }

        public async Task<SafetyEvent> DeleteAsync(SafetyEvent SafetyEventToDelete)
        {
            using (IDbConnection sqlCon = Connection)
            {
                
                var result = await sqlCon.ExecuteAsync(
                    "dbo.spSafetyEventDelete",
                    new
                    {
                        safetyEventId = SafetyEventToDelete.EventId,
                        userId = SafetyEventToDelete.ModifiedBy
                    },
                    commandType: CommandType.StoredProcedure
                    );
                return SafetyEventToDelete;
            }
        }
    }
}
