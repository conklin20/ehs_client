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
        
        public async Task<Hierarchy> GetById(int id)
        {
            using (IDbConnection sqlCon = Connection)
            {
                string sQuery = @"select h.HierarchyId, h.HierarchyName, h.HierarchyLevelId, h.Lft, h.Rgt, h.CreatedBy, h.CreatedOn, h.ModifiedBy, h.ModifiedOn
                                  from Hierarchies h 
                                  where h.HierarchyId = @hierarchyId ";
                sqlCon.Open();
                var result = await sqlCon.QueryAsync<Hierarchy>(sQuery, new { hierarchyId = id });
                return result.FirstOrDefault();

                //Populating sub-objects
                //var hierarchyDictionary = new Dictionary<int, Hierarchy>();

                //string sQuery = @"select h.HierarchyId, h.HierarchyName, h.HierarchyLevelId, h.Lft, h.Rgt, h.CreatedBy, h.CreatedOn, h.ModifiedBy, h.ModifiedOn
                //                     , a.HierarchyAttributeId, a.HierarchyId, a.AttributeId, a.[Key], a.Value, a.Enabled, a.CreatedBy, a.CreatedOn, a.ModifiedBy, a.ModifiedOn
                //                from Hierarchies h 
                //                     join HierarchyAttributes a on a.HierarchyId = h.HierarchyId 
                //                where h.HierarchyId = @hierarchyId ";
                //var list = Connection.Query<Hierarchy, HierarchyAttribute, Hierarchy>(
                //    sQuery,
                //    (hierarchy, hierarchyAttribute) =>
                //    {
                //        Hierarchy hierarchyEntry;

                //        if (!hierarchyDictionary.TryGetValue(hierarchy.HierarchyId, out hierarchyEntry))
                //        {
                //            hierarchyEntry = hierarchy;
                //            hierarchyEntry.HierarchyAttributes = new List<HierarchyAttribute>();
                //            hierarchyDictionary.Add(hierarchyEntry.HierarchyId, hierarchyEntry);
                //        }

                //        hierarchyEntry.HierarchyAttributes.Add(hierarchyAttribute);
                //        return hierarchyEntry;
                //    },
                //    new { hierarchyId = id },
                //    splitOn: "HierarchyAttributeId")
                //.Distinct()
                //.ToList();
                //return list.FirstOrDefault();
            }
        }

        public async Task<List<Hierarchy>> GetAll()
        {
            using (IDbConnection sqlCon = Connection)
            {
                string sQuery = @"select h.HierarchyId, h.HierarchyName, h.HierarchyLevelId, h.Lft, h.Rgt, h.CreatedBy, h.CreatedOn, h.ModifiedBy, h.ModifiedOn 
                                  from dbo.Hierarchies h ";
                sqlCon.Open();
                var result = await sqlCon.QueryAsync<Hierarchy>(sQuery);
                return result.AsList();
            }
        }

        public async Task<Hierarchy> Add(Hierarchy hierarchyToAdd)
        {
            using (IDbConnection sqlCon = Connection)
            {
                sqlCon.Open();
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

        public async Task<Hierarchy> Update(Hierarchy hierarchyToUpdate, string userId)
        {
            using (IDbConnection sqlCon = Connection)
            {     
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
                        userId
                    },
                    commandType: CommandType.StoredProcedure
                    );
                return hierarchyToUpdate;
            }
        }

        public async Task<Hierarchy> Delete(Hierarchy hierarchyToDelete, string userId)
        {
            using (IDbConnection sqlCon = Connection)
            {
                sqlCon.Open();
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
