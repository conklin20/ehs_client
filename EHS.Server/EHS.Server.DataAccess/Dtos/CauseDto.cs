using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace EHS.Server.DataAccess.Dtos
{
    public class CauseDto
    {
        public int EventCauseId { get; set; }
        public int EventId { get; set; }
        public int CauseId { get; set; }
        [MaxLength(2000)]
        public string Comments { get; set; }
    }
}
