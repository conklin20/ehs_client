using Microsoft.Extensions.Configuration;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Threading.Tasks;
using System.Linq;
using Dapper;

namespace EHS.Server.DataAccess.Repository
{
    public class HierarchyRepository : IHierarchyRepository
    {
        private readonly IConfiguration _config;
        
        public HierarchyRepository(IConfiguration config)
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
        
        public async Task<DatabaseModels.Hierarchy> GetById(int id)
        {
            using (IDbConnection sqlCon = Connection)
            {
                string sQuery = @"select h.HierarchyId, h.HierarchyName, h.HierarchyLevelId, h.Lft, h.Rgt, hl.HierarchyLevelName, ha.Value, h.CreatedBy, h.CreatedOn, h.ModifiedBy, h.ModifiedOn
                                  from HierarchyLevels hl
                                     join Hierarchies h on h.HierarchyLevelId = hl.HierarchyLevelId
                                     join HierarchyAttributes ha on ha.HierarchyId = h.HierarchyId
                                     join Attributes a on a.AttributeId = ha.AttributeId  
                                where h.HierarchyId = @hierarchyId ";
                sqlCon.Open();
                var result = await sqlCon.QueryAsync<DatabaseModels.Hierarchy>(sQuery, new { hierarchyId = id });
                return result.FirstOrDefault();
            }
        }

        public async Task<List<DatabaseModels.Hierarchy>> GetAll()
        {
            using (IDbConnection sqlCon = Connection)
            {
                string sQuery = "select h.HierarchyId, h.HierarchyName, h.HierarchyLevelId, h.Lft, h.Rgt, h.CreatedBy, h.CreatedOn, h.ModifiedBy, h.ModifiedOn from dbo.Hierarchies h ";
                sqlCon.Open();
                var result = await sqlCon.QueryAsync<DatabaseModels.Hierarchy>(sQuery);
                return result.AsList();
            }
        }
    }
}
