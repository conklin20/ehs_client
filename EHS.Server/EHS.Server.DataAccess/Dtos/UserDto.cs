using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
namespace EHS.Server.DataAccess.Dtos
{
    public class UserDto
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
        public int RoleId { get; set; }
        [Required, MaxLength(50)]
        public string TimeZone { get; set; }
        [Required, MaxLength(50)]
        public string DateFormat { get; set; }
        public DateTime ModifiedOn { get; set; }
    }
}
