using EHS.Server.DataAccess.DatabaseModels.CustomValidations;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using static EHS.Server.DataAccess.DatabaseModels.Shared;

namespace EHS.Server.DataAccess.DatabaseModels
{
    /// <summary>
    /// This is the main event class that will hold all safety related events (incidents and eventually observations) 
    /// </summary> CreatedModified
    public class SafetyEvent : CreatedModified
    { 
        public int EventId { get; set; }
        [Display(Name="Event Type")]
        [ConditionallyAllowNulls, MaxLength(50)]
        public string EventType { get; set; }       //From HierarchyAttribute
        [Display(Name = "Event Status")]
        [ConditionallyAllowNulls, MaxLength(50)]
        public string EventStatus { get; set; }     //From HierarchyAttribute
        [Display(Name = "Reported By")]
        public string ReportedBy { get; set; }
        [Display(Name = "Reported On")]
        [ConditionallyAllowNulls]
        public DateTime ReportedOn { get; set; }
        [Display(Name = "Event Date")]
        [ConditionallyAllowNulls, DataType(DataType.DateTime)]
        public DateTime EventDate { get; set; }
        //[Display(Name = "Event Time")]
        //[ConditionallyAllowNulls, DataType(DataType.Time)]
        //public TimeSpan EventTime { get; set; }
        [ConditionallyAllowNulls]
        public string EmployeeId { get; set; }
        //[ConditionallyAllowNulls]
        public string SupervisorId { get; set; }
        [Display(Name = "Job Title")]
        [ConditionallyAllowNulls, MaxLength(50)]
        public string JobTitle { get; set; }        //From HierarchyAttribute
        [ConditionallyAllowNulls, MaxLength(50)]
        public string Shift { get; set; }           //From HierarchyAttribute
        [Display(Name = "What Happened")]
        [ConditionallyAllowNulls]
        public string WhatHappened { get; set; }
        public bool IsInjury { get; set; }
        public bool IsIllness { get; set; }
        [Display(Name = "Hours Worked Prior")]
        [ConditionallyAllowNulls, Range(.5, 24)]
        public decimal HoursWorkedPrior { get; set; }
        [Display(Name = "Initial Catagory")]
        [Required, MaxLength(50),]
        public string InitialCategory { get; set; } //From HierarchyAttribute
        [Display(Name = "Resulting Catagory")]
        [MaxLength(50)]
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
        [Display(Name = "Work Environment")]
        [ConditionallyAllowNulls, MaxLength(50)]
        public string WorkEnvironment { get; set; } //From HierarchyAttribute
        [Display(Name = "Nature of Injury")]
        [ConditionallyAllowNulls, MaxLength(50)]        
        public string NatureOfInjury { get; set; }  //From HierarchyAttribute
        [Display(Name = "Body Part")]
        [ConditionallyAllowNulls, MaxLength(50)]
        public string BodyPart { get; set; }        //From HierarchyAttribute
        [Display(Name = "First Aid Type")]
        [ConditionallyAllowNulls, MaxLength(50)]
        public string FirstAidType { get; set; }    //From HierarchyAttribute
        [Display(Name = "Off Plant Medical Facility")]
        [ConditionallyAllowNulls, MaxLength(50)]
        public string OffPlantMedicalFacility { get; set; } //From HierarchyAttribute
        [Display(Name = "Material Involved")]
        [MaxLength(50)]
        public string MaterialInvolved { get; set; } //From HierarchyAttribute
        [Display(Name = "Equipment Involved")]
        [MaxLength(50)]
        public string EquipmentInvolved { get; set; } //From HierarchyAttribute
        public bool LostTime { get; set; }
        public bool FirstAid { get; set; }
        public bool Transported { get; set; }
        public bool ER { get; set; }
        public bool RecordedOnVideo { get; set; }
        public int? CameraId { get; set; }
        public DateTime? VideoStartRef { get; set; }
        public DateTime? VideoEndRef { get; set; }
        public int LegacyIncidentId { get; set; }

        public Employee EmployeeInvolved { get; set; }
        public Employee ReportedByEmployee { get; set; }

        public ICollection<Action> Actions { get; set; }
        public ICollection<PeopleInvolved> PeopleInvolved { get; set; }
        public ICollection<Cause> Causes { get; set; }
        public ICollection<EventFile> Files { get; set; }
    }

}
