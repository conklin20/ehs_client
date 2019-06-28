using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using static EHS.Server.DataAccess.DatabaseModels.Shared;

namespace EHS.Server.DataAccess.DatabaseModels
{
    /// <summary>
    /// This class defines a lot of the organizational structure of the system. It uses 2 primary lanes of hierarchies, Locale (Physical aspects of an organization) and 
    /// Reporting (How the organization is structured from a reporting standpoint)
    /// </summary>
    public class Hierarchy : CreatedModified
    {
        public int HierarchyId { get; set; }
        [Required, MaxLength(50)]
        public string HierarchyName { get; set; }
        [Required]
        public int Lft { get; set; }
        [Required]
        public int Rgt { get; set; }
        [Required]
        [ForeignKey("FK_Hierarchy_HierarchyLevel")]
        public int HierarchyLevelId { get; set; }
        public HierarchyLevel HierarchyLevel { get; set; }

        public ICollection<HierarchyAttribute> HierarchyAttributes { get; set; }
        
    }
}
