using System;
using System.Data;

namespace EHS.Server.Contracts
{
    public interface ILogSweeper
    {
        void MoveLogFiles();
        DataTable ConvertLogToTable(string dir, string fileName);
        void SaveToDb(DataTable dt);
        void DeleteFile(string fileName);
    }
}
