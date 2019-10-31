using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using static EHS.Server.DataAccess.DatabaseModels.Shared;

namespace EHS.Server.DataAccess.DatabaseModels
{
    /// <summary>
    /// Holds the users who have created an account and have been setup with access to the system. This is seperate from the lookup list of employees. 
    /// </summary>
    public class User : CreatedModified
    {
        [Required, MaxLength(50), MinLength(5)]
        public string UserId { get; set; }
        [EmailAddress]
        public string Email { get; set; }
        [MaxLength(100)]
        public string FirstName { get; set; }
        [MaxLength(100)]
        public string LastName { get; set; }
        [Required]
        public int LogicalHierarchyId { get; set; }
        [Required]
        public int PhysicalHierarchyId { get; set; }
        [Phone]
        public string Phone { get; set; }
        public int RoleId { get; set; }
        [MaxLength(50)]
        public string TimeZone { get; set; }
        [MaxLength(50)]
        public string DateFormat { get; set; }
        public bool Enabled { get; set; }

        //Passed back to client, not saved in DB
        public int ApprovalLevel { get; set; }
        public string ApprovalLevelName { get; set; } 
        public string RoleName { get; set; } 
        public string RoleCapabilities { get; set; } 
        public byte RoleLevel { get; set; } 

        //not storing in db
        //[Required]
        public string Password { get; set; }
        public string Token { get; set; } 
    }
}
