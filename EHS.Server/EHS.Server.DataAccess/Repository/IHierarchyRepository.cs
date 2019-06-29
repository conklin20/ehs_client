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
    }
}
