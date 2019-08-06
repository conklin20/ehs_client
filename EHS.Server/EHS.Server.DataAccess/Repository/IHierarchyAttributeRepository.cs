using System.Collections.Generic;
using System.Threading.Tasks;
using EHS.Server.DataAccess.DatabaseModels;
using EHS.Server.DataAccess.Queries;

namespace EHS.Server.DataAccess.Repository
{
    public interface IHierarchyAttributeRepository
    {
        Task<HierarchyAttribute> GetByIdAsync(int id);
        Task<List<HierarchyAttribute>> GetAllAsync(List<DynamicParam> queryParams);
        Task<HierarchyAttribute> AddAsync(HierarchyAttribute hierarchyAttribute);
        Task<HierarchyAttribute> UpdateAsync(HierarchyAttribute hierarchyAttributeToUpdate);
        Task<HierarchyAttribute> DeleteAsync(HierarchyAttribute hierarchyAttributeToDelete);
    }
}
