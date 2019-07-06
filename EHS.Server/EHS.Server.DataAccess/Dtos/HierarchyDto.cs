using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using static EHS.Server.DataAccess.Dtos.SharedDto;

namespace EHS.Server.DataAccess.Dtos
{
    public class HierarchyDto : CreatedModifiedDto
    {
        public int HierarchyId { get; set; }
        [Required, MaxLength(50)]
        public string HierarchyName { get; set; }
        [Required]
        public int Lft { get; set; }
        [Required]
        public int Rgt { get; set; }
        [Required]
        public int HierarchyLevelId { get; set; }

        public HierarchyLevelDto HierarchyLevel { get; set; }
        public ICollection<HierarchyAttributeDto> HierarchyAttributes { get; set; }
    }
}
