using System;
using System.Collections.Generic;
using System.Text;
using System.Data;
using System.Data.SqlClient;
using System.Threading.Tasks;
using System.Linq;
using EHS.Server.DataAccess.DatabaseModels;
using Dapper;
using Microsoft.Extensions.Configuration;

namespace EHS.Server.DataAccess.Repository
{
    public class EventFileRepository : IEventFileRepository
    {
        private readonly IConfiguration _config;

        public EventFileRepository(IConfiguration config)
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

        public async Task<int> AddFileAsync(List<EventFile> files)
        {
            using (IDbConnection sqlCon = Connection)
            {
                foreach(EventFile file in files)
                {
                    var result = await sqlCon.ExecuteAsync(
                        "dbo.spEventFileAddOrUpdate",
                        new
                        {
                            file.EventId, 
                            file.UserId, 
                            file.ServerFileName, 
                            file.UserFileName, 
                        },
                        commandType: CommandType.StoredProcedure
                    );
                }
                return 1;
            }
        }

        public async Task<int> DeleteEventFileAsync(int eventFileId, string userId)
        {
            using (IDbConnection sqlCon = Connection)
            {
                var result = await sqlCon.ExecuteAsync(
                    "dbo.spEventFileDelete",
                    new
                    {
                        eventFileId, 
                        userId
                    },
                    commandType: CommandType.StoredProcedure
                );

                return 1;
            }
        }

        public async Task<List<EventFile>> GetFilesByEventIdAsync(int eventId)
        {
            using (IDbConnection sqlCon = Connection)
            {
                //build sql query 
                string tsql = @"select ef.*
                                from EventFiles ef
                                where ef.eventId = @EventId";

                //build param list 
                var p = new
                {
                    EventId = eventId
                };

                var result = await sqlCon.QueryAsync<EventFile>(tsql, p);

                return result.AsList();
            }
        }
    }
}
