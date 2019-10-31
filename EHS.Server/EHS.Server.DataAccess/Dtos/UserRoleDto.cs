using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace EHS.Server.DataAccess.Dtos
{
    public class UserRoleDto
    {
        public int UserRoleId { get; set; }
        public string RoleName { get; set; }
        public string RoleCapabilities { get; set; }
        public byte RoleLevel { get; set; }

        //public ICollection<ApprovalRoutingDto> ApprovalRoutings { get; set; }
    }
}
