using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace EHS.Server.DataAccess.Dtos
{
    public class HierarchyAttributeDto
    {
        //public HierarchyAttributeDto()
        //{
        //    HierarchyDto = new HierarchyDto();
        //    AttributeDto = new AttributeDto(); 
        //}

        public int HierarchyAttributeId { get; set; }
        public int HierarchyId { get; set; }
        public int AttributeId { get; set; }
        [Required, MaxLength(50)]
        public string Key { get; set; }
        [Required]
        public string Value { get; set; }
        public bool Enabled { get; set; }
        public HierarchyDto Hierarchy { get; set; }
        public AttributeDto Attribute { get; set; }
    }
}
