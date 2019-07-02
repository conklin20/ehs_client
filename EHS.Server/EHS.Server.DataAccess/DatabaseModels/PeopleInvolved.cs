using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EHS.Server.DataAccess.DatabaseModels
{
    /// <summary>
    /// This class represents the pepople that were involved in an event, such as the investigation team or a witness
    /// </summary>
    public class PeopleInvolved
    {
        public int PeopleInvolvedId { get; set; }
        public int RoleId { get; set; }
        public int EventId { get; set; }
        public string EmployeeId { get; set; }
        [MaxLength(2000)]
        public string Comments { get; set; }

        
    }
}
