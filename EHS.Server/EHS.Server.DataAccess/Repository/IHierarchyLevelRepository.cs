using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace EHS.Server.DataAccess.Repository
{
    public interface IHierarchyLevelRepository
    {
        Task<DatabaseModels.HierarchyLevel> GetById(int id);
        Task<List<DatabaseModels.HierarchyLevel>> GetAll(); 
    }
}
