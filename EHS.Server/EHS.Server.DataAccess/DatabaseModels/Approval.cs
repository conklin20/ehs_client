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
        public int ApprovalLevelId { get; set; }  //From HierarchyAttribute
        public string ApprovedBy { get; set; }
        public DateTime ApprovedOn { get; set; }
        [MaxLength(255)]
        public string Notes { get; set; }

        public ApprovalRouting ApprovalLevel { get; set; }
        public Action Action { get; set; }
    }
}
