using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using static EHS.Server.DataAccess.DatabaseModels.Shared;

namespace EHS.Server.DataAccess.DatabaseModels
{
    public class Action : CreatedModified
    {
        public int ActionId { get; set; }
        [Required]
        public int EventId { get; set; }
        [Required, MaxLength(50)]
        public string EventType { get; set; }       //From HierarchyAttribute
        public string AssignedTo { get; set; }
        [Required]
        public string ActionToTake { get; set; }
        [Required, MaxLength(50)]
        public string ActionType { get; set; }       //From HierarchyAttribute
        [Required]
        public DateTime DueDate { get; set; }
        public DateTime? CompletionDate { get; set; }
        public DateTime? ApprovalDate { get; set; }

        public SafetyEvent SafetyEvent { get; set; }
        public List<Approval> Approvals { get; set; }
        public List<ApprovalRouting> ApprovalsNeeded { get; set; }
    }
}
