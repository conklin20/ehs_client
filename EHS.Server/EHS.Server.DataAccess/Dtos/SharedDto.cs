using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace EHS.Server.DataAccess.Dtos
{
    public class SharedDto
    {
        [Required]
        public DateTime CreatedOn { get; set; }
        [Required, MaxLength(50)]
        public string CreatedBy { get; set; }
        [Required]
        public DateTime ModifiedOn { get; set; }
        [Required, MaxLength(50)]
        public string ModifiedBy { get; set; }
    }
}
