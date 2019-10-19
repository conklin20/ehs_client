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

        public async Task<int> SavePeopleInvolved(List<PeopleInvolved> peopleInvolved, string userId)
        {
            //DynamicParameters parameter = new DynamicParameters();

            //parameter.Add("@Kind", InvoiceKind.WebInvoice, DbType.Object, ParameterDirection.Input);


            //var dt = peopleInvolved;
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
                    "dbo.spPeopleInvolvedAddOrUpdate",
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
    }
}
