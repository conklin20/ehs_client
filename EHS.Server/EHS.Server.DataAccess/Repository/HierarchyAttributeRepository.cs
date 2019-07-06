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
    public class HierarchyAttributeRepository : IHierarchyAttributeRepository
    {
        private readonly IConfiguration _config;

        public HierarchyAttributeRepository(IConfiguration config)
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

        public async Task<HierarchyAttribute> GetByIdAsync(int id)
        {
            using (IDbConnection sqlCon = Connection)
            {
                //build sql query 
                string sql = @"select ha.HierarchyAttributeId, ha.HierarchyId, ha.AttributeId, ha.[Key], ha.Value, ha.Enabled, ha.CreatedOn, ha.CreatedBy, ha.ModifiedOn, ha.ModifiedBy
                                  from dbo.HierarchyAttributes ha
                                  where ha.HierarchyAttributeId = @hierarchyAttributeId";
                //build param list 
                var p = new
                {
                    hierarchyAttributeId = id
                };

                
                var result = await sqlCon.QueryAsync<HierarchyAttribute>(sql, p);
                return result.FirstOrDefault();
            }
        }

        public async Task<List<HierarchyAttribute>> GetAllAsync()
        {
            using (IDbConnection sqlCon = Connection)
            {
                string tsql = @"select ha.* 
                                       , a.*
                                       , h.*
                                  from dbo.HierarchyAttributes ha 
                                       join dbo.Hierarchies h on h.HierarchyId = ha.HierarchyId
                                       join dbo.Attributes a on a.AttributeId = ha.AttributeId";

                var result = await sqlCon.QueryAsync<HierarchyAttribute, Attribute, Hierarchy, HierarchyAttribute>(
                        tsql,
                        (hierarchyAttribute, attribute, hierarchy) =>
                        {
                            hierarchyAttribute.Attribute = attribute;
                            hierarchyAttribute.Hierarchy = hierarchy;
                            return hierarchyAttribute;
                        },
                        splitOn: "AttributeId, HierarchyId");

                return result.AsList();
            }
        }

        public async Task<HierarchyAttribute> AddAsync(HierarchyAttribute HierarchyAttributeToAdd)
        {
            using (IDbConnection sqlCon = Connection)
            {
                
                var result = await sqlCon.ExecuteAsync(
                    "dbo.spHierarchyAttributeAddOrUpdate",
                    new
                    {
                        HierarchyAttributeToAdd.HierarchyAttributeId,
                        HierarchyAttributeToAdd.HierarchyId,
                        HierarchyAttributeToAdd.AttributeId,
                        HierarchyAttributeToAdd.Key,
                        HierarchyAttributeToAdd.Value, 
                        HierarchyAttributeToAdd.Enabled,
                        userId = HierarchyAttributeToAdd.CreatedBy
                    },
                    commandType: CommandType.StoredProcedure
                    );
                return HierarchyAttributeToAdd;
            }
        }

        public async Task<HierarchyAttribute> UpdateAsync(HierarchyAttribute HierarchyAttributeToUpdate)
        {
            using (IDbConnection sqlCon = Connection)
            {
                
                var result = await sqlCon.ExecuteAsync(
                    "dbo.spHierarchyAttributeAddOrUpdate",
                    new
                    {
                        HierarchyAttributeToUpdate.HierarchyId,
                        HierarchyAttributeToUpdate.AttributeId,
                        HierarchyAttributeToUpdate.Key,
                        HierarchyAttributeToUpdate.Value,
                        HierarchyAttributeToUpdate.Enabled,
                        userId = HierarchyAttributeToUpdate.ModifiedBy
                    },
                    commandType: CommandType.StoredProcedure
                    );
                return HierarchyAttributeToUpdate;
            }
        }

        public async Task<HierarchyAttribute> DeleteAsync(HierarchyAttribute HierarchyAttributeToDelete)
        {
            using (IDbConnection sqlCon = Connection)
            {
                
                var result = await sqlCon.ExecuteAsync(
                    "dbo.spHierarchyAttributeDelete",
                    new
                    {
                        HierarchyAttributeToDelete.HierarchyAttributeId,
                        HierarchyAttributeToDelete.ModifiedBy
                    },
                    commandType: CommandType.StoredProcedure
                    );
                return HierarchyAttributeToDelete;
            }
        }
    }
}
