using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EHS.Server.DataAccess.DatabaseModels
{
    /// <summary>
    /// Associative table to relate incident results (First Aid, TRR etc) with severities (Sev1, Sev2 etc) 
    /// </summary>
    public class ResultSeverity
    {
        public int ResultSeverityId { get; set; }
        [Required]
        public int HierarchyAttributeId { get; set; }
        public HierarchyAttribute HierarchyAttribute { get; set; }        
        [Required]
        public int SeverityId { get; set; }
        public Severity Severity { get; set; }
        public bool Enabled { get; set; }
    }
}
