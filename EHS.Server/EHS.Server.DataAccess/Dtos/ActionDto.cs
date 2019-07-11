using System; 
using System.ComponentModel.DataAnnotations;
using static EHS.Server.DataAccess.Dtos.SharedDto;

namespace EHS.Server.DataAccess.Dtos
{
    public class ActionDto : CreatedModifiedDto
    {
        public int ActionId { get; set; }
        public int EventId { get; set; }
        public string EventType { get; set; }
        public string AssignedTo { get; set; }
        public string ActionToTake { get; set; }
        public string ActionType { get; set; }      //enum 
        public DateTime DueDate { get; set; }
        public DateTime? CompletionDate { get; set; }
        public DateTime? ApprovalDate { get; set; }

        public SafetyEventDto SafetyEvent { get; set; }

    }
}
