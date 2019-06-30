using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace EHS.Server.DataAccess.Dtos
{
    public class HierarchyDto : SharedDto
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
        public HierarchyLevelDto HierarchyLevelDto { get; set; }

        public ICollection<HierarchyAttributeDto> HierarchyAttributeDtos { get; set; }
    }
}
