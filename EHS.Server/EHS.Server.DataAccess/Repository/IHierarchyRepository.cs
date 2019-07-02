using System.Collections.Generic;
using System.Threading.Tasks;
using EHS.Server.DataAccess.DatabaseModels; 

namespace EHS.Server.DataAccess.Repository
{
    public interface IHierarchyRepository
    {
        Task<Hierarchy> GetById(int id);
        Task<List<Hierarchy>> GetAll();
        Task<Hierarchy> Add(Hierarchy hierarchy);
        Task<Hierarchy> Update(Hierarchy hierarchyToUpdate, string userId);
        Task<Hierarchy> Delete(Hierarchy hierarchyToDelete, string userId);
    }
}
