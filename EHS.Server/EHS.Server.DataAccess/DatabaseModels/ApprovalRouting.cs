using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EHS.Server.DataAccess.DatabaseModels
{
    public class ApprovalRouting
    {
        public int ApprovalRoutingId { get; set; }
        public int SeverityId { get; set; }
        public int UserRoleId { get; set; }
        [Required, MaxLength(50)]
        public string ApprovalLevelName { get; set; }
        [Required]
        public int ApprovalLevel { get; set; }
        public bool Enabled { get; set; }

        public Severity Severity { get; set; }
        public UserRole UserRole { get; set; }
    }
}
