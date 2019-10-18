using System.Collections.Generic;
using System.Threading.Tasks;
using EHS.Server.DataAccess.DatabaseModels;

namespace EHS.Server.DataAccess.Repository
{
    public interface IApprovalRepository
    {
        Task<Approval> GetByIdAsync(int id);
        Task<List<Approval>> GetAllAsync();
        Task<int> AddAsync(Approval approvalToAdd);
        Task<Approval> UpdateAsync(Approval approvalToUpdate);
        Task<Approval> DeleteAsync(Approval approvalToDelete);
    }
}
