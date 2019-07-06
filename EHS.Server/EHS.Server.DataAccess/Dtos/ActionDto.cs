using System; 
using System.ComponentModel.DataAnnotations;
using static EHS.Server.DataAccess.Dtos.SharedDto;

namespace EHS.Server.DataAccess.Dtos
{
    public class ActionDto : CreatedModifiedDto
    {
        public int ActionId { get; set; }
        public int EventId { get; set; }
        [Required, MaxLength(50)]
        public string EventType { get; set; }
        public string AssignedTo { get; set; }
        [Required]
        public string ActionToTake { get; set; }
        [Required, MaxLength(50)]
        public string ActionType { get; set; }      //enum 
        [Required, DataType(DataType.Date)]
        public DateTime DueDate { get; set; }
        [DataType(DataType.Date)]
        public DateTime? CompletionDate { get; set; }
        [DataType(DataType.Date)]
        public DateTime? ApprovalDate { get; set; }

        public SafetyEventDto SafetyEvent { get; set; }

    }
}
