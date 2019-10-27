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
    public class CauseRepository : ICausesRepository
    {
        private readonly IConfiguration _config;

        public CauseRepository(IConfiguration config)
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

        public async Task<int> SaveCausesAsync(List<Cause> causes, string userId)
        {
            DataTable dt = new DataTable();
            dt.Columns.Add("EventId", typeof(int));
            dt.Columns.Add("CauseId", typeof(int));
            dt.Columns.Add("Comments", typeof(string));

            DataRow row;
            foreach (Cause c in causes)
            {
                row = dt.NewRow();
                row[0] = c.EventId;
                row[1] = c.CauseId;
                row[2] = c.Comments;
                dt.Rows.Add(row);
            }

            using (IDbConnection sqlCon = Connection)
            {
                var result = await sqlCon.ExecuteAsync(
                    "dbo.spEventCauseMerge",
                    new
                    {
                        CausesTable = dt,
                        UserId = userId
                    },
                    commandType: CommandType.StoredProcedure
                );

                return 1;
            }
        }

        public async Task<List<Cause>> GetCausesByEventIdAsync(int eventId)
        {
            using (IDbConnection sqlCon = Connection)
            {
                //build sql query 
                string tsql = @"select c.*
                                from EventCauses c
                                where c.eventId = @EventId";

                //build param list 
                var p = new
                {
                    EventId = eventId
                };

                var result = await sqlCon.QueryAsync<Cause>(tsql, p);

                return result.AsList();
            }
        }
    }
}
