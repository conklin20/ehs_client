using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EHS.Server.DataAccess.DatabaseModels

{
    public class Attribute 
    {
        public int AttributeId { get; set; }
        [MaxLength(50)]
        public string AttributeName { get; set; }
        [MaxLength(50)]
        public string Pattern { get; set; } //Regex pattern the attribute value must follow
        public bool Enabled { get; set; }
        public bool ReadOnly { get; set; }

        public ICollection<HierarchyAttribute> HierarchyAttributes { get; set; }
    }
}
