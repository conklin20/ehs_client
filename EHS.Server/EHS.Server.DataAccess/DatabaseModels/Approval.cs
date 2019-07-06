using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EHS.Server.DataAccess.DatabaseModels
{
    public class Approval
    {
        public int ApprovalId { get; set; }
        public int ActionId { get; set; }
        [Required]
        public int ApprovalLevelId { get; set; }  //From HierarchyAttribute
        public string ApprovedBy { get; set; }
        [Required]
        public DateTime ApprovedOn { get; set; }
        [MaxLength(255)]
        public string Notes { get; set; }

        public Action Action { get; set; }
    }
}
