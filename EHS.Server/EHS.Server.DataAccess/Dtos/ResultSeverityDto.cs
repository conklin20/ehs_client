using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace EHS.Server.DataAccess.Dtos
{
    public class ResultSeverityDto
    {
        public int ResultSeverityId { get; set; }
        public int HierarchyAttributeId { get; set; }
        public HierarchyAttributeDto HierarchyAttribute { get; set; }
        public int SeverityId { get; set; }
        public SeverityDto Severity { get; set; }
        public bool Enabled { get; set; }
    }
}
