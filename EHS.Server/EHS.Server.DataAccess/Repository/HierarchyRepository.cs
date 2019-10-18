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
        
        public async Task<Hierarchy> GetByIdAsync(int id)
        {
            using (IDbConnection sqlCon = Connection)
            {
                string tsql = @"select h.HierarchyId, h.HierarchyName, h.HierarchyLevelId, h.Lft, h.Rgt, h.CreatedBy, h.CreatedOn, h.ModifiedBy, h.ModifiedOn
                                  from Hierarchies h 
                                  where h.HierarchyId = @hierarchyId ";
                
                var result = await sqlCon.QueryAsync<Hierarchy>(tsql, new { hierarchyId = id });
                return result.FirstOrDefault();
            }
        }

        public async Task<List<Hierarchy>> GetFullTreeAsync(int id)
        {
            using (IDbConnection sqlCon = Connection)
            {
                string tsql = @"select h.*
	                                  ,l.HierarchyLevelId, l.HierarchyLevelName, l.HierarchyLevel as HierarchyLevelNumber, l.HierarchyLevelAlias
                                from dbo.fnGetHierarchyFullTree(@HierarchyId) h
	                                 join HierarchyLevels l on h.HierarchyLevelId = l.HierarchyLevelId
                                order by HierarchyName";

                DynamicParameters paramList = new DynamicParameters(); 
                //add param from route (hierarchyId)
                paramList.Add("@HierarchyId", id);

                //var result = await sqlCon.QueryAsync<Hierarchy>(tsql, p);
                var result = await sqlCon.QueryAsync<Hierarchy, HierarchyLevel, Hierarchy>(
                    tsql,
                    (hierarchy, hierarchyLevel) =>
                    {
                        hierarchy.HierarchyLevel = hierarchyLevel;
                        return hierarchy;
                    }, 
                    paramList,
                    splitOn: "HierarchyLevelId");
                return result.AsList();
            }
        }

        public async Task<List<Hierarchy>> GetLeafNodesAsync(string levelName)
        {
            using (IDbConnection sqlCon = Connection)
            {
                string tsql = @"select *
                                from dbo.fnGetHierarchyLeafNodes(@LevelName) h
                                order by HierarchyName";

                //build param list 
                var p = new
                {
                    LevelName = levelName
                };

                var result = await sqlCon.QueryAsync<Hierarchy>(tsql, p);
                return result.AsList();
            }
        }

        public async Task<List<Hierarchy>> GetAllAsync()
        {
            using (IDbConnection sqlCon = Connection)
            {
                string tsql = @"select h.HierarchyId, h.HierarchyName, h.HierarchyLevelId, h.Lft, h.Rgt, h.CreatedBy, h.CreatedOn, h.ModifiedBy, h.ModifiedOn 
                                  from dbo.Hierarchies h ";
                
                var result = await sqlCon.QueryAsync<Hierarchy>(tsql);
                return result.AsList();
            }
        }

        public async Task<Hierarchy> AddAsync(Hierarchy hierarchyToAdd)
        {
            using (IDbConnection sqlCon = Connection)
            {
                
                var result = await sqlCon.ExecuteAsync(
                    "dbo.spHierarchyAddOrUpdate",
                    new
                    {
                        hierarchyName = hierarchyToAdd.HierarchyName,
                        lft = hierarchyToAdd.Lft,
                        rgt = hierarchyToAdd.Rgt,
                        hierarchyLevelId = hierarchyToAdd.HierarchyLevelId,
                        userId = hierarchyToAdd.CreatedBy
                    },
                    commandType: CommandType.StoredProcedure
                    );
                return hierarchyToAdd;
            }
        }

        public async Task<Hierarchy> UpdateAsync(Hierarchy hierarchyToUpdate, string userId)
        {
            using (IDbConnection sqlCon = Connection)
            {     
                
                var result = await sqlCon.ExecuteAsync(
                    "dbo.spHierarchyAddOrUpdate",
                    new
                    {
                        hierarchyId = hierarchyToUpdate.HierarchyId,
                        hierarchyName = hierarchyToUpdate.HierarchyName,
                        lft = hierarchyToUpdate.Lft,
                        rgt = hierarchyToUpdate.Rgt,
                        hierarchyLevelId = hierarchyToUpdate.HierarchyLevelId,
                        userId
                    },
                    commandType: CommandType.StoredProcedure
                    );
                return hierarchyToUpdate;
            }
        }

        public async Task<Hierarchy> DeleteAsync(Hierarchy hierarchyToDelete, string userId)
        {
            using (IDbConnection sqlCon = Connection)
            {
                
                var result = await sqlCon.ExecuteAsync(
                    "dbo.spHierarchyDelete",
                    new
                    {
                        hierarchyId = hierarchyToDelete.HierarchyId,
                        lft = hierarchyToDelete.Lft,
                        rgt = hierarchyToDelete.Rgt,
                        userId
                    },
                    commandType: CommandType.StoredProcedure
                    );
                return hierarchyToDelete;
            }
        }
    }
}
