using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace EHS.Server.DataAccess.Dtos
{
    public class SeverityDto
    {
        public int SeverityId { get; set; }
        [Required, MaxLength(50)]
        public string SeverityName { get; set; }
        [Required, MaxLength(255)]
        public string SeverityDescription { get; set; }
        public bool Enabled { get; set; }

        public ICollection<ApprovalRoutingDto> ApprovalRoutingDtos { get; set; }
        public ICollection<ResultSeverityDto> ResultSeverityDtos { get; set; }
    }
}
