using System.Collections; 

namespace EHS.Server.Common.Emailer
{
    public interface zIEmailBuilder
    {
        string BuildEmail<T>(T data) where T : IEnumerable;
        string BuildEmail<T>(T data, string message) where T : IEnumerable;
    }
}
