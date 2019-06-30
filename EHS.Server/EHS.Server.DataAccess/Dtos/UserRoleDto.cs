using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace EHS.Server.DataAccess.Dtos
{
    public class UserRoleDto
    {
        public int UserRoleId { get; set; }
        [Required, MaxLength(50)]
        public string RoleName { get; set; }
        [Required, MaxLength(255)]
        public string RoleCapabilities { get; set; }

        public ICollection<ApprovalRoutingDto> ApprovalRoutingDtos { get; set; }
    }
}
