using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EHS.Server.WebApi.Helpers.Queries
{
    public class ActionsQuery
    {
        [FromQuery(Name = "eventId")]
        public string EventId { get; set; }
    }
}
