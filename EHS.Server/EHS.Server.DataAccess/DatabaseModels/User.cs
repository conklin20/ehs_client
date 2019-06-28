using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EHS.Server.DataAccess.DatabaseModels
{
    /// <summary>
    /// Holds the users who have created an account and have been setup with access to the system. This is seperate from the lookup list of employees. 
    /// </summary>
    public class User
    {
        [MaxLength(50), MinLength(5)]
        public string UserId { get; set; }
        [Required, EmailAddress]
        public string Email { get; set; }
        [Required]
        public string Password { get; set; }
        [Required, MaxLength(100)]
        public string FullName { get; set; }
        [Phone]
        public string Phone { get; set; }
        [ForeignKey("FK_User_SystemRole")]
        public int RoleId { get; set; }
        [Required, MaxLength(50)]
        public string TimeZone { get; set; }
        [Required, MaxLength(50)]
        public string DateFormat { get; set; }
        public DateTime ModifiedOn { get; set; }
        
    }
}
