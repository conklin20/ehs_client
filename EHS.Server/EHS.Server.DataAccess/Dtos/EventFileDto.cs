using System;
using System.Collections.Generic;
using System.Text;

namespace EHS.Server.DataAccess.Dtos
{
    public class EventFileDto
    {
        public int EventFileId { get; set; }
        public int EventId { get; set; }
        public string UserId { get; set; }
        public string ServerFileName { get; set; }
        public string UserFileName { get; set; }
        public DateTime CreatedOn { get; set; }
    }
}
