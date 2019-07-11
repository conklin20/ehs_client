using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace EHS.Server.DataAccess.Dtos
{
    public class SharedDto
    {

        public abstract class CreatedModifiedDto
        {
            public DateTime CreatedOn { get; set; }
            public string CreatedBy { get; set; }
            public DateTime ModifiedOn { get; set; }
            public string ModifiedBy { get; set; }
        }
    }
}
