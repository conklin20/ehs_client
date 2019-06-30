using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace EHS.Server.DataAccess.Dtos
{
    public class ResultSeverityDto
    {
        public int ResultSeverityId { get; set; }
        [Required]
        public int HierarchyAttributeId { get; set; }
        public HierarchyAttributeDto HierarchyAttributeDto { get; set; }
        [Required]
        public int SeverityId { get; set; }
        public SeverityDto SeverityDto { get; set; }
        public bool Enabled { get; set; }
    }
}
