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
        public int EventId { get; set; }
        [Required, MaxLength(50)]
        public string EventType { get; set; }       //From HierarchyAttribute
        public string AssignedTo { get; set; }
        [Required]
        public string ActionToTake { get; set; }
        [Required, MaxLength(50)]
        public string ActionType { get; set; }       //From HierarchyAttribute
        [Required, DataType(DataType.Date)]
        public DateTime DueDate { get; set; }
        [DataType(DataType.Date)]
        public DateTime? CompletionDate { get; set; }
        [DataType(DataType.Date)]
        public DateTime? ApprovalDate { get; set; }

        public SafetyEvent SafetyEvent { get; set; }
    }
}
