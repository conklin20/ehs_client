using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using static EHS.Server.DataAccess.Dtos.SharedDto;

namespace EHS.Server.DataAccess.Dtos
{
    public class HierarchyDto : CreatedModifiedDto
    {
        public int HierarchyId { get; set; }
        public string HierarchyName { get; set; }
        public int Lft { get; set; }
        public int Rgt { get; set; }
        public int HierarchyLevelId { get; set; }

        public HierarchyLevelDto HierarchyLevel { get; set; }
        public ICollection<HierarchyAttributeDto> HierarchyAttributes { get; set; }
    }
}
