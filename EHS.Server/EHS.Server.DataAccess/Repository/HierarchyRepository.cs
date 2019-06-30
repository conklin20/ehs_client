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
                string sQuery = @"select h.HierarchyId, h.HierarchyName, h.HierarchyLevelId, h.Lft, h.Rgt, h.CreatedBy, h.CreatedOn, h.ModifiedBy, h.ModifiedOn
                                  from Hierarchies h 
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
                string sQuery = @"select h.HierarchyId, h.HierarchyName, h.HierarchyLevelId, h.Lft, h.Rgt, h.CreatedBy, h.CreatedOn, h.ModifiedBy, h.ModifiedOn 
                                  from dbo.Hierarchies h ";
                sqlCon.Open();
                var result = await sqlCon.QueryAsync<DatabaseModels.Hierarchy>(sQuery);
                return result.AsList();
            }
        }

        public async Task<DatabaseModels.Hierarchy> Add(DatabaseModels.Hierarchy newHierarchy)
        {
            using (IDbConnection sqlCon = Connection)
            {
                sqlCon.Open();
                var result = await sqlCon.ExecuteAsync(
                    "dbo.spHierarchyAddOrUpdate",
                    new
                    {
                        hierarchyName = newHierarchy.HierarchyName,
                        lft = newHierarchy.Lft,
                        rgt = newHierarchy.Rgt,
                        hierarchyLevelId = newHierarchy.HierarchyLevelId,
                        userId = newHierarchy.CreatedBy
                    },
                    commandType: CommandType.StoredProcedure
                    );
                return newHierarchy;
            }
        }

        public async Task<DatabaseModels.Hierarchy> Update(int id, string userId)
        {
            using (IDbConnection sqlCon = Connection)
            {
                //get the Hierarchy object that we want to update
                DatabaseModels.Hierarchy hierarchyToUpdate = await GetById(id);         

                sqlCon.Open();
                var result = await sqlCon.ExecuteAsync(
                    "dbo.spHierarchyAddOrUpdate",
                    new
                    {
                        hierarchyId = hierarchyToUpdate.HierarchyId,
                        hierarchyName = hierarchyToUpdate.HierarchyName,
                        lft = hierarchyToUpdate.Lft,
                        rgt = hierarchyToUpdate.Rgt,
                        hierarchyLevelId = hierarchyToUpdate.HierarchyLevelId,
                        userId = userId
                    },
                    commandType: CommandType.StoredProcedure
                    );
                return hierarchyToUpdate;
            }
        }

        public async Task<DatabaseModels.Hierarchy> Delete(int id, string userId)
        {
            using (IDbConnection sqlCon = Connection)
            {
                //get the Hierarchy object that we want to delete
                DatabaseModels.Hierarchy hierarchyToDelete = await GetById(id);

                sqlCon.Open();
                var result = await sqlCon.ExecuteAsync(
                    "dbo.spHierarchyDelete",
                    new
                    {
                        hierarchyId = hierarchyToDelete.HierarchyId,
                        lft = hierarchyToDelete.Lft,
                        rgt = hierarchyToDelete.Rgt,
                        userId = userId
                    },
                    commandType: CommandType.StoredProcedure
                    );
                return hierarchyToDelete;
            }
        }
    }
}
