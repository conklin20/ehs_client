using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EHS.Server.WebApi.Helpers.Queries
{
    public class HierarchyAttributesQuery
    {
        [FromQuery(Name = "enabled")]
        public string Enabled { get; set; }

        [FromQuery(Name = "excludeglobal")]
        public string ExcludeGlobal { get; set; }
    }
}
