using System.Collections.Generic;
using System.Threading.Tasks;
using EHS.Server.DataAccess.DatabaseModels;

namespace EHS.Server.DataAccess.Repository
{
    public interface IHierarchyAttributeRepository
    {
        Task<HierarchyAttribute> GetByIdAsync(int id);
        Task<List<HierarchyAttribute>> GetAllAsync();
        Task<HierarchyAttribute> AddAsync(HierarchyAttribute hierarchyAttribute);
        Task<HierarchyAttribute> UpdateAsync(HierarchyAttribute hierarchyAttributeToUpdate);
        Task<HierarchyAttribute> DeleteAsync(HierarchyAttribute hierarchyAttributeToDelete);
    }
}
