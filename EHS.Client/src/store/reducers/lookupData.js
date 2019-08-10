import { 
    LOAD_LOGICAL_HIERARCHIES, 
    LOAD_PHYSICAL_HIERARCHIES,
    LOAD_LOGICAL_HIERARCHY_ATTRIBUTES, 
    LOAD_PHYSICAL_HIERARCHY_ATTRIBUTES, 
    LOAD_EMPLOYEES,
} from '../actionTypes'; 

const lookupData = (state = {}, action) => {
    switch(action.type) {
        case LOAD_LOGICAL_HIERARCHIES: 
            // console.log(action)
            return {...state, logicalHierarchies: action.logicalHierarchies}
        case LOAD_PHYSICAL_HIERARCHIES: 
            // console.log(action)
            return {...state, physicalHierarchies: action.physicalHierarchies}
        case LOAD_LOGICAL_HIERARCHY_ATTRIBUTES: 
            // console.log(action)
            return {...state, logicalHierarchyAttributes: action.logicalHierarchyAttributes}
        case LOAD_PHYSICAL_HIERARCHY_ATTRIBUTES: 
            // console.log(action)
            return {...state, physicalHierarchyAttributes: action.physicalHierarchyAttributes}
        default: 
            return state;
    }
}

export default lookupData;