using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace EHS.Server.DataAccess.Dtos
{
    public class ApprovalRoutingDto
    {
        public int ApprovalRoutingId { get; set; }
        public int SeverityId { get; set; }
        public int UserRoleId { get; set; }
        [Required, MaxLength(50)]
        public string ApprovalLevelName { get; set; }
        [Required]
        public int ApprovalLevel { get; set; }
        public bool Enabled { get; set; }

        public SeverityDto Severity { get; set; }
        public UserRoleDto UserRole { get; set; }
    }
}
