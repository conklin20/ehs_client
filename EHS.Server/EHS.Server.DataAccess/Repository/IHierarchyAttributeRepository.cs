using System.Collections.Generic;
using System.Threading.Tasks;
using EHS.Server.DataAccess.DatabaseModels;

namespace EHS.Server.DataAccess.Repository
{
    public interface IHierarchyAttributeRepository
    {
        Task<HierarchyAttribute> GetByIdAsync(int id);
        Task<List<HierarchyAttribute>> GetAllAsync();
        Task<HierarchyAttribute> AddAsync(HierarchyAttribute HierarchyAttribute);
        Task<HierarchyAttribute> UpdateAsync(HierarchyAttribute HierarchyAttributeToUpdate);
        Task<HierarchyAttribute> DeleteAsync(HierarchyAttribute HierarchyAttributeToDelete);
    }
}
