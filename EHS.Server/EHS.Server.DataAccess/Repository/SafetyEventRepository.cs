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
                                from SafetyEvents e
	                                 left join Actions a on a.EventId = e.EventId 
	                                 left join PeopleInvolved p on p.EventId = e.EventId
                                     left join EventCauses c on c.EventId = e.EventId
                                where e.EventId = @EventId";

                //build param list 
                var p = new
                {
                    EventId = id
                };

                var safetyEventDictionary = new Dictionary<int, SafetyEvent>();

                var result = await sqlCon.QueryAsync<SafetyEvent, Action, PeopleInvolved, Cause, SafetyEvent>(
                    tsql,
                    (safetyEvent, action, personInvolved, cause) =>
                    {
                        if (!safetyEventDictionary.TryGetValue(safetyEvent.EventId, out SafetyEvent eventEntry))
                        {
                            eventEntry = safetyEvent;
                            eventEntry.Actions = new List<Action>();
                            eventEntry.PeopleInvolved = new List<PeopleInvolved>();
                            eventEntry.Causes = new List<Cause>();
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

                        return eventEntry;
                    },
                    p,
                    splitOn: "ActionId, PeopleInvolvedId, EventCauseId");


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
                                from SafetyEvents e
	                                 left join Actions a on a.EventId = e.EventId 
	                                 left join PeopleInvolved p on p.EventId = e.EventId 
                                     left join EventCauses c on c.EventId = e.EventId
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
                
                var result = await sqlCon.QueryAsync<SafetyEvent, Action, PeopleInvolved, Cause, SafetyEvent>(
                    tsql,
                    (safetyEvent, action, personInvolved, cause) =>
                    {
                        if (!safetyEventDictionary.TryGetValue(safetyEvent.EventId, out SafetyEvent eventEntry))
                        {
                            eventEntry = safetyEvent;
                            eventEntry.Actions = new List<Action>();
                            eventEntry.PeopleInvolved = new List<PeopleInvolved>();
                            eventEntry.Causes = new List<Cause>(); 
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

                        return eventEntry;
                    },
                    paramList,
                    splitOn: "ActionId, PeopleInvolvedId, EventCauseId");


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
                    //new
                    //{
                        //SafetyEventToAdd.EventType,
                        //SafetyEventToAdd.EventStatus,
                        //SafetyEventToAdd.ReportedBy,
                        //SafetyEventToAdd.ReportedOn,
                        //SafetyEventToAdd.EventDate,
                        //SafetyEventToAdd.EmployeeId,
                        //SafetyEventToAdd.JobTitle,
                        //SafetyEventToAdd.Shift,
                        //SafetyEventToAdd.WhatHappened,
                        //SafetyEventToAdd.IsInjury,
                        //SafetyEventToAdd.IsIllness,
                        //SafetyEventToAdd.HoursWorkedPrior,
                        //SafetyEventToAdd.InitialCategory,
                        //SafetyEventToAdd.ResultingCategory,
                        //SafetyEventToAdd.WorkEnvironment,
                        //SafetyEventToAdd.NatureOfInjury,
                        //SafetyEventToAdd.BodyPart,
                        //SafetyEventToAdd.FirstAidType,
                        //SafetyEventToAdd.OffPlantMedicalFacility,
                        //SafetyEventToAdd.MaterialInvolved,
                        //SafetyEventToAdd.EquipmentInvolved,
                        //SafetyEventToAdd.LostTime,
                        //SafetyEventToAdd.FirstAid,
                        //SafetyEventToAdd.Transported,
                        //SafetyEventToAdd.ER,
                        //SafetyEventToAdd.RecordedOnVideo,
                        //SafetyEventToAdd.CameraId,
                        //SafetyEventToAdd.VideoStartRef,
                        //SafetyEventToAdd.VideoEndRef,
                        //SafetyEventToAdd.DepartmentId,
                        //SafetyEventToAdd.LocaleId,
                        //userId = SafetyEventToAdd.CreatedBy
                    //},
                    commandType: CommandType.StoredProcedure
                    );

                int newId = parameters.Get<int>("@NewEventId");
                return newId;
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
                        SafetyEventToUpdate.EmployeeId,
                        SafetyEventToUpdate.JobTitle,
                        SafetyEventToUpdate.Shift,
                        SafetyEventToUpdate.WhatHappened,
                        SafetyEventToUpdate.IsInjury,
                        SafetyEventToUpdate.IsIllness,
                        SafetyEventToUpdate.HoursWorkedPrior,
                        SafetyEventToUpdate.InitialCategory,
                        SafetyEventToUpdate.ResultingCategory,
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
