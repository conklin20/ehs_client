using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EHS.Server.DataAccess.DatabaseModels
{
    public class Approval
    {
        public int ApprovalId { get; set; }
        [ForeignKey("FK_Approval_Action")]
        public int ActionId { get; set; }
        [Required]
        public int ApprovalLevelId { get; set; }  //From HierarchyAttribute
        [ForeignKey("FK_Approval_User_ApprovedBy")]
        public string ApprovedBy { get; set; }
        [Required]
        public DateTime ApprovedOn { get; set; }
        [MaxLength(255)]
        public string Notes { get; set; }
    }
}
