using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace EHS.Server.DataAccess.Dtos
{
    public class HierarchyLevelDto
    {
        public int HierarchyLevelId { get; set; }
        [MaxLength(50)]
        public string HierarchyLevelName { get; set; }

        public ICollection<HierarchyDto> HierarchyDtos { get; set; }
    }
}
