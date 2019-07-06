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
    public class SeverityRepository : ISeverityRepository
    {
        private readonly IConfiguration _config;

        public SeverityRepository(IConfiguration config)
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

        public async Task<List<Severity>> GetAllAsync()
        {
            using (IDbConnection sqlCon = Connection)
            {
                //build sql query 
                string tsql = @"select s.* from Severities s ";

                var result = await sqlCon.QueryAsync<Severity>(tsql); 

                return result.AsList();
            }
        }
    }
}
