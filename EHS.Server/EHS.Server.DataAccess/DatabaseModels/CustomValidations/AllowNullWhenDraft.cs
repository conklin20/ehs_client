using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace EHS.Server.DataAccess.DatabaseModels.CustomValidations
{
    public class AllowNullWhenDraft : ValidationAttribute
    {
        protected override ValidationResult IsValid(object value, ValidationContext validationContext)
        {
            var safetyEvent = (SafetyEvent)validationContext.ObjectInstance; 
            if(safetyEvent.EventStatus == "Draft")
            {
                return ValidationResult.Success; 
            }

            return string.IsNullOrEmpty(value.ToString()) 
                ? new ValidationResult($"{validationContext.DisplayName} is required") 
                : ValidationResult.Success; 
        }
    }
}
