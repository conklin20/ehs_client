using System;
using System.Collections.Generic;
using System.Text;

namespace EHS.Server.DataAccess.DatabaseModels
{
    public class EventHierarchySubscriber
    {
        public int HierarchyId { get; set; }
        public string Category { get; set; }
        public int Severity { get; set; }
        public int AssociatedHierarchyId { get; set; } //from getting the single path of the events HierarchyId (DepartmentId) 
        public string AssociatedHierarchyName { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public int UserHierarchyId { get; set; }
        public string UserRole { get; set; }
    }
}
