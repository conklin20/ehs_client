using EHS.Server.DataAccess.DatabaseModels;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace EHS.Server.DataAccess.Repository
{
    public interface IEventFileRepository
    {
        Task<int> AddFileAsync(List<EventFile> file);
        Task<List<EventFile>> GetFilesByEventIdAsync(int eventId);
        Task<int> DeleteEventFileAsync(int eventFileId, string userId); 
    }
}
