using System; 
using System.ComponentModel.DataAnnotations;

namespace EHS.Server.DataAccess.Dtos
{
    public class ActionDto : SharedDto
    {
        public int ActionId { get; set; }
        public int EventId { get; set; }
        [Required, MaxLength(50)]
        public string EventType { get; set; }
        public string AssignedTo { get; set; }
        [Required]
        public string ActionToTake { get; set; }
        [Required, MaxLength(50)]
        public string ActionType { get; set; }
        [Required, DataType(DataType.Date)]
        public DateTime DueDate { get; set; }
        [DataType(DataType.Date)]
        public DateTime CompletionDate { get; set; }
        [DataType(DataType.Date)]
        public DateTime ApprovalDate { get; set; }
    }
}
