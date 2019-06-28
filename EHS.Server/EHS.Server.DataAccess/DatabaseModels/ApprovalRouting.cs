using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EHS.Server.DataAccess.DatabaseModels
{
    public class ApprovalRouting
    {
        public int ApprovalRoutingId { get; set; }

        [ForeignKey("FK_ApprovalRouting_Severity")]
        public int SeverityId { get; set; }

        [ForeignKey("FK_ApprovalRouting_UserRole")]
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
