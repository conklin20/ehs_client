using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace EHS.Server.DataAccess.Dtos
{
    public class EmployeeDto
    {
        public string EmployeeId { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string FullName
        {
            get { return FirstName + " " + LastName; }
        }
        public DateTime BirthDate { get; set; }
        public string Sex { get; set; }
        public string SupervisorId { get; set; }
        public DateTime LastUpdatedOn { get; set; }
        public bool POET { get; set; }
        public bool Active { get; set; }
        public string Email { get; set; }
        public int HierarchyId { get; set; }
        public Boolean IsSupervisor { get; set; }

        public virtual EmployeeDto Supervisor { get; set; }
        public virtual ICollection<EmployeeDto> Subordinates { get; set; }
    }
}
