using System.Data;
using System.Threading.Tasks;

namespace EHS.Server.DataAccess.Repository
{
    public interface IFileSweeperRepository
    {
        long StageData(DataTable dt);
        Task<int> ProcessData();
    }
}
