using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EHS.Server.WebApi.Helpers.Queries
{
    public class SafetyIncidentsQuery
    {
        [FromQuery(Name = "eventId")]
        public string EventId { get; set; }
        [FromQuery(Name = "eventStatuses")]
        public string Statuses { get; set; }
        [FromQuery(Name = "eventDate")]
        public DateTime EventDate { get; set; }
        [FromQuery(Name = "startDate")]
        public DateTime StartDate { get; set; }
        [FromQuery(Name = "endDate")]
        public DateTime EndDate { get; set; }
        [FromQuery(Name = "categories")]
        public string Categories { get; set; }
        [FromQuery(Name = "departmentId")]
        public string DepartmentId { get; set; } //logicalHierarchyId
        [FromQuery(Name = "site")]
        public string Site { get; set; }
        [FromQuery(Name = "area")]
        public string Area { get; set; }
        [FromQuery(Name = "department")]
        public string Department { get; set; }
    }
}
