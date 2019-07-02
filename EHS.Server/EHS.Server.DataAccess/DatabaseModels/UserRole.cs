using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EHS.Server.DataAccess.DatabaseModels
{
    /// <summary>
    /// Defines our security roles 
    /// </summary>
    public class UserRole
    {        
        public int UserRoleId { get; set; }
        [Required, MaxLength(50)]
        public string RoleName { get; set; }
        [Required, MaxLength(255)]
        public string RoleCapabilities { get; set; }

        public ICollection<ApprovalRouting> ApprovalRoutings { get; set; }
    }
}
