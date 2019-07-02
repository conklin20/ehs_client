using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EHS.Server.DataAccess.DatabaseModels
{
    /// <summary>
    /// List of all employees, which is a feed/integration with an existing system or database 
    /// </summary>
    public class Employee
    {
        [MaxLength(50)]
        public string EmployeeId { get; set; }
        [Required, MaxLength(100)]
        public string FirstName { get; set; }
        [Required, MaxLength(100)]
        public string LastName { get; set; }
        [Display(Name = "Full Name")]
        public string FullName
        {
            get { return FirstName + " " + LastName; }
        }
        [Required, DataType(DataType.Date)]
        public DateTime BirthDate { get; set; }
        [Required, MaxLength(15)]
        public string Sex { get; set; }
        public string SupervisorId { get; set; }
        public DateTime LastUpdatedOn { get; set; }
        public bool POET { get; set; }
        public virtual Employee Supervisor { get; set; }

        public virtual ICollection<Employee> Subordinates { get; set; }        
    }
}
