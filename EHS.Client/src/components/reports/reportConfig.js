import { TextField, } from '@material-ui/core';
import AutoComplete from '../shared/AutoComplete'
import { KeyboardDatePicker } from '@material-ui/pickers'

export const REPORT_CATS = {
    USERS: {
        name: 'User Reports',
        url: '/reports/users', 
        enabled: false,
        description: ''
    },
    HIERARCHIES: {
        name: 'Hierarchy Reports',
        url: '/reports/hierarchies', 
        enabled: false,
        description: ''
    },
    HIERARCHY_ATTRIBUTES: {
        name: 'Hierarchy Attributes Reports',
        url: '/reports/hierarchyattributes', 
        enabled: false,
        description: ''
    },
    SAFETY_INCIDENTS: {
        name: 'Safety Incident Reports',
        url: '/reports/si', 
        enabled: true,
        description: ''
    },
}

export const SI_REPORTS = {
    EVENT_DETAIL: {
        name: 'Safety Incident Report', 
        url: '/reports/si/event',
        enabled: true,
        parameters: [
            {
                name: 'eventId', 
                alias: 'Event #',
                muiControl: TextField,
                type: 'number',
                required: true
            },
        ], 
    }, 
    SAFE_DAYS: {
        name: 'Safe Days Report', 
        url: '/reports/si/safedays',
        enabled: true,
        parameters: [
            {
                name: 'site', 
                alias: 'Site',
                muiControl: AutoComplete,
                type: 'string',
                required: true
            },
            {
                name: 'resultingCategory',
                type: 'string', 
                hidden: true,  //dont need to provide the required prop for hidden params
                defaultValue: 'Recordable',
            }
        ], 
    },
    OPEN_EVENTS_BY_HIERARCHY: {
        name: 'Open Events by Hierarchy', 
        url: '/reports/si/openbyhierarchy',
        enabled: true,
        parameters: [
            {
                name: 'startDate', 
                alias: 'Start Date',
                muiControl: KeyboardDatePicker,
                type: 'date',
                required: true
            },
            {
                name: 'endDate', 
                alias: 'End Date',
                muiControl: KeyboardDatePicker,
                type: 'date'
            },
            {
                name: 'eventStatuses',
                type: 'string', 
                hidden: true, //dont need to provide the required prop for hidden params
                defaultValue: 'Open',
            }
        ], 
    },
    INJURIES_BY_X: {
        name: 'Injuries', 
        url: '/reports/si/injuries',
        enabled: true,
        parameters: [
            {
                name: 'startDate', 
                alias: 'Start Date',
                muiControl: KeyboardDatePicker,
                type: 'date',
                required: true
            },
            {
                name: 'endDate', 
                alias: 'End Date',
                muiControl: KeyboardDatePicker,
                type: 'date'
            },
            {
                name: 'site', 
                alias: 'Site',
                muiControl: AutoComplete,
                type: 'number',
                required: true
            },
            {
                name: 'isInjury',
                type: 'boolean', 
                hidden: true, //dont need to provide the required prop for hidden params
                defaultValue: true,
            },
        ], 
    },
    RECORDABLES: {
        name: 'Recordables', 
        url: '/reports/si/recordables',
        enabled: true,
        parameters: [
            {
                name: 'startDate', 
                alias: 'Start Date',
                muiControl: KeyboardDatePicker,
                type: 'date',
                required: true
            },
            {
                name: 'endDate', 
                alias: 'End Date',
                muiControl: KeyboardDatePicker,
                type: 'date'
            },
            {
                name: 'site', 
                alias: 'Site',
                muiControl: AutoComplete,
                type: 'number',
                required: true
            },
            {
                name: 'resultingCategory',
                type: 'string', 
                hidden: true,  //dont need to provide the required prop for hidden params
                defaultValue: 'Recordable',
            }
        ], 
    },
}