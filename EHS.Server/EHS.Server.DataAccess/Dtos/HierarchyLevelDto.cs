﻿using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace EHS.Server.DataAccess.Dtos
{
    public class HierarchyLevelDto
    {
        public int HierarchyLevelId { get; set; }
        public string HierarchyLevelName { get; set; }
        public int HierarchyLevelNumber { get; set; }
        public string HierarchyLevelAlias { get; set; }

        //public ICollection<HierarchyDto> Hierarchies { get; set; }
    }
}
