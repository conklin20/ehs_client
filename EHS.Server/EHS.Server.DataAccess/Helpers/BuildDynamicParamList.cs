using Dapper;
using EHS.Server.DataAccess.Queries;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace EHS.Server.DataAccess.Helpers
{
    /// <summary>
    /// NOT BEING USED AT THE MOMENT 
    /// </summary>
    public class BuildDynamicParamList
    {
        public BuildDynamicParamList()
        {

        }

        public DynamicParameters Build(string tsql, List<DynamicParam> queryParams)
        {
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

            return paramList;
        }
    }
}
