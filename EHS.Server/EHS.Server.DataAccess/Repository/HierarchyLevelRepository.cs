using Microsoft.Extensions.Configuration;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Threading.Tasks;
using System.Linq;
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
        
        public async Task<DatabaseModels.HierarchyLevel> GetById(int id)
        {
            using (IDbConnection sqlCon = Connection)
            {
                string sQuery = "select l.HierarchyLevelId, l.HierarchyLevelName from dbo.HierarchyLevels l where l.HierarchyLevelId = @hierarchyLevelId ";
                sqlCon.Open();
                var result = await sqlCon.QueryAsync<DatabaseModels.HierarchyLevel>(sQuery, new { hierarchyLevelId = id });
                return result.FirstOrDefault();
            }
        }

        public async Task<List<DatabaseModels.HierarchyLevel>> GetAll()
        {
            using (IDbConnection sqlCon = Connection)
            {
                string sQuery = "select l.HierarchyLevelId, l.HierarchyLevelName from dbo.HierarchyLevels l";
                sqlCon.Open();
                var result = await sqlCon.QueryAsync<DatabaseModels.HierarchyLevel>(sQuery);
                return result.AsList();
            }
        }
    }
}
