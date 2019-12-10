using System.Collections; 

namespace EHS.Server.Common.Emailer
{
    public interface IEmailBuilder
    {
        string BuildEmail<T>(T data) where T : IEnumerable;
        string BuildEmail<T>(T data, string message) where T : IEnumerable;
    }
}
