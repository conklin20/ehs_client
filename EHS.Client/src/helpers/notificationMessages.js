//This file is just a spot to hold all validation messages returned to the user
//custom logic to immitate what String.Format does in c#. If you need to inject something in-between the strings, use the {0} {1} ... {n} convention

//EVENT (Shared)
export const EVENT_LOGICAL_HIERARCHY_REQUIRED = ' Logical hierarchy is required to continue'
export const EVENT_PHSYICAL_HIERARCHY_REQUIRED = ' Physical hierarchy is required to continue'
export const EVENT_DRAFT_ADDED = ' Event #{0} (Draft) saved successfully!'
export const EVENT_DRAFT_FAILED = ' Failed to save event #{0} (Draft). '
export const EVENT_DRAFT_DELETED = ' Event #{0} (Draft) deleted successfully!'
export const EVENT_SUBMITTED = ' Event #{0} submitted successfully! You should receive a confirmation email shortly'
export const EVENT_SUBMISSION_FAILED = ' Event #{0} failed to submit. '
export const EVENT_ALREADY_SUBMITTED = ' Event #{0} has already been submitted. '
export const EVENT_UPDATE_SUCCESS = ' Event #{0} updated '
export const EVENT_UPDATE_FAILED = ' Failed to update event #{0}. '
export const EVENT_CATEGORY_REQUIRED = ' An event category is required to continue'
export const EVENT_INVALID = ' Invalid attempt to save event'

//ACTIONS
export const EVENT_ACTION_REQUIRED = ' At least one action is required'
export const ACTION_ADDED = ' 1 action saved successfully!'
export const ACTIONS_ADDED = ' actions saved successfully!'
export const ACTION_DELETED = 'Action #{0} successfully deleted!'
export const ACTION_COMPLETED = 'Action #{0} successfully completed!'
export const ACTION_APPROVED = 'Action #{0} successfully received {1}'


//PEOPLE
export const EVENT_PEOPLE_REQUIRED = ' People Involved incomplete'
export const PERSON_ADDED = ' 1 person involved in the event saved successfully!'
export const PEOPLE_ADDED = ' people involved in the event saved successfully'

//CAUSES
export const EVENT_CAUSES_REQUIRED = ' At least one cause is required'
export const CAUSE_ADDED = ' 1 cause saved successfully!'
export const CAUSES_ADDED = ' causes saved successfully!'

//FILES 
export const EVENT_FILE_ADDED = ' 1 files saved successfully!'
export const EVENT_FILES_ADDED = ' files saved successfully!'
export const EVENT_FILE_DELETED = ' File {0} deleted successfully!'