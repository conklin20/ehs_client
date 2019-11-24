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
        public TimeSpan EventTime { get; set; }
        [ConditionallyAllowNulls]
        public string EmployeeId { get; set; }
        [ConditionallyAllowNulls]
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

        public ICollection<Action> Actions { get; set; }
        public ICollection<PeopleInvolved> PeopleInvolved { get; set; }
        public ICollection<Cause> Causes { get; set; }
        public ICollection<EventFile> Files { get; set; }
    }


    /*
        Signed Integral
            sbyte: 8 bits, range from -128 to 127
            short: 16 bits, range from -32,768 to 32,767
            int : 32 bits, range from -2,147,483,648 to 2,147,483,647
            long : 64 bits, range from -9,223,372,036,854,775,808 to 9,223,372,036,854,775,807
        Unsigned integral
            byte : 8 bits, range from 0 to 255
            ushort : 16 bits, range from 0 to 65,535
            uint : 32 bits, range from 0 to 4,294,967,295
            ulong : 64 bits, range from 0 to 18,446,744,073,709,551,615
        Floating point
            float : 32 bits, range from 1.5 × 10-45 to 3.4 × 1038, 7-digit precision
            double : 64 bits, range from 5.0 × 10-324 to 1.7 × 10308, 15-digit precision
        Decimal
            decimal : 128 bits, range is at least -7.9 × 10-28 to 7.9 × 1028, with at least 28-digit precision
     */
}
