using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace EHS.Server.DataAccess.Dtos
{
    public class SeverityDto
    {
        public int SeverityId { get; set; }
        public string SeverityName { get; set; }
        public string SeverityDescription { get; set; }
        public bool Enabled { get; set; }

        public ICollection<ApprovalRoutingDto> ApprovalRoutings { get; set; }
        public ICollection<ResultSeverityDto> ResultSeverities { get; set; }
    }
}
