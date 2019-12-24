using Dapper;
using EHS.Server.DataAccess.DatabaseModels;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Threading.Tasks;
using Action = EHS.Server.DataAccess.DatabaseModels.Action;

namespace EHS.Server.DataAccess.Repository
{
    public class EmailRepository : IEmailRepository
    {
        private readonly IConfiguration _config;

        public EmailRepository(IConfiguration config)
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

        public async Task<List<EventHierarchySubscriber>> GetEventHierarchySubscribersAsync(int eventId)
        {
            using IDbConnection sqlCon = Connection;
            //build sql query
            string tsql = @"declare @LogicalHierarchyId int = (select DepartmentId from SafetyEvents e where e.EventId = @EventId)

                            select e.DepartmentId as HierarchyId
		                            , isnull(e.ResultingCategory, e.InitialCategory) as Category
		                            , dbo.fnGetEventSeverity(isnull(e.ResultingCategory, e.InitialCategory)) as Severity
		                            , h.HierarchyId as AssociatedHierarchyId
		                            , h.HierarchyName as AssociatedHierarchyName
		                            , concat(u.FirstName, ' ', u.LastName) as Name
		                            , u.Email
		                            , u.LogicalHierarchyId as UserHierarchyId
		                            , ur.RoleName UserRole
                            from SafetyEvents e
	                             cross join dbo.fnGetHierarchySinglePath(@LogicalHierarchyId) h 
	                             join Users u on u.LogicalHierarchyId = h.HierarchyId
	                             join ApprovalRoutings ar on ar.SeverityId = dbo.fnGetEventSeverity(isnull(e.ResultingCategory, e.InitialCategory)) and ar.UserRoleId = u.RoleId
	                             join UserRoles ur on ur.UserRoleId = u.RoleId
                            where e.EventId = @EventId";

            //build param list 
            var p = new
            {
                EventId = eventId
            };

            var result = await sqlCon.QueryAsync<EventHierarchySubscriber>(tsql, p);

            return result.AsList();
        }

        public List<EventHierarchySubscriber> GetEventHierarchySubscribers(int eventId)
        {
            using IDbConnection sqlCon = Connection;
            //build sql query
            string tsql = @"declare @LogicalHierarchyId int = (select DepartmentId from SafetyEvents e where e.EventId = @EventId)

                            select e.DepartmentId as HierarchyId
		                            , isnull(e.ResultingCategory, e.InitialCategory) as Category
		                            , dbo.fnGetEventSeverity(isnull(e.ResultingCategory, e.InitialCategory)) as Severity
		                            , h.HierarchyId as AssociatedHierarchyId
		                            , h.HierarchyName as AssociatedHierarchyName
		                            , concat(u.FirstName, ' ', u.LastName) as Name
		                            , u.Email
		                            , u.LogicalHierarchyId as UserHierarchyId
		                            , ur.RoleName UserRole
                            from SafetyEvents e
	                             cross join dbo.fnGetHierarchySinglePath(@LogicalHierarchyId) h 
	                             join Users u on u.LogicalHierarchyId = h.HierarchyId
	                             join ApprovalRoutings ar on ar.SeverityId = dbo.fnGetEventSeverity(isnull(e.ResultingCategory, e.InitialCategory)) and ar.UserRoleId = u.RoleId
	                             join UserRoles ur on ur.UserRoleId = u.RoleId
                            where e.EventId = @EventId";

            //build param list 
            var p = new
            {
                EventId = eventId
            };

            var result = sqlCon.Query<EventHierarchySubscriber>(tsql, p);

            return result.AsList();
        }

        public async Task<List<NagMail>> GetNagMailAsync(string type)
        {
            using IDbConnection sqlCon = Connection;
            {
                //build sql query
                string tsql = @" select ae.*
	                                ,a.*
                                from Actions a 
	                                    join SafetyEvents e on e.EventId = a.EventId
	                                    join Employees ae on ae.EmployeeId = a.AssignedTo
                                where a.DueDate <= GETUTCDATE()
	                                    and a.CompletionDate is null
								        and ae.Active = 1
	                                    and e.EventStatus = 'Open' 
                                order by ae.EmployeeId ";

                var nagMailDict = new Dictionary<string, NagMail>();

                var result = await sqlCon.QueryAsync<NagMail, Employee, Action, NagMail>(
                    tsql,

                    (nagMail, employee, action) =>
                    {
                        if (!nagMailDict.TryGetValue(nagMail.Employee.EmployeeId, out NagMail nagMailEntry))
                        {
                            nagMailEntry = nagMail;
                            nagMailEntry.Type = type;
                            nagMailEntry.Employee = new Employee();
                            nagMailEntry.Actions = new List<Action>();
                            nagMailDict.Add(nagMailEntry.Employee.EmployeeId, nagMailEntry);
                        }

                        nagMailEntry.Employee = employee;

                        //check if this action has already been added to the dictionary 
                        if (!nagMailEntry.Actions.Any(actionToAdd => actionToAdd.ActionId == action.ActionId))
                        {
                            if (action != null)
                            {
                                nagMailEntry.Actions.Add(action);
                            }
                        }

                        return nagMailEntry;
                    },
                    splitOn: "ActionId");

                //return result.Distinct().AsList();
                return nagMailDict.Values.ToList();
            }
        }
    }
}
