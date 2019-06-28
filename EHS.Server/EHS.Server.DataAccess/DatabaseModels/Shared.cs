using System;
using System.ComponentModel.DataAnnotations;

namespace EHS.Server.DataAccess.DatabaseModels
{
    public class Shared
    {
        /// <summary>
        /// This class can be inherited by any class that needs the CreatedOn, CreatedBy, ModifiedOn and Modified properties.
        /// </summary>
        public abstract class CreatedModified
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
}
