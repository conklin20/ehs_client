using System;
using System.Collections.Generic;
using System.Text;

namespace EHS.Server.DataAccess.DatabaseModels
{
    public class NagMail
    {
        public string Type { get; set; }
        public Employee Employee { get; set; }
        public ICollection<Action> Actions { get; set; }
    }                           
}
