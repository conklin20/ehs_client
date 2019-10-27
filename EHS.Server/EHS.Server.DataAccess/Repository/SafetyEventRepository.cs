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
                                      ,c.*
                                      ,ef.*
                                from SafetyEvents e
	                                 left join Actions a on a.EventId = e.EventId 
	                                 left join PeopleInvolved p on p.EventId = e.EventId
                                     left join EventCauses c on c.EventId = e.EventId
                                     left join EventFiles ef on ef.EventId = e.EventId
                                where e.EventId = @EventId";

                //build param list 
                var p = new
                {
                    EventId = id
                };

                var safetyEventDictionary = new Dictionary<int, SafetyEvent>();

                var result = await sqlCon.QueryAsync<SafetyEvent, Action, PeopleInvolved, Cause, EventFile, SafetyEvent>(
                    tsql,
                    (safetyEvent, action, personInvolved, cause, file) =>
                    {
                        if (!safetyEventDictionary.TryGetValue(safetyEvent.EventId, out SafetyEvent eventEntry))
                        {
                            eventEntry = safetyEvent;
                            eventEntry.Actions = new List<Action>();
                            eventEntry.PeopleInvolved = new List<PeopleInvolved>();
                            eventEntry.Causes = new List<Cause>();
                            eventEntry.Files = new List<EventFile>();
                            safetyEventDictionary.Add(eventEntry.EventId, eventEntry);
                        }
                        
                        //check if this action has already been added to the event
                        if (!eventEntry.Actions.Any(actionToAdd => actionToAdd.ActionId == action.ActionId))
                        {
                            if (action != null)
                            {
                                eventEntry.Actions.Add(action);
                            }
                        }

                        //check if this person has already been added to the event
                        if (!eventEntry.PeopleInvolved.Any(personToAdd => personToAdd.PeopleInvolvedId == personInvolved.PeopleInvolvedId))
                        {
                            if (personInvolved != null)
                            {
                                eventEntry.PeopleInvolved.Add(personInvolved);
                            }
                        }

                        //check if this cause has already been added to the event
                        if (!eventEntry.Causes.Any(causeToAdd => causeToAdd.EventCauseId == cause.EventCauseId))
                        {
                            if (cause != null)
                            {
                                eventEntry.Causes.Add(cause);
                            }
                        }

                        //check if this file has already been added to the event
                        if (!eventEntry.Files.Any(fileToAdd => fileToAdd.EventFileId == file.EventFileId))
                        {
                            if (file != null)
                            {
                                eventEntry.Files.Add(file);
                            }
                        }

                        return eventEntry;
                    },
                    p,
                    splitOn: "ActionId, PeopleInvolvedId, EventCauseId, EventFileId");


                return result.Distinct().FirstOrDefault();
            }
        }

        public async Task<List<SafetyEvent>> GetAllAsync(List<DynamicParam> queryParams)
        {
            using (IDbConnection sqlCon = Connection)
            {
                //build sql query 
                string tsql = @"select e.*
	                                  ,a.*
	                                  ,p.*
                                      ,c.*
                                      ,ef.*
                                from SafetyEvents e
	                                 left join Actions a on a.EventId = e.EventId 
	                                 left join PeopleInvolved p on p.EventId = e.EventId
                                     left join EventCauses c on c.EventId = e.EventId
                                     left join EventFiles ef on ef.EventId = e.EventId
                                where 1 = 1 ";

                //build param list 
                DynamicParameters paramList = new DynamicParameters(); 

                foreach (DynamicParam param in queryParams)
                {
                    //add the where clause to the sql string 
                    tsql += $" and {param.TableAlias}{param.FieldName} {param.Operator} {param.ParamName}";
                    //then add the param to the param list 
                    //a value should always either be single string, or string[], never both 
                    if(param.SingleValue != null)
                    {
                        paramList.Add($"{param.ParamName}", param.SingleValue); //, DbType.String, ParameterDirection.Input);
                    } else
                    {
                        paramList.Add($"{param.ParamName}", param.MultiValue.ToList());
                    }
                }

                var safetyEventDictionary = new Dictionary<int, SafetyEvent>();
                
                var result = await sqlCon.QueryAsync<SafetyEvent, Action, PeopleInvolved, Cause, EventFile, SafetyEvent>(
                    tsql,
                    (safetyEvent, action, personInvolved, cause, file) =>
                    {
                        if (!safetyEventDictionary.TryGetValue(safetyEvent.EventId, out SafetyEvent eventEntry))
                        {
                            eventEntry = safetyEvent;
                            eventEntry.Actions = new List<Action>();
                            eventEntry.PeopleInvolved = new List<PeopleInvolved>();
                            eventEntry.Causes = new List<Cause>();
                            eventEntry.Files = new List<EventFile>();
                            safetyEventDictionary.Add(eventEntry.EventId, eventEntry);
                        }

                        //check if this action has already been added to the event
                        if (!eventEntry.Actions.Any(actionToAdd => actionToAdd.ActionId == action.ActionId))
                        {
                            if (action != null)
                            {
                                eventEntry.Actions.Add(action);
                            }
                        }

                        //check if this person has already been added to the event
                        if (!eventEntry.PeopleInvolved.Any(personToAdd => personToAdd.PeopleInvolvedId == personInvolved.PeopleInvolvedId))
                        {
                            if (personInvolved != null)
                            {
                                eventEntry.PeopleInvolved.Add(personInvolved);
                            }
                        }

                        //check if this cause has already been added to the event
                        if (!eventEntry.Causes.Any(causeToAdd => causeToAdd.EventCauseId == cause.EventCauseId))
                        {
                            if (cause != null)
                            {
                                eventEntry.Causes.Add(cause);
                            }
                        }

                        //check if this file has already been added to the event
                        if (!eventEntry.Files.Any(fileToAdd => fileToAdd.EventFileId == file.EventFileId))
                        {
                            if (file != null)
                            {
                                eventEntry.Files.Add(file);
                            }
                        }

                        return eventEntry;
                    },
                    paramList,
                    splitOn: "ActionId, PeopleInvolvedId, EventCauseId, EventFileId");


                return result.Distinct().AsList();
            }
        }

        public async Task<int> AddAsync(SafetyEvent SafetyEventToAdd)
        {
            using (IDbConnection sqlCon = Connection)
            {
                DynamicParameters parameters = new DynamicParameters();

                parameters.Add("@EventType", SafetyEventToAdd.EventType, dbType: DbType.String);
                parameters.Add("@EventStatus", SafetyEventToAdd.EventStatus, dbType: DbType.String);
                parameters.Add("@ReportedBy", SafetyEventToAdd.ReportedBy, dbType: DbType.String);
                parameters.Add("@ReportedOn", SafetyEventToAdd.ReportedOn, dbType: DbType.DateTime2);
                parameters.Add("@EventDate", SafetyEventToAdd.EventDate, dbType: DbType.Date);
                parameters.Add("@EmployeeId", SafetyEventToAdd.EmployeeId, dbType: DbType.String);
                parameters.Add("@JobTitle", SafetyEventToAdd.JobTitle, dbType: DbType.String);
                parameters.Add("@Shift", SafetyEventToAdd.Shift, dbType: DbType.String);
                parameters.Add("@WhatHappened", SafetyEventToAdd.WhatHappened, dbType: DbType.String);
                parameters.Add("@IsInjury", SafetyEventToAdd.IsInjury, dbType: DbType.Boolean);
                parameters.Add("@IsIllness", SafetyEventToAdd.IsIllness, dbType: DbType.Boolean);
                parameters.Add("@HoursWorkedPrior", SafetyEventToAdd.HoursWorkedPrior, dbType: DbType.Decimal);
                parameters.Add("@InitialCategory", SafetyEventToAdd.InitialCategory, dbType: DbType.String);
                parameters.Add("@ResultingCategory", SafetyEventToAdd.ResultingCategory, dbType: DbType.String);
                parameters.Add("@WorkEnvironment", SafetyEventToAdd.WorkEnvironment, dbType: DbType.String);
                parameters.Add("@NatureOfInjury", SafetyEventToAdd.NatureOfInjury, dbType: DbType.String);
                parameters.Add("@BodyPart", SafetyEventToAdd.BodyPart, dbType: DbType.String);
                parameters.Add("@FirstAidType", SafetyEventToAdd.FirstAidType, dbType: DbType.String);
                parameters.Add("@OffPlantMedicalFacility", SafetyEventToAdd.OffPlantMedicalFacility, dbType: DbType.String);
                parameters.Add("@MaterialInvolved", SafetyEventToAdd.MaterialInvolved, dbType: DbType.String);
                parameters.Add("@EquipmentInvolved", SafetyEventToAdd.EquipmentInvolved, dbType: DbType.String);
                parameters.Add("@LostTime", SafetyEventToAdd.LostTime, dbType: DbType.Boolean);
                parameters.Add("@FirstAid", SafetyEventToAdd.FirstAid, dbType: DbType.Boolean);
                parameters.Add("@Transported", SafetyEventToAdd.Transported, dbType: DbType.Boolean);
                parameters.Add("@ER", SafetyEventToAdd.ER, dbType: DbType.Boolean);
                parameters.Add("@RecordedOnVideo", SafetyEventToAdd.RecordedOnVideo, dbType: DbType.Boolean);
                parameters.Add("@CameraId", SafetyEventToAdd.CameraId, dbType: DbType.Int32);
                parameters.Add("@VideoStartRef", SafetyEventToAdd.VideoStartRef, dbType: DbType.DateTime2);
                parameters.Add("@VideoEndRef", SafetyEventToAdd.VideoEndRef, dbType: DbType.DateTime2);
                parameters.Add("@DepartmentId", SafetyEventToAdd.DepartmentId, dbType: DbType.Int32);
                parameters.Add("@LocaleId", SafetyEventToAdd.LocaleId, dbType: DbType.Int32);
                parameters.Add("@UserId", SafetyEventToAdd.CreatedBy, dbType: DbType.String);
                parameters.Add("@NewEventId", dbType: DbType.Int32, direction: ParameterDirection.Output);

                var addedSafetyEvent = sqlCon.Execute(
                    "dbo.spSafetyEventAddOrUpdate",
                    parameters,
                    commandType: CommandType.StoredProcedure
                );

                int newId = parameters.Get<int>("@NewEventId");
                return newId;
            }
        }

        public async Task<int> UpdateAsync(SafetyEvent SafetyEventToUpdate, int id, string userId)
        {
            using (IDbConnection sqlCon = Connection)
            {

                DynamicParameters parameters = new DynamicParameters();

                parameters.Add("@EventId", SafetyEventToUpdate.EventId, dbType: DbType.Int32);
                parameters.Add("@EventType", SafetyEventToUpdate.EventType, dbType: DbType.String);
                parameters.Add("@EventStatus", SafetyEventToUpdate.EventStatus, dbType: DbType.String);
                parameters.Add("@ReportedBy", SafetyEventToUpdate.ReportedBy, dbType: DbType.String);
                parameters.Add("@ReportedOn", SafetyEventToUpdate.ReportedOn, dbType: DbType.DateTime2);
                parameters.Add("@EventDate", SafetyEventToUpdate.EventDate, dbType: DbType.Date);
                parameters.Add("@EmployeeId", SafetyEventToUpdate.EmployeeId, dbType: DbType.String);
                parameters.Add("@JobTitle", SafetyEventToUpdate.JobTitle, dbType: DbType.String);
                parameters.Add("@Shift", SafetyEventToUpdate.Shift, dbType: DbType.String);
                parameters.Add("@WhatHappened", SafetyEventToUpdate.WhatHappened, dbType: DbType.String);
                parameters.Add("@IsInjury", SafetyEventToUpdate.IsInjury, dbType: DbType.Boolean);
                parameters.Add("@IsIllness", SafetyEventToUpdate.IsIllness, dbType: DbType.Boolean);
                parameters.Add("@HoursWorkedPrior", SafetyEventToUpdate.HoursWorkedPrior, dbType: DbType.Decimal);
                parameters.Add("@InitialCategory", SafetyEventToUpdate.InitialCategory, dbType: DbType.String);
                parameters.Add("@ResultingCategory", SafetyEventToUpdate.ResultingCategory, dbType: DbType.String);
                parameters.Add("@WorkEnvironment", SafetyEventToUpdate.WorkEnvironment, dbType: DbType.String);
                parameters.Add("@NatureOfInjury", SafetyEventToUpdate.NatureOfInjury, dbType: DbType.String);
                parameters.Add("@BodyPart", SafetyEventToUpdate.BodyPart, dbType: DbType.String);
                parameters.Add("@FirstAidType", SafetyEventToUpdate.FirstAidType, dbType: DbType.String);
                parameters.Add("@OffPlantMedicalFacility", SafetyEventToUpdate.OffPlantMedicalFacility, dbType: DbType.String);
                parameters.Add("@MaterialInvolved", SafetyEventToUpdate.MaterialInvolved, dbType: DbType.String);
                parameters.Add("@EquipmentInvolved", SafetyEventToUpdate.EquipmentInvolved, dbType: DbType.String);
                parameters.Add("@LostTime", SafetyEventToUpdate.LostTime, dbType: DbType.Boolean);
                parameters.Add("@FirstAid", SafetyEventToUpdate.FirstAid, dbType: DbType.Boolean);
                parameters.Add("@Transported", SafetyEventToUpdate.Transported, dbType: DbType.Boolean);
                parameters.Add("@ER", SafetyEventToUpdate.ER, dbType: DbType.Boolean);
                parameters.Add("@RecordedOnVideo", SafetyEventToUpdate.RecordedOnVideo, dbType: DbType.Boolean);
                parameters.Add("@CameraId", SafetyEventToUpdate.CameraId, dbType: DbType.Int32);
                parameters.Add("@VideoStartRef", SafetyEventToUpdate.VideoStartRef, dbType: DbType.DateTime2);
                parameters.Add("@VideoEndRef", SafetyEventToUpdate.VideoEndRef, dbType: DbType.DateTime2);
                parameters.Add("@DepartmentId", SafetyEventToUpdate.DepartmentId, dbType: DbType.Int32);
                parameters.Add("@LocaleId", SafetyEventToUpdate.LocaleId, dbType: DbType.Int32);
                parameters.Add("@UserId", userId, dbType: DbType.String);
                parameters.Add("@NewEventId", dbType: DbType.Int32, direction: ParameterDirection.Output);

                var success = sqlCon.Execute(
                    "dbo.spSafetyEventAddOrUpdate",
                    parameters,
                    commandType: CommandType.StoredProcedure
                );
                return success;
            }
        }

        public async Task<int> DeleteAsync(int eventId, string userId)
        {
            using (IDbConnection sqlCon = Connection)
            {
                
                var result = await sqlCon.ExecuteAsync(
                    "dbo.spSafetyEventDelete",
                    new
                    {
                        safetyEventId = eventId,
                        userId = userId
                    },
                    commandType: CommandType.StoredProcedure
                    );
                return result;
            }
        }
    }
}
