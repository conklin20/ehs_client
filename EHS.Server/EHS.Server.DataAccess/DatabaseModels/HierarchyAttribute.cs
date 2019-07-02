using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using static EHS.Server.DataAccess.DatabaseModels.Shared;

namespace EHS.Server.DataAccess.DatabaseModels
{
    public class HierarchyAttribute : CreatedModified
    {
        public int HierarchyAttributeId { get; set; }
        public int HierarchyId { get; set; }
        public int AttributeId { get; set; }
        [Required, MaxLength(50)]
        public string Key { get; set; }
        [Required]
        public string Value { get; set; }
        public bool Enabled { get; set; }
        public Hierarchy Hierarchy { get; set; }
        public Attribute Attribute { get; set; }

        public ICollection<ResultSeverity> ResultSeverities { get; set; }
    }
}
