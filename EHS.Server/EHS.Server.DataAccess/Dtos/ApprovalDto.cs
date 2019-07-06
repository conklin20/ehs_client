using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace EHS.Server.DataAccess.Dtos
{
    public class ApprovalDto
    {
        public int ApprovalId { get; set; }
        public int ActionId { get; set; }
        [Required]
        public int ApprovalLevelId { get; set; }  
        public string ApprovedBy { get; set; }
        [Required]
        public DateTime ApprovedOn { get; set; }
        [MaxLength(255)]
        public string Notes { get; set; }

        public ActionDto Action { get; set; }
    }
}
