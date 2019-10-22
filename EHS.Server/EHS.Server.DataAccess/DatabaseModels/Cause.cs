using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EHS.Server.DataAccess.DatabaseModels
{
    /// <summary>
    /// This class represents the various causes 
    /// </summary>
    public class Cause
    {
        public int EventCauseId { get; set; }
        public int EventId { get; set; }
        public int CauseId { get; set; }
        [MaxLength(2000)]
        public string Comments { get; set; }

    }
}
