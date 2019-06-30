using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace EHS.Server.DataAccess.Repository
{
    public interface IHierarchyRepository
    {
        Task<DatabaseModels.Hierarchy> GetById(int id);
        Task<List<DatabaseModels.Hierarchy>> GetAll();
        Task<DatabaseModels.Hierarchy> Add(DatabaseModels.Hierarchy hierarchy);
        Task<DatabaseModels.Hierarchy> Update(int id, string userId);
        Task<DatabaseModels.Hierarchy> Delete(int id, string userId);
    }
}
