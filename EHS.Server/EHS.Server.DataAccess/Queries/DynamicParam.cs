using System;
using System.Collections.Generic;
using System.Text;

namespace EHS.Server.DataAccess.Queries
{
    public class DynamicParam
    {
        public string TableAlias { get; set; }
        public string FieldName { get; set; }
        public string Operator { get; set; }
        public string ParamName { get; set; }
        public string SingleValue { get; set; }
        public string[] MultiValue { get; set; }
    }
}
