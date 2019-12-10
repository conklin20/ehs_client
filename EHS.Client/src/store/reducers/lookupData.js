import { 
    LOAD_LOGICAL_HIERARCHIES, 
    LOAD_PHYSICAL_HIERARCHIES,
    LOAD_GLOBAL_HIERARCHY_ATTRIBUTES, 
    LOAD_LOGICAL_HIERARCHY_ATTRIBUTES, 
    LOAD_PHYSICAL_HIERARCHY_ATTRIBUTES, 
    LOAD_EMPLOYEES,
    LOAD_USER_ROLES, 
} from '../actionTypes'; 

const lookupData = (state = {}, action) => {
    switch(action.type) {
        case LOAD_LOGICAL_HIERARCHIES: 
            // console.log(action)
            return {...state, logicalHierarchies: action.logicalHierarchies}

        case LOAD_PHYSICAL_HIERARCHIES: 
            // console.log(action)
            return {...state, physicalHierarchies: action.physicalHierarchies}
            
        case LOAD_GLOBAL_HIERARCHY_ATTRIBUTES: 
            // console.log(action)
            return {...state, globalHierarchyAttributes: action.globalHierarchyAttributes}

        case LOAD_LOGICAL_HIERARCHY_ATTRIBUTES: 
            // console.log(action)
            return {...state, logicalHierarchyAttributes: action.logicalHierarchyAttributes}

        case LOAD_PHYSICAL_HIERARCHY_ATTRIBUTES: 
            // console.log(action)
            return {...state, physicalHierarchyAttributes: action.physicalHierarchyAttributes}

        case LOAD_EMPLOYEES: 
            // console.log(action)
            return {...state, employees: action.employees}

        case LOAD_USER_ROLES: 
            // console.log(action)
            return {...state, userRoles: action.roles}

        default: 
            return state;
    }
}

export default lookupData;