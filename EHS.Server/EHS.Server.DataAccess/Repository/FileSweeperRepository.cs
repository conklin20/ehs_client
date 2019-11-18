using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Text;
using System.Threading.Tasks;
using Dapper;

namespace EHS.Server.DataAccess.Repository
{
    public class FileSweeperRepository : IFileSweeperRepository
    {
        private readonly IConfiguration _config;
        private static long RowCount { get; set; }

        public FileSweeperRepository(IConfiguration config)
        {
            _config = config;
            RowCount = 0; 
        }

        public IDbConnection Connection
        {
            get
            {
                return new SqlConnection(_config.GetConnectionString("EHSConnectionString"));
            }
        }

        //Cant use Dapper if we want to use BulkInsert (Only available with Dapper Plus ..$$)
        public long StageData(DataTable dt)
        {
            RowCount = 0; 
            //using SqlBulkCopy sqlCopy = Connection; 
            using (var bulkCopy = new SqlBulkCopy(Connection.ConnectionString))
            {
                bulkCopy.DestinationTableName = "stage.AppLog";
                bulkCopy.BatchSize = 1000;
                // Set up the event handler to notify after 50 rows.
                bulkCopy.SqlRowsCopied += new SqlRowsCopiedEventHandler(OnSqlRowsCopied);
                bulkCopy.NotifyAfter = dt.Rows.Count;

                // Write from the source to the destination.
                bulkCopy.WriteToServer(dt);
            }

            return RowCount;
        }

        //move the data from stage.AppLog to app.AppLog
        public async Task<int> ProcessData()
        {
            using IDbConnection sqlCon = Connection;
            {
                var result = await sqlCon.ExecuteAsync(
                    "dbo.spProcessStagedAppLog",
                    commandType: CommandType.StoredProcedure
                    );
                return result;
            }
        }

        private static void OnSqlRowsCopied(object sender, SqlRowsCopiedEventArgs e)
        {
            RowCount += e.RowsCopied;
        }
    }
}
        