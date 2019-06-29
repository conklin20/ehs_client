using System;
using System.Collections.Generic;
using System.Text;

namespace EHS.Server.DataAccess.Enums
{
    public enum Status
    {
        Draft = 1,
        OpenPendingActions = 2,
        OpenPendingApprovals = 3,
        Closed = 4,
        Cancelled = 5
    }
}
