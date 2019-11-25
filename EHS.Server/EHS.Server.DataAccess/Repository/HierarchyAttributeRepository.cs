using Microsoft.Extensions.Configuration;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Threading.Tasks;
using System.Linq;
using EHS.Server.DataAccess.DatabaseModels;
using Dapper;
using EHS.Server.DataAccess.Queries;
using EHS.Server.DataAccess.Helpers; 

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
            using IDbConnection sqlCon = Connection;
            //build sql query 
            string tsql = @" declare @hierarchyId int = (select HierarchyId from HierarchyAttributes ha where ha.HierarchyAttributeId = @hierarchyAttributeId)
                            
                            select ha.* 
	                            , a.*
	                            , h.*
                            from dbo.HierarchyAttributes ha 
	                            join dbo.fnGetHierarchySinglePath(@hierarchyId) h on h.HierarchyId = ha.HierarchyId
	                            join dbo.Attributes a on a.AttributeId = ha.AttributeId 
                            where ha.HierarchyAttributeId = @hierarchyAttributeId";
            //build param list 
            var p = new
            {
                hierarchyAttributeId = id
            };


            var result = await sqlCon.QueryAsync<HierarchyAttribute, Attribute, Hierarchy, HierarchyAttribute>(
                    tsql,
                    (hierarchyAttribute, attribute, hierarchy) =>
                    {
                        hierarchyAttribute.Attribute = attribute;
                        hierarchyAttribute.Hierarchy = hierarchy;
                        return hierarchyAttribute;
                    },
                    p,
                    splitOn: "AttributeId, HierarchyId");
            return result.FirstOrDefault();
        }

        public async Task<List<HierarchyAttribute>> GetAllAsync(List<DynamicParam> queryParams)
        {
            using IDbConnection sqlCon = Connection;
            string tsql = @"select ha.* 
                                       , a.*
                                       , h.*
                                from dbo.HierarchyAttributes ha 
                                       join dbo.Hierarchies h on h.HierarchyId = ha.HierarchyId
                                       join dbo.Attributes a on a.AttributeId = ha.AttributeId ";

            //build param list 
            DynamicParameters paramList = new DynamicParameters();

            foreach (DynamicParam param in queryParams)
            {
                //add the where clause to the sql string 
                tsql += $" and {param.TableAlias}{param.FieldName} {param.Operator} {param.ParamName}";
                //then add the param to the param list 
                //a value should always either be single string, or string[], never both 
                if (param.SingleValue != null)
                {
                    paramList.Add($"{param.ParamName}", param.SingleValue); //, DbType.String, ParameterDirection.Input);
                }
                else
                {
                    paramList.Add($"{param.ParamName}", param.MultiValue.ToList());
                }
            }

            tsql += " order by ha.Value";

            var result = await sqlCon.QueryAsync<HierarchyAttribute, Attribute, Hierarchy, HierarchyAttribute>(
                    tsql,
                    (hierarchyAttribute, attribute, hierarchy) =>
                    {
                        hierarchyAttribute.Attribute = attribute;
                        hierarchyAttribute.Hierarchy = hierarchy;
                        return hierarchyAttribute;
                    },
                    paramList,
                    splitOn: "AttributeId, HierarchyId");

            return result.AsList();
        }
        

        public async Task<List<HierarchyAttribute>> GetFullTreeAsync(List<DynamicParam> queryParams, int hierarchyId)
        {
            using IDbConnection sqlCon = Connection;
            string tsql = @"select ha.* 
	                                , a.*
	                                , h.*
                            from dbo.HierarchyAttributes ha 
	                            join dbo.fnGetHierarchyFullTree(@hierarchyId) h on h.HierarchyId = ha.HierarchyId
	                            join dbo.Attributes a on a.AttributeId = ha.AttributeId  
                            where 1 = 1 ";


            //dynamic params from querystring 
            DynamicParameters paramList = new DynamicParameters();

            foreach (DynamicParam param in queryParams)
            {
                //add the where clause to the sql string 
                tsql += $" and {param.TableAlias}{param.FieldName} {param.Operator} {param.ParamName}";
                //then add the param to the param list 
                //a value should always either be single string, or string[], never both 
                if (param.SingleValue != null)
                {
                    paramList.Add($"{param.ParamName}", param.SingleValue); //, DbType.String, ParameterDirection.Input);
                }
                else
                {
                    paramList.Add($"{param.ParamName}", param.MultiValue.ToList());
                }
            }

            //add param from route (hierarchyId)
            paramList.Add("@HierarchyId", hierarchyId);

            tsql += " order by ha.Value";

            var result = await sqlCon.QueryAsync<HierarchyAttribute, Attribute, Hierarchy, HierarchyAttribute>(
                    tsql,
                    (hierarchyAttribute, attribute, hierarchy) =>
                    {
                        hierarchyAttribute.Attribute = attribute;
                        hierarchyAttribute.Hierarchy = hierarchy;
                        return hierarchyAttribute;
                    },
                    paramList,
                    splitOn: "AttributeId, HierarchyId");

            return result.AsList();
        }

        public async Task<List<HierarchyAttribute>> GetSinglePathAsync(List<DynamicParam> queryParams, int hierarchyId)
        {
            using IDbConnection sqlCon = Connection;
            string tsql = @"select ha.* 
	                                  , a.*
	                                  , h.*
                            from dbo.HierarchyAttributes ha 
	                            join dbo.fnGetHierarchySinglePath(@hierarchyId) h on h.HierarchyId = ha.HierarchyId
	                            join dbo.Attributes a on a.AttributeId = ha.AttributeId  
                            where 1 = 1 ";

            //build param list 
            DynamicParameters paramList = new DynamicParameters();

            foreach (DynamicParam param in queryParams)
            {
                //add the where clause to the sql string 
                tsql += $" and {param.TableAlias}{param.FieldName} {param.Operator} {param.ParamName}";
                //then add the param to the param list 
                //a value should always either be single string, or string[], never both 
                if (param.SingleValue != null)
                {
                    paramList.Add($"{param.ParamName}", param.SingleValue); //, DbType.String, ParameterDirection.Input);
                }
                else
                {
                    paramList.Add($"{param.ParamName}", param.MultiValue.ToList());
                }
            }

            //add param from route (hierarchyId)
            paramList.Add("@HierarchyId", hierarchyId);

            tsql += " order by ha.Value";

            var result = await sqlCon.QueryAsync<HierarchyAttribute, Attribute, Hierarchy, HierarchyAttribute>(
                    tsql,
                    (hierarchyAttribute, attribute, hierarchy) =>
                    {
                        hierarchyAttribute.Attribute = attribute;
                        hierarchyAttribute.Hierarchy = hierarchy;
                        return hierarchyAttribute;
                    },
                    paramList,
                    splitOn: "AttributeId, HierarchyId");

            return result.AsList();
        }
        
        public async Task<HierarchyAttribute> AddAsync(HierarchyAttribute HierarchyAttributeToAdd, string userId)
        {
            using IDbConnection sqlCon = Connection;
            DynamicParameters parameters = new DynamicParameters();

            parameters.Add("@HierarchyId", HierarchyAttributeToAdd.HierarchyId, dbType: DbType.Int32);
            parameters.Add("@AttributeId", HierarchyAttributeToAdd.AttributeId, dbType: DbType.Int32);
            parameters.Add("@Key", HierarchyAttributeToAdd.Key, dbType: DbType.String);
            parameters.Add("@Value", HierarchyAttributeToAdd.Value, dbType: DbType.String);
            parameters.Add("@Enabled", HierarchyAttributeToAdd.Enabled, dbType: DbType.Boolean);
            parameters.Add("@UserId", userId, dbType: DbType.String);
            parameters.Add("@NewHierarchyAttributeId", dbType: DbType.Int32, direction: ParameterDirection.Output);

            var result = sqlCon.Execute(
                "dbo.spHierarchyAttributeAddOrUpdate",
                parameters,
                commandType: CommandType.StoredProcedure
            );

            int newId = parameters.Get<int>("@NewHierarchyAttributeId");
            HierarchyAttributeToAdd.HierarchyAttributeId = newId;
            return HierarchyAttributeToAdd;
        }

        public async Task<HierarchyAttribute> UpdateAsync(HierarchyAttribute HierarchyAttributeToUpdate, string userId)
        {
            using IDbConnection sqlCon = Connection;

            DynamicParameters parameters = new DynamicParameters();

            parameters.Add("@HierarchyAttributeId", HierarchyAttributeToUpdate.HierarchyAttributeId, dbType: DbType.Int32);
            parameters.Add("@HierarchyId", HierarchyAttributeToUpdate.HierarchyId, dbType: DbType.Int32);
            parameters.Add("@AttributeId", HierarchyAttributeToUpdate.AttributeId, dbType: DbType.Int32);
            parameters.Add("@Key", HierarchyAttributeToUpdate.Key, dbType: DbType.String);
            parameters.Add("@Value", HierarchyAttributeToUpdate.Value, dbType: DbType.String);
            parameters.Add("@Enabled", HierarchyAttributeToUpdate.Enabled, dbType: DbType.Boolean);
            parameters.Add("@UserId", userId, dbType: DbType.String);
            parameters.Add("@NewHierarchyAttributeId", dbType: DbType.Int32, direction: ParameterDirection.Output);

            var result = await sqlCon.ExecuteAsync(
                "dbo.spHierarchyAttributeAddOrUpdate",
                parameters,
                commandType: CommandType.StoredProcedure
                );
            return HierarchyAttributeToUpdate;
        }

        public async Task<int> DeleteAsync(int hierarchyAttributeId, string userId)
        {
            using IDbConnection sqlCon = Connection;
            var result = await sqlCon.ExecuteAsync(
                "dbo.spHierarchyAttributeDelete",
                new
                {
                    hierarchyAttributeId,
                    userId
                },
                commandType: CommandType.StoredProcedure
                );
            return hierarchyAttributeId;
        }
    }
}
