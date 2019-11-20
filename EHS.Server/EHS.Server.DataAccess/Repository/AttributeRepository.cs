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
    public class AttributeRepository : IAttributeRepository
    {
        private readonly IConfiguration _config;

        public AttributeRepository(IConfiguration config)
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

        public async Task<Attribute> GetByIdAsync(int id)
        {
            using IDbConnection sqlCon = Connection;
            //build sql query 
            string tsql = @"select a.*
	                                  ,h.*
                                from Attributes a
	                                 join HierarchyAttributes h on h.AttributeId = a.AttributeId
                                where a.AttributeId = @AttributeId";

            //build param list 
            var p = new
            {
                AttributeId = id
            };

            var attributeDictionary = new Dictionary<int, Attribute>();

            var result = await sqlCon.QueryAsync<Attribute, HierarchyAttribute, Attribute>(
                tsql,
                (attribute, hierarchyAttributes) =>
                {
                    if (!attributeDictionary.TryGetValue(attribute.AttributeId, out Attribute attributeEntry))
                    {
                        attributeEntry = attribute;
                        attributeEntry.HierarchyAttributes = new List<HierarchyAttribute>();
                        attributeDictionary.Add(attributeEntry.AttributeId, attributeEntry);
                    }

                    attributeEntry.HierarchyAttributes.Add(hierarchyAttributes);
                    return attributeEntry;
                },
                p,
                splitOn: "HierarchyAttributeId");


            return result.Distinct().AsList().FirstOrDefault();
        }

        public async Task<List<Attribute>> GetAllAsync()
        {
            using IDbConnection sqlCon = Connection;
            //build sql query 
            string tsql = @"select a.*
	                                  ,h.*
                                from Attributes a
	                                 join HierarchyAttributes h on h.AttributeId = a.AttributeId";

            var attributeDictionary = new Dictionary<int, Attribute>();

            var result = await sqlCon.QueryAsync<Attribute, HierarchyAttribute, Attribute>(
                tsql,
                (attribute, hierarchyAttributes) =>
                {
                    if (!attributeDictionary.TryGetValue(attribute.AttributeId, out Attribute attributeEntry))
                    {
                        attributeEntry = attribute;
                        attributeEntry.HierarchyAttributes = new List<HierarchyAttribute>();
                        attributeDictionary.Add(attributeEntry.AttributeId, attributeEntry);
                    }

                    attributeEntry.HierarchyAttributes.Add(hierarchyAttributes);
                    return attributeEntry;
                },
                splitOn: "HierarchyAttributeId");

            return result.Distinct().AsList();
        }

        //public async Task<Attribute> AddAsync(Attribute AttributeToAdd)
        //{
        //    using (IDbConnection sqlCon = Connection)
        //    {
        //        var result = await sqlCon.ExecuteAsync(
        //            "dbo.spAttributeAddOrUpdate",
        //            new
        //            {
        //            },
        //            commandType: CommandType.StoredProcedure
        //            );
        //        return AttributeToAdd;
        //    }
        //}

        //public async Task<Attribute> UpdateAsync(Attribute AttributeToUpdate)
        //{
        //    using (IDbConnection sqlCon = Connection)
        //    {
                
        //        var result = await sqlCon.ExecuteAsync(
        //            "dbo.spAttributeAddOrUpdate",
        //            new
        //            {
        //            },
        //            commandType: CommandType.StoredProcedure
        //            );
        //        return AttributeToUpdate;
        //    }
        //}

        //public async Task<Attribute> DeleteAsync(Attribute AttributeToDelete)
        //{
        //    using (IDbConnection sqlCon = Connection)
        //    {
                
        //        var result = await sqlCon.ExecuteAsync(
        //            "dbo.spAttributeDelete",
        //            new
        //            {
        //            },
        //            commandType: CommandType.StoredProcedure
        //            );
        //        return AttributeToDelete;
        //    }
        //}
    }
}
