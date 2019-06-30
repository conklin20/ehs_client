using System.Collections.Generic;
using System.Threading.Tasks;
using EHS.Server.DataAccess.DatabaseModels; 

namespace EHS.Server.DataAccess.Repository
{
    public interface IHierarchyRepository
    {
        Task<DatabaseModels.Hierarchy> GetById(int id);
        Task<List<DatabaseModels.Hierarchy>> GetAll();
        Task<DatabaseModels.Hierarchy> Add(Hierarchy hierarchy);
        Task<DatabaseModels.Hierarchy> Update(Hierarchy hierarchyToUpdate, string userId);
        Task<DatabaseModels.Hierarchy> Delete(Hierarchy hierarchyToDelete, string userId);
    }
}
