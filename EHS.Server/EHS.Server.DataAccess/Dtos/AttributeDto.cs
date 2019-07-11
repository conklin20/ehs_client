﻿using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace EHS.Server.DataAccess.Dtos
{
    public class AttributeDto
    {
        public int AttributeId { get; set; }
        public string AttributeName { get; set; }
        public string Pattern { get; set; } //Regex pattern the attribute value must follow
        public bool Enabled { get; set; }
        public bool ReadOnly { get; set; }

        public ICollection<HierarchyAttributeDto> HierarchyAttributes { get; set; }
    }
}
