using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using static EHS.Server.DataAccess.Dtos.SharedDto;

namespace EHS.Server.DataAccess.Dtos
{
    public class SafetyEventDto : CreatedModifiedDto
    {
        public int EventId { get; set; }
        public string EventType { get; set; }       //From HierarchyAttribute
        public string EventStatus { get; set; }     //From HierarchyAttribute
        public string ReportedBy { get; set; }
        public DateTime ReportedOn { get; set; }
        public DateTime EventDate { get; set; }
        public TimeSpan EventTime { get; set; }
        public string EmployeeId { get; set; }
        public string JobTitle { get; set; }        //From HierarchyAttribute
        public string Shift { get; set; }           //From HierarchyAttribute
        public string WhatHappened { get; set; }
        public bool IsInjury { get; set; }
        public bool IsIllness { get; set; }
        public byte HoursWorkedPrior { get; set; }
        public string InitialCategory { get; set; } //From HierarchyAttribute
        public string ResultingCategory { get; set; }  //From HierarchyAttribute (To be available for Health/Safety to upgrade/downgrade an event later) 
        public int DepartmentId { get; set; }
        public string Division { get; set; }        //From HierarchyAttribute (Department Hierarchy)
        public string Site { get; set; }            //From HierarchyAttribute (Department Hierarchy)
        public string Area { get; set; }            //From HierarchyAttribute (Department Hierarchy)
        public string Department { get; set; }      //From HierarchyAttribute (Department Hierarchy)
        public int LocaleId { get; set; }
        public string LocaleRegion { get; set; }    //From HierarchyAttribute (Locale/Building Hierarchy)
        public string LocaleSite { get; set; }      //From HierarchyAttribute (Locale/Building Hierarchy)
        public string LocalePlant { get; set; }     //From HierarchyAttribute (Locale/Building Hierarchy)
        public string LocalePlantArea { get; set; } //From HierarchyAttribute (Locale/Building Hierarchy)
        public string WorkEnvironment { get; set; } //From HierarchyAttribute
        public string NatureOfInjury { get; set; }  //From HierarchyAttribute
        public string BodyPart { get; set; }        //From HierarchyAttribute
        public string FirstAidType { get; set; }    //From HierarchyAttribute
        public string OffPlantMedicalFacility { get; set; } //From HierarchyAttribute
        public string MaterialInvolved { get; set; } //From HierarchyAttribute
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

        public ICollection<ActionDto> Actions { get; set; }
        public ICollection<PeopleInvolvedDto> PeopleInvolved { get; set; }
    }
}
