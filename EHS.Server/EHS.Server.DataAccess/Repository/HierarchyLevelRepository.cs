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
    public class HierarchyLevelRepository : IHierarchyLevelRepository
    {
        private readonly IConfiguration _config;
        
        public HierarchyLevelRepository(IConfiguration config)
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
        
        public async Task<HierarchyLevel> GetByIdAsync(int id)
        {
            using (IDbConnection sqlCon = Connection)
            {
                string sQuery = "select l.HierarchyLevelId, l.HierarchyLevelName from dbo.HierarchyLevels l where l.HierarchyLevelId = @hierarchyLevelId ";
                sqlCon.Open();
                var result = await sqlCon.QueryAsync<HierarchyLevel>(sQuery, new { hierarchyLevelId = id });
                return result.FirstOrDefault();
            }
        }

        public async Task<List<HierarchyLevel>> GetAllAsync()
        {
            using (IDbConnection sqlCon = Connection)
            {
                string sQuery = "select l.HierarchyLevelId, l.HierarchyLevelName from dbo.HierarchyLevels l";
                sqlCon.Open();
                var result = await sqlCon.QueryAsync<HierarchyLevel>(sQuery);
                return result.AsList();
            }
        }
    }
}
