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
            [Display(Name = "Created On")]
            public DateTime CreatedOn { get; set; }
            [Display(Name = "Created By")]
            [MaxLength(50)]
            public string CreatedBy { get; set; }
            [Display(Name = "Modified On")]
            public DateTime ModifiedOn { get; set; }
            [Display(Name = "Modified By")]
            [MaxLength(50)]
            public string ModifiedBy { get; set; }
        }
    }
}
