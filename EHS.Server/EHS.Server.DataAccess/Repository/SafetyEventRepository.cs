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
	                                 left join Actions a on a.EventId = e.EventId 
	                                 left join PeopleInvolved p on p.EventId = e.EventId
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
	                                 left join Actions a on a.EventId = e.EventId 
	                                 left join PeopleInvolved p on p.EventId = e.EventId";

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
                        SafetyEventToAdd.EventType,
                        SafetyEventToAdd.EventStatus,
                        SafetyEventToAdd.ReportedBy,
                        SafetyEventToAdd.ReportedOn,
                        SafetyEventToAdd.EventDate,
                        SafetyEventToAdd.EventTime,
                        SafetyEventToAdd.EmployeeId,
                        SafetyEventToAdd.JobTitle,
                        SafetyEventToAdd.Shift,
                        SafetyEventToAdd.WhatHappened,
                        SafetyEventToAdd.IsInjury,
                        SafetyEventToAdd.IsIllness,
                        SafetyEventToAdd.HoursWorkedPrior,
                        SafetyEventToAdd.InitialCategory,
                        SafetyEventToAdd.ResultingCategory,
                        SafetyEventToAdd.Division,
                        SafetyEventToAdd.Site,
                        SafetyEventToAdd.Area,
                        SafetyEventToAdd.Department,
                        SafetyEventToAdd.LocaleRegion,
                        SafetyEventToAdd.LocaleSite,
                        SafetyEventToAdd.LocalePlant,
                        SafetyEventToAdd.LocalePlantArea,
                        SafetyEventToAdd.WorkEnvironment,
                        SafetyEventToAdd.NatureOfInjury,
                        SafetyEventToAdd.BodyPart,
                        SafetyEventToAdd.FirstAidType,
                        SafetyEventToAdd.OffPlantMedicalFacility,
                        SafetyEventToAdd.MaterialInvolved,
                        SafetyEventToAdd.EquipmentInvolved,
                        SafetyEventToAdd.LostTime,
                        SafetyEventToAdd.FirstAid,
                        SafetyEventToAdd.Transported,
                        SafetyEventToAdd.ER,
                        SafetyEventToAdd.PassedPOET,
                        SafetyEventToAdd.RecordedOnVideo,
                        SafetyEventToAdd.CameraId,
                        SafetyEventToAdd.VideoStartRef,
                        SafetyEventToAdd.VideoEndRef,
                        SafetyEventToAdd.DepartmentId,
                        SafetyEventToAdd.LocaleId,
                        userId = SafetyEventToAdd.CreatedBy
                    },
                    commandType: CommandType.StoredProcedure
                    );
                return SafetyEventToAdd;
            }
        }

        public async Task<SafetyEvent> UpdateAsync(SafetyEvent SafetyEventToUpdate, int id)
        {
            using (IDbConnection sqlCon = Connection)
            {
                
                var result = await sqlCon.ExecuteAsync(
                    "dbo.spSafetyEventAddOrUpdate",
                    new
                    {
                        SafetyEventId = id, 
                        SafetyEventToUpdate.EventType,
                        SafetyEventToUpdate.EventStatus,
                        SafetyEventToUpdate.ReportedBy,
                        SafetyEventToUpdate.ReportedOn,
                        SafetyEventToUpdate.EventDate,
                        SafetyEventToUpdate.EventTime,
                        SafetyEventToUpdate.EmployeeId,
                        SafetyEventToUpdate.JobTitle,
                        SafetyEventToUpdate.Shift,
                        SafetyEventToUpdate.WhatHappened,
                        SafetyEventToUpdate.IsInjury,
                        SafetyEventToUpdate.IsIllness,
                        SafetyEventToUpdate.HoursWorkedPrior,
                        SafetyEventToUpdate.InitialCategory,
                        SafetyEventToUpdate.ResultingCategory,
                        SafetyEventToUpdate.Division,
                        SafetyEventToUpdate.Site,
                        SafetyEventToUpdate.Area,
                        SafetyEventToUpdate.Department,
                        SafetyEventToUpdate.LocaleRegion,
                        SafetyEventToUpdate.LocaleSite,
                        SafetyEventToUpdate.LocalePlant,
                        SafetyEventToUpdate.LocalePlantArea,
                        SafetyEventToUpdate.WorkEnvironment,
                        SafetyEventToUpdate.NatureOfInjury,
                        SafetyEventToUpdate.BodyPart,
                        SafetyEventToUpdate.FirstAidType,
                        SafetyEventToUpdate.OffPlantMedicalFacility,
                        SafetyEventToUpdate.MaterialInvolved,
                        SafetyEventToUpdate.EquipmentInvolved,
                        SafetyEventToUpdate.LostTime,
                        SafetyEventToUpdate.FirstAid,
                        SafetyEventToUpdate.Transported,
                        SafetyEventToUpdate.ER,
                        SafetyEventToUpdate.PassedPOET,
                        SafetyEventToUpdate.RecordedOnVideo,
                        SafetyEventToUpdate.CameraId,
                        SafetyEventToUpdate.VideoStartRef,
                        SafetyEventToUpdate.VideoEndRef,
                        SafetyEventToUpdate.DepartmentId,
                        SafetyEventToUpdate.LocaleId,
                        userId = SafetyEventToUpdate.ModifiedBy
                    },
                    commandType: CommandType.StoredProcedure
                    );
                return SafetyEventToUpdate;
            }
        }

        public async Task<int> DeleteAsync(int id)
        {
            using (IDbConnection sqlCon = Connection)
            {
                
                var result = await sqlCon.ExecuteAsync(
                    "dbo.spSafetyEventDelete",
                    new
                    {
                        safetyEventId = id,
                        userId = "Update later!!"
                    },
                    commandType: CommandType.StoredProcedure
                    );
                return result;
            }
        }
    }
}
