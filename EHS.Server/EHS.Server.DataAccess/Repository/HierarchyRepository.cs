using Microsoft.Extensions.Configuration;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Threading.Tasks;
using System.Linq;
using EHS.Server.DataAccess.DatabaseModels; 
using Dapper;
using System;

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
            using IDbConnection sqlCon = Connection;
            string tsql = @"select h.HierarchyId, h.HierarchyName, h.HierarchyLevelId, h.Lft, h.Rgt, h.CreatedBy, h.CreatedOn, h.ModifiedBy, h.ModifiedOn
		                        ,l.HierarchyLevelId, l.HierarchyLevelName, l.HierarchyLevel as HierarchyLevelNumber, l.HierarchyLevelAlias
                            from Hierarchies h 
								join HierarchyLevels l on l.HierarchyLevelId = h.HierarchyLevelId
                            where h.HierarchyId = @hierarchyId ";

            DynamicParameters paramList = new DynamicParameters();
            //add param from route (hierarchyId)
            paramList.Add("@HierarchyId", id);

            var result = await sqlCon.QueryAsync<Hierarchy, HierarchyLevel, Hierarchy>(
                tsql,
                (hierarchy, hierarchyLevel) =>
                {
                    hierarchy.HierarchyLevel = hierarchyLevel;
                    return hierarchy;
                },
                paramList,
                splitOn: "HierarchyLevelId");
            return result.FirstOrDefault();
        }

        public async Task<List<Hierarchy>> GetFullTreeAsync(int id)
        {
            using IDbConnection sqlCon = Connection;
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

        public async Task<List<Hierarchy>> GetFullTreeWithDepthAsync(int id)
        {
            using IDbConnection sqlCon = Connection;
            string tsql = @"--Finding the depth
                                IF OBJECT_ID('tempdb..#fulltree') IS NOT NULL DROP TABLE #fulltree

                                select * 
                                into #fulltree
                                from dbo.fnGetHierarchyFullTree(@HierarchyId)

                                IF OBJECT_ID('tempdb..#fulltreedepth') IS NOT NULL DROP TABLE #fulltreedepth

                                SELECT node.HierarchyId, (COUNT(parent.HierarchyId) - 1) AS depth
                                into #fulltreedepth
                                FROM #fulltree AS node,
                                        #fulltree AS parent
                                WHERE node.Lft BETWEEN parent.Lft AND parent.Rgt 
                                GROUP BY node.HierarchyId, node.Lft
                                ORDER BY node.Lft;

                                select h.*
	                                  ,l.HierarchyLevelId, l.HierarchyLevelName, d.depth as HierarchyLevelNumber, l.HierarchyLevelAlias
                                from #fulltreedepth d
	                                 join Hierarchies h on h.HierarchyId = d.HierarchyId
	                                 join HierarchyLevels l on l.HierarchyLevelId = h.HierarchyLevelId";

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


        public async Task<List<Hierarchy>> GetLeafNodesAsync(string levelName)
        {
            using IDbConnection sqlCon = Connection;
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

        public async Task<List<Hierarchy>> GetAllAsync()
        {
            using IDbConnection sqlCon = Connection;
            string tsql = @"select h.HierarchyId, h.HierarchyName, h.HierarchyLevelId, h.Lft, h.Rgt, h.CreatedBy, h.CreatedOn, h.ModifiedBy, h.ModifiedOn 
                                  from dbo.Hierarchies h ";

            var result = await sqlCon.QueryAsync<Hierarchy>(tsql);
            return result.AsList();
        }

        public async Task<Hierarchy> AddAsync(List<Hierarchy> hierarchies, bool firstChild, string userId)
        {
            //use linq to get new and left hierarchies 
            Hierarchy newHierarchy = hierarchies.Find(h => h.Lft < 0);
            Hierarchy leftHierarchy = hierarchies.Find(h => h.Lft > 0);

            DataTable newHierarchyDt = new DataTable();
            newHierarchyDt.Columns.Add("HierarchyId", typeof(int));
            newHierarchyDt.Columns.Add("HierarchyName", typeof(string));
            newHierarchyDt.Columns.Add("Lft", typeof(int));
            newHierarchyDt.Columns.Add("Rgt", typeof(int));
            newHierarchyDt.Columns.Add("HierarchyLevelId", typeof(int));

            DataRow row;
            row = newHierarchyDt.NewRow();
            row[0] = DBNull.Value;
            row[1] = newHierarchy.HierarchyName;
            row[2] = -1;
            row[3] = -1;
            row[4] = newHierarchy.HierarchyLevelId;
            newHierarchyDt.Rows.Add(row); 


            DataTable leftHierarchyDt = new DataTable();
            leftHierarchyDt.Columns.Add("HierarchyId", typeof(int));
            leftHierarchyDt.Columns.Add("HierarchyName", typeof(string));
            leftHierarchyDt.Columns.Add("Lft", typeof(int));
            leftHierarchyDt.Columns.Add("Rgt", typeof(int));
            leftHierarchyDt.Columns.Add("HierarchyLevelId", typeof(int));

            DataRow leftRow;
            leftRow = leftHierarchyDt.NewRow();
            leftRow[0] = leftHierarchy.HierarchyId;
            leftRow[1] = leftHierarchy.HierarchyName;
            leftRow[2] = leftHierarchy.Lft;
            leftRow[3] = leftHierarchy.Rgt;
            leftRow[4] = leftHierarchy.HierarchyLevelId;
            leftHierarchyDt.Rows.Add(leftRow);


            DynamicParameters parameters = new DynamicParameters();
            parameters.Add("@Hierarchy", newHierarchyDt, dbType: DbType.Object);
            parameters.Add("@LeftHierarchy", leftHierarchyDt, dbType: DbType.Object);
            parameters.Add("@FirstChild", firstChild, dbType: DbType.Boolean);
            parameters.Add("@UserId", userId, dbType: DbType.String);
            parameters.Add("@NewHierarchyId", dbType: DbType.Int32, direction: ParameterDirection.Output);

            using IDbConnection sqlCon = Connection;
            var result = sqlCon.Execute(
                "dbo.spHierarchyAddOrUpdate",
                parameters,
                commandType: CommandType.StoredProcedure
            );

            int newId = parameters.Get<int>("@NewHierarchyId");
            newHierarchy.HierarchyId = newId;
            return newHierarchy;
        }

        public async Task<Hierarchy> UpdateAsync(Hierarchy hierarchyToUpdate, string userId)
        {
            DataTable hierarchyToUpdateDt = new DataTable();
            hierarchyToUpdateDt.Columns.Add("HierarchyId", typeof(int));
            hierarchyToUpdateDt.Columns.Add("HierarchyName", typeof(string));
            hierarchyToUpdateDt.Columns.Add("Lft", typeof(int));
            hierarchyToUpdateDt.Columns.Add("Rgt", typeof(int));
            hierarchyToUpdateDt.Columns.Add("HierarchyLevelId", typeof(int));

            DataRow row;
            row = hierarchyToUpdateDt.NewRow();
            row[0] = hierarchyToUpdate.HierarchyId;
            row[1] = hierarchyToUpdate.HierarchyName; // Name should be the only thing changing as of now
            row[2] = hierarchyToUpdate.Lft;
            row[3] = hierarchyToUpdate.Rgt;
            row[4] = hierarchyToUpdate.HierarchyLevelId;
            hierarchyToUpdateDt.Rows.Add(row);


            DataTable leftHierarchyDt = new DataTable();
            leftHierarchyDt.Columns.Add("HierarchyId", typeof(int));
            leftHierarchyDt.Columns.Add("HierarchyName", typeof(string));
            leftHierarchyDt.Columns.Add("Lft", typeof(int));
            leftHierarchyDt.Columns.Add("Rgt", typeof(int));
            leftHierarchyDt.Columns.Add("HierarchyLevelId", typeof(int));

            DataRow leftRow;
            leftRow = leftHierarchyDt.NewRow();
            leftRow[0] = DBNull.Value;
            leftRow[1] = "No Value";
            leftRow[2] = -1;
            leftRow[3] = -1;
            leftRow[4] = -1;
            leftHierarchyDt.Rows.Add(leftRow);

            DynamicParameters parameters = new DynamicParameters();
            parameters.Add("@Hierarchy", hierarchyToUpdateDt, dbType: DbType.Object);
            parameters.Add("@LeftHierarchy", leftHierarchyDt, dbType: DbType.Object);
            parameters.Add("@FirstChild", false, dbType: DbType.Boolean);
            parameters.Add("@UserId", userId, dbType: DbType.String);
            parameters.Add("@NewHierarchyId", dbType: DbType.Int32, direction: ParameterDirection.Output);

            using IDbConnection sqlCon = Connection;
            var result = await sqlCon.ExecuteAsync(
                "dbo.spHierarchyAddOrUpdate",
                parameters,
                commandType: CommandType.StoredProcedure
                );
            return hierarchyToUpdate;
        }

        public async Task<int> DeleteAsync(int hierarchyId, string userId)
        {
            using IDbConnection sqlCon = Connection;
            var result = await sqlCon.ExecuteAsync(
                "dbo.spHierarchyDelete",
                new
                {
                    hierarchyId,
                    userId
                },
                commandType: CommandType.StoredProcedure
                );
            return hierarchyId;
        }
    }
}
