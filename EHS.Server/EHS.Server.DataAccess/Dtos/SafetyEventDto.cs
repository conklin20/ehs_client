using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace EHS.Server.DataAccess.Dtos
{
    public class SafetyEventDto
    {
        [Key]
        public int EventId { get; set; }
        [Required, MaxLength(50)]
        public string EventType { get; set; }       //From HierarchyAttribute
        [Required, MaxLength(50)]
        public string EventStatus { get; set; }     //From HierarchyAttribute
        public string ReportedBy { get; set; }
        [Required]
        public DateTime ReportedOn { get; set; }
        [Required, DataType(DataType.Date)]
        public DateTime EventDate { get; set; }
        [Required, DataType(DataType.Time)]
        public TimeSpan EventTime { get; set; }
        public string EmployeeId { get; set; }
        [Required, MaxLength(50)]
        public string JobTitle { get; set; }        //From HierarchyAttribute
        [Required, MaxLength(50)]
        public string Shift { get; set; }           //From HierarchyAttribute
        [Required]
        public string WhatHappened { get; set; }
        public bool IsInjury { get; set; }
        public bool IsIllness { get; set; }
        [Required, Range(.5, 24)]
        public byte HoursWorkedPrior { get; set; }
        [Required, MaxLength(50),]
        public string InitialCategory { get; set; } //From HierarchyAttribute
        [Required, MaxLength(50)]
        public string ResultingCategory { get; set; }  //From HierarchyAttribute (To be available for Health/Safety to upgrade/downgrade an event later) 
        public int DepartmentId { get; set; }
        [MaxLength(50)]
        public string Division { get; set; }        //From HierarchyAttribute (Department Hierarchy)
        [MaxLength(50)]
        public string Site { get; set; }            //From HierarchyAttribute (Department Hierarchy)
        [MaxLength(50)]
        public string Area { get; set; }            //From HierarchyAttribute (Department Hierarchy)
        [MaxLength(50)]
        public string Department { get; set; }      //From HierarchyAttribute (Department Hierarchy)
        public int LocaleId { get; set; }
        [MaxLength(50)]
        public string LocaleRegion { get; set; }    //From HierarchyAttribute (Locale/Building Hierarchy)
        [MaxLength(50)]
        public string LocaleSite { get; set; }      //From HierarchyAttribute (Locale/Building Hierarchy)
        [MaxLength(50)]
        public string LocalePlant { get; set; }     //From HierarchyAttribute (Locale/Building Hierarchy)
        [MaxLength(50)]
        public string LocalePlantArea { get; set; } //From HierarchyAttribute (Locale/Building Hierarchy)
        [Required, MaxLength(50)]
        public string WorkEnvironment { get; set; } //From HierarchyAttribute
        [Required, MaxLength(50)]
        public string NatureOfEnjury { get; set; }  //From HierarchyAttribute
        [Required, MaxLength(50)]
        public string BodyPart { get; set; }        //From HierarchyAttribute
        [MaxLength(50)]
        public string FirstAidType { get; set; }    //From HierarchyAttribute
        [MaxLength(50)]
        public string OffPlantMedicalFacility { get; set; } //From HierarchyAttribute
        [MaxLength(50)]
        public string MaterialInvolved { get; set; } //From HierarchyAttribute
        [MaxLength(50)]
        public string EquipmentInvolved { get; set; } //From HierarchyAttribute
        public bool LostTime { get; set; }
        public bool FirstAid { get; set; }
        public bool Transported { get; set; }
        public bool ER { get; set; }
        public bool PassedPOET { get; set; }
        public bool RecordedOnVideo { get; set; }
        public int? CameraId { get; set; }
        public DateTime? VideoStartRef { get; set; }
        public DateTime? VideoEndRef { get; set; }
    }
}
