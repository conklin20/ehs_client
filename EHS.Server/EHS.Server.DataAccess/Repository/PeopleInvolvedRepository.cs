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
    public class PeopleInvolvedRepository : IPeopleInvolvedRepository
    {
        private readonly IConfiguration _config;

        public PeopleInvolvedRepository(IConfiguration config)
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

        public async Task<int> SavePeopleInvolvedAsync(List<PeopleInvolved> peopleInvolved, string userId)
        {
            DataTable dt = new DataTable();
            dt.Columns.Add("RoleId", typeof(int));
            dt.Columns.Add("EventId", typeof(int));
            dt.Columns.Add("EmployeeId", typeof(string));
            dt.Columns.Add("Comments", typeof(string));

            DataRow row; 
            foreach (PeopleInvolved pi in peopleInvolved)
            {
                row = dt.NewRow();
                row[0] = pi.RoleId;
                row[1] = pi.EventId;
                row[2] = pi.EmployeeId;
                row[3] = pi.Comments; 
                dt.Rows.Add(row);
            }
                       
            using (IDbConnection sqlCon = Connection)
            {
                var result = await sqlCon.ExecuteAsync(
                    "dbo.spPeopleInvolvedMerge",
                    new
                    {
                        PeopleInvolvedTable = dt, 
                        UserId = userId
                    },
                    commandType: CommandType.StoredProcedure
                );               

                return 1;
            }
        }
        
        public async Task<List<PeopleInvolved>> GetPeopleByEventIdAsync(int eventId)
        {
            using (IDbConnection sqlCon = Connection)
            {
                //build sql query 
                string tsql = @"select p.*
                                from PeopleInvolved p
                                where p.eventId = @EventId";

                //build param list 
                var p = new
                {
                    EventId = eventId
                };

                var result = await sqlCon.QueryAsync<PeopleInvolved>(tsql, p);

                return result.AsList();
            }
        }
    }
}
