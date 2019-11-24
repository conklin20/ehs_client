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
        Task<List<HierarchyAttribute>> GetFullTreeAsync(List<DynamicParam> queryParams, int hierarchyId);
        Task<List<HierarchyAttribute>> GetSinglePathAsync(List<DynamicParam> queryParams, int hierarchyId);
        Task<HierarchyAttribute> AddAsync(HierarchyAttribute hierarchyAttribute, string userId);
        Task<HierarchyAttribute> UpdateAsync(HierarchyAttribute hierarchyAttributeToUpdate, string userId);
        Task<int> DeleteAsync(int hierarchyAttributeID, string userId);
    }
}
