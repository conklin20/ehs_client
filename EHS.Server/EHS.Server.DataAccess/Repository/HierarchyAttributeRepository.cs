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
                string sQuery = @"select ha.HierarchyAttributeId, ha.HierarchyId, ha.AttributeId, ha.[Key], ha.Value, ha.Enabled, ha.CreatedOn, ha.CreatedBy, ha.ModifiedOn, ha.ModifiedBy
                                  from dbo.HierarchyAttributes ha
                                  where ha.HierarchyAttributeId = @hierarchyAttributeId";
                sqlCon.Open();
                var result = await sqlCon.QueryAsync<HierarchyAttribute>(sQuery, new { HierarchyAttributeId = id });
                return result.FirstOrDefault();
            }
        }

        public async Task<List<HierarchyAttribute>> GetAllAsync()
        {
            using (IDbConnection sqlCon = Connection)
            {
                string sQuery = @"select ha.HierarchyAttributeId, ha.HierarchyId, ha.AttributeId, ha.[Key], ha.Value, ha.Enabled, ha.CreatedOn, ha.CreatedBy, ha.ModifiedOn, ha.ModifiedBy 
                                  from dbo.HierarchyAttributes ha ";
                //sqlCon.Open();
                var result = await sqlCon.QueryAsync<HierarchyAttribute>(sQuery);
                return result.AsList();


                //string sQuery = @"select ha.HierarchyAttributeId, ha.HierarchyId, ha.AttributeId, ha.[Key], ha.Value, ha.Enabled, ha.CreatedOn, ha.CreatedBy, ha.ModifiedOn, ha.ModifiedBy 
                //                      , a.AttributeId, a.AttributeName, a.Enabled, a.Pattern, a.ReadOnly
                //                  from dbo.HierarchyAttributes ha join Attributes a on a.AttributeId = ha.AttributeId";
                //var hierarchyAttributes = Connection.Query<HierarchyAttribute, Attribute, HierarchyAttribute>(
                //        sQuery,
                //        (hierarchyAttribute, attribute) =>
                //        {
                //            hierarchyAttribute.Attribute = attribute;
                //            return hierarchyAttribute;
                //        },
                //        splitOn: "AttributeId")
                //    .Distinct()
                //    .ToList();

                //return hierarchyAttributes.AsList();
            }
        }

        public async Task<HierarchyAttribute> AddAsync(HierarchyAttribute HierarchyAttributeToAdd)
        {
            using (IDbConnection sqlCon = Connection)
            {
                sqlCon.Open();
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
                sqlCon.Open();
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
                sqlCon.Open();
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
