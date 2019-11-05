using System.Collections.Generic;
using System.Threading.Tasks;
using EHS.Server.DataAccess.DatabaseModels; 

namespace EHS.Server.DataAccess.Repository
{
    public interface IHierarchyRepository
    {
        Task<Hierarchy> GetByIdAsync(int id);
        Task<List<Hierarchy>> GetAllAsync();
        Task<List<Hierarchy>> GetFullTreeAsync(int id);
        Task<List<Hierarchy>> GetLeafNodesAsync(string levelName);
        Task<List<Hierarchy>> GetFullTreeWithDepthAsync(int id);
        Task<Hierarchy> AddAsync(List<Hierarchy> hierarchies, bool firstChild, string userId);
        Task<Hierarchy> UpdateAsync(Hierarchy hierarchyToUpdate, string userId);
        Task<int> DeleteAsync(int hierarchyId, string userId);
    }
}
