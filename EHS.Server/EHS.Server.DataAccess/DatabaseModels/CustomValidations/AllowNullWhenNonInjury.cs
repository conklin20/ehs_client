using System;
using System.ComponentModel.DataAnnotations;

namespace EHS.Server.DataAccess.DatabaseModels.CustomValidations
{
    [Obsolete("This custom validation is obsolete, use ConditionallyAllowNulls instead")]
    class AllowNullWhenNonInjury : ValidationAttribute
    {
        protected override ValidationResult IsValid(object value, ValidationContext validationContext)
        {
            var safetyEvent = (SafetyEvent)validationContext.ObjectInstance;
            if (safetyEvent.IsInjury == false)
            {
                return ValidationResult.Success;
            }

            return string.IsNullOrEmpty((value ?? string.Empty).ToString())
                ? new ValidationResult($"{validationContext.DisplayName} is required")
                : ValidationResult.Success;
        }
    }
}
