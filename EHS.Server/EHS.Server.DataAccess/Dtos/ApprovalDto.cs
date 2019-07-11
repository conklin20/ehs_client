using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace EHS.Server.DataAccess.Dtos
{
    public class ApprovalDto
    {
        public int ApprovalId { get; set; }
        public int ActionId { get; set; }
        public int ApprovalLevelId { get; set; }  
        public string ApprovedBy { get; set; }
        public DateTime ApprovedOn { get; set; }
        public string Notes { get; set; }

        public ActionDto Action { get; set; }
    }
}
