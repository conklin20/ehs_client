using Dapper;
using EHS.Server.DataAccess.DatabaseModels;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Text;
using System.Threading.Tasks;

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
    }
}
