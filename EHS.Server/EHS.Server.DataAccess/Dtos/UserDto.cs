using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using static EHS.Server.DataAccess.Dtos.SharedDto;

namespace EHS.Server.DataAccess.Dtos
{
    public class UserDto : CreatedModifiedDto
    {
        public string UserId { get; set; }
        public string Email { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public int LogicalHierarchyId { get; set; }
        public int PhysicalHierarchyId { get; set; }
        public string Phone { get; set; }
        public int RoleId { get; set; }
        public string TimeZone { get; set; }
        public string DateFormat { get; set; }


        public string FullName => $"{FirstName} {LastName}";
        public string Password { get; set; }
        public string Token { get; set; }
    }
}
