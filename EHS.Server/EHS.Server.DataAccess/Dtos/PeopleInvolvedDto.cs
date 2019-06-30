using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace EHS.Server.DataAccess.Dtos
{
    public class PeopleInvolvedDto
    {
        public int PeopleInvolvedId { get; set; }
        public int RoleId { get; set; }
        public int EventId { get; set; }
        public string EmployeeId { get; set; }
        [MaxLength(2000)]
        public string Comments { get; set; }
    }
}
