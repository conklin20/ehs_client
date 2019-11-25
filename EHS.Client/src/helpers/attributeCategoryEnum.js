//This should be managed in the db as opposed to here, but that will come in a future update 

export const ATTR_CATS = {
    // GLOBAL
    ACTION_TYPES: {
        key: 'Action Types',
        hierarchy: 'Global', 
        lookupDataKey: 'globalHierarchyAttributes',
        locked: false, 
        singleValue: false, 
        dbField: 'actionType'
    },
    BODY_PARTS: {
        key: 'Body Parts',
        hierarchy: 'Global', 
        lookupDataKey: 'globalHierarchyAttributes',
        locked: false, 
        singleValue: false, 
        dbField: 'bodyPart'
    },
    CONTRIBUTING_FACTORS: {
        key: 'Contributing Factors',
        hierarchy: 'Global', 
        lookupDataKey: 'globalHierarchyAttributes',
        locked: false, 
        singleValue: false, 
        dbField: null
    },
    ROOT_CAUSES: {
        key: 'Root Causes',
        hierarchy: 'Global', 
        lookupDataKey: 'globalHierarchyAttributes',
        locked: false, 
        singleValue: false, 
        dbField: null
    },
    IMMEDIATE_CAUSES: {
        key: 'Immediate Causes',
        hierarchy: 'Global', 
        lookupDataKey: 'globalHierarchyAttributes',
        locked: false, 
        singleValue: false, 
        dbField: null
    },
    EMPLOYEE_INVOLVEMENT: {
        key: 'Employee Involvement',
        hierarchy: 'Global', 
        lookupDataKey: 'globalHierarchyAttributes',
        locked: false, 
        singleValue: false, 
        dbField: null
    },
    INITIAL_CATEGORY: {
        key: 'Initial Category',
        hierarchy: 'Global',
        lookupDataKey: 'globalHierarchyAttributes',
        locked: true, 
        singleValue: false, 
        dbField: 'initialCategory'
    },
    RESULTING_CATEGORY: {
        key: 'Resulting Category',
        hierarchy: 'Global', 
        lookupDataKey: 'globalHierarchyAttributes',
        locked: true, 
        singleValue: false, 
        dbField: 'resultingCategory'
    },
    EVENT_STATUSES: {
        key: 'Statuses',
        hierarchy: 'Global', 
        lookupDataKey: 'globalHierarchyAttributes',
        locked: true, 
        singleValue: false, 
        dbField: 'eventStatus'
    },

    //LOGICAL 
    ABBR: {
        key: 'Abbr',
        hierarchy: 'Logical', 
        lookupDataKey: 'logicalHierarchyAttributes',
        locked: false, 
        singleValue: true, 
        dbField: null
    },
    FIRST_AID_TYPES: {
        key: 'First Aid Types',
        hierarchy: 'Logical', 
        lookupDataKey: 'logicalHierarchyAttributes',
        locked: false, 
        singleValue: false, 
        dbField: 'firstAidType'
    },
    // HOW_INJURED: {
    //     key: 'How Injured',
    //     hierarchy: 'Logical', 
    //     locked: false, 
    //     singleValue: false, 
    //     dbField: null
    // },
    JOB_TITLES: {
        key: 'Job Titles',
        hierarchy: 'Logical', 
        lookupDataKey: 'logicalHierarchyAttributes',
        locked: false, 
        singleValue: false, 
        dbField: 'jobTitle'
    },
    MATERIALS: {
        key: 'Materials',
        hierarchy: 'Logical', 
        lookupDataKey: 'logicalHierarchyAttributes',
        locked: false, 
        singleValue: false, 
        dbField: 'materialInvolved'
    },
    INJURY_NATURES: {
        key: 'Nature of Injury',
        hierarchy: 'Logical', 
        lookupDataKey: 'logicalHierarchyAttributes',
        locked: false, 
        singleValue: false, 
        dbField: 'natureOfInjury'
    },
    SHIFTS: {
        key: 'Shifts',
        hierarchy: 'Logical', 
        lookupDataKey: 'logicalHierarchyAttributes',
        locked: false, 
        singleValue: false, 
        dbField: 'shift'
    },
    WORK_ENVIRONMENTS: {
        key: 'Work Environment',
        hierarchy: 'Logical', 
        lookupDataKey: 'logicalHierarchyAttributes',
        locked: false, 
        singleValue: false, 
        dbField: 'workEnvironment'
    },
    // SUBSCRIBERS: {
    //     key: 'Subscribers',
    //     hierarchy: 'Logical', 
    //     locked: false, 
    //     singleValue: true, 
    //     dbField: null
    // },
    // SUBSCRIBED_EMAIL_ALIASES: {
    //     key: 'SubscribedEmailAliases',
    //     hierarchy: 'Logical', 
    //     locked: false, 
    //     singleValue: true, 
    //     dbField: null
    // },
    
    //PHYSICAL
    EQUIPMENT: {
        key: 'Equipment',
        hierarchy: 'Physical', 
        lookupDataKey: 'physicalHierarchyAttributes',
        locked: false, 
        singleValue: false, 
        dbField: 'equipmentInvolved'
    },
    MEDICAL_FACILITIES: {
        key: 'Off Plant Medical Facility',
        hierarchy: 'Physical', 
        lookupDataKey: 'physicalHierarchyAttributes',
        locked: false, 
        singleValue: false, 
        dbField: 'offPlantMedicalFacility'
    },
}

/*
Action Types	Global
Contributing Factors	Global
Employee Involvement	Global
Immediate Causes	Global
Initial Category	Global
Resulting Category	Global
Root Causes	Global
Statuses	Global
Abbr	Logical
Body Parts	Logical
First Aid Types	Logical
How Injured	Logical
Job Titles	Logical
Materials	Logical
Nature of Injury	Logical
Shifts	Logical
SubscribedEmailAliases	Logical
Subscribers	Logical
Work Environment	Logical
Equipment	Physical
Off Plant Medical Facility	Physical
*/