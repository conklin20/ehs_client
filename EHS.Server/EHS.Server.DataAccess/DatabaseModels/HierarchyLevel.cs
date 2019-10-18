using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EHS.Server.DataAccess.DatabaseModels
{
    /// <summary>
    /// This class is primarily used to associate a LevelName and Level to a Hierarchy. Examples: Site, Area, Department
    /// </summary>
    public class HierarchyLevel
    {
        public int HierarchyLevelId { get; set; }
        [MaxLength(50)]
        public string HierarchyLevelName { get; set; }
        public int HierarchyLevelNumber { get; set; }
        [MaxLength(50)]
        public string HierarchyLevelAlias { get; set; }

        //public ICollection<Hierarchy> Hierarchies { get; set; }
        
    }
}
