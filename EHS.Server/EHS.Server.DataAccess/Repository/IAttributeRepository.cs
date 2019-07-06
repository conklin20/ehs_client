using System.Collections.Generic;
using System.Threading.Tasks;
using EHS.Server.DataAccess.DatabaseModels;

namespace EHS.Server.DataAccess.Repository
{
    public interface IAttributeRepository
    {
        Task<Attribute> GetByIdAsync(int id);
        Task<List<Attribute>> GetAllAsync();
        //Task<Attribute> AddAsync(Attribute attributeToAdd);
        //Task<Attribute> UpdateAsync(Attribute attributeToUpdate);
        //Task<Attribute> DeleteAsync(Attribute attributeToDelete);
    }
}
