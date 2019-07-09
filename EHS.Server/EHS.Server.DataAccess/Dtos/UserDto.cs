using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using static EHS.Server.DataAccess.Dtos.SharedDto;

namespace EHS.Server.DataAccess.Dtos
{
    public class UserDto : CreatedModifiedDto
    {
        [Required, MaxLength(50), MinLength(5)]
        public string UserId { get; set; }
        [EmailAddress]
        public string Email { get; set; }
        [MaxLength(100)]
        public string FullName { get; set; }
        [Phone]
        public string Phone { get; set; }
        public int RoleId { get; set; }
        [MaxLength(50)]
        public string TimeZone { get; set; }
        [MaxLength(50)]
        public string DateFormat { get; set; }

        [Required]
        public string Password { get; set; }
        public string Token { get; set; }
    }
}
