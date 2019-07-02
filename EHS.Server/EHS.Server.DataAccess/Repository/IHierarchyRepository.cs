﻿using System.Collections.Generic;
using System.Threading.Tasks;
using EHS.Server.DataAccess.DatabaseModels; 

namespace EHS.Server.DataAccess.Repository
{
    public interface IHierarchyRepository
    {
        Task<Hierarchy> GetByIdAsync(int id);
        Task<List<Hierarchy>> GetAllAsync();
        Task<Hierarchy> AddAsync(Hierarchy hierarchy);
        Task<Hierarchy> UpdateAsync(Hierarchy hierarchyToUpdate, string userId);
        Task<Hierarchy> DeleteAsync(Hierarchy hierarchyToDelete, string userId);
    }
}
