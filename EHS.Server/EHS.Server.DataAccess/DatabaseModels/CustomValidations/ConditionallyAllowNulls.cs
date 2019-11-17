using System.ComponentModel.DataAnnotations;

namespace EHS.Server.DataAccess.DatabaseModels.CustomValidations
{
    class ConditionallyAllowNulls : ValidationAttribute
    {
        protected override ValidationResult IsValid(object value, ValidationContext validationContext)
        {
            var safetyEvent = (SafetyEvent)validationContext.ObjectInstance;
            //IF Event is a Draft, allow nulls for serveral of the otherwise required fields 
            if (safetyEvent.EventStatus == "Draft")
            {
                return ValidationResult.Success;
            }
            //IF Non-Injury, allow NatueOfInjury and BodyPart to be null 
            if (safetyEvent.IsInjury == false && (validationContext.MemberName == "NatureOfInjury" || validationContext.MemberName == "BodyPart"))
            {
                return ValidationResult.Success;
            }
            //IF Non-First Aide, allow FirstAidType to be null 
            if (safetyEvent.FirstAid == false && validationContext.MemberName == "FirstAidType")
            {
                return ValidationResult.Success;
            }
            //IF Non-Transported allow OffPlantMedicalFacility to be null 
            if (safetyEvent.Transported == false && validationContext.MemberName == "OffPlantMedicalFacility")
            {
                return ValidationResult.Success;
            }

            return string.IsNullOrEmpty((value ?? string.Empty).ToString())
                ? new ValidationResult($"{validationContext.DisplayName} is required")
                : ValidationResult.Success;
        }
    }
}
