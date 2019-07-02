using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EHS.Server.DataAccess.DatabaseModels
{
    public class Severity
    {
        public int SeverityId { get; set; }
        [Required, MaxLength(50)]
        public string SeverityName { get; set; }
        [Required, MaxLength(255)]
        public string SeverityDescription { get; set; }
        public bool Enabled { get; set; }

        public ICollection<ApprovalRouting> ApprovalRoutings { get; set; }
        public ICollection<ResultSeverity> ResultSeverities { get; set; }

    }
}
