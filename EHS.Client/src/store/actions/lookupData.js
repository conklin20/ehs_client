import { apiCall } from '../../services/api'; 
import { addError } from './errors'; 
import { 
    LOAD_LOGICAL_HIERARCHIES, 
    LOAD_PHYSICAL_HIERARCHIES,
    LOAD_LOGICAL_HIERARCHY_ATTRIBUTES, 
    LOAD_PHYSICAL_HIERARCHY_ATTRIBUTES, 
    LOAD_EMPLOYEES,
} from '../actionTypes'; 

export const loadLogicalHierarchies = logicalHierarchies => ({
    type: LOAD_LOGICAL_HIERARCHIES, 
    logicalHierarchies
}); 

export const loadPhysicalHierarchies = physicalHierarchies => ({
    type: LOAD_PHYSICAL_HIERARCHIES, 
    physicalHierarchies
}); 

export const loadLogicalHierarchyAttributes = logicalHierarchyAttributes => ({
    type: LOAD_LOGICAL_HIERARCHY_ATTRIBUTES, 
    logicalHierarchyAttributes
}); 

export const loadPhysicalHierarchyAttributes = physicalHierarchyAttributes => ({
    type: LOAD_PHYSICAL_HIERARCHY_ATTRIBUTES, 
    physicalHierarchyAttributes
}); 

export const fetchLogicalHierarchyTree = (hierachyId) => {
    return dispatch => {
        return apiCall('get', '/hierarchies/fulltree/' + hierachyId)
            .then(res => {
                dispatch(loadLogicalHierarchies(res)); 
            })
            .catch(err => {
                console.log(err)
                dispatch(addError(err || 'An unknown error has occured.')); 
            });
    }
}

export const fetchPhysicalHierarchyTree = (hierachyId) => {
    return dispatch => {
        return apiCall('get', '/hierarchies/fulltree/' + hierachyId)
            .then(res => {
                dispatch(loadPhysicalHierarchies(res)); 
            })
            .catch(err => {
                console.log(err)
                dispatch(addError(err || 'An unknown error has occured.')); 
            });
    }
}

//Type = fulltree or singlepath 
export const fetchLogicalHierarchyAttributes = (hierarchyId, type, query) => {
    return dispatch => {
        return apiCall('get', `/hierarchyattributes/${type}/${hierarchyId}${query ? query : ''}`)
            .then(res => {
                dispatch(loadLogicalHierarchyAttributes(res)); 
            })
            .catch(err => {
                // console.log(err)
                dispatch(addError(err || 'An unknown error has occured.')); 
            });
    }
}

//Type = fulltree or singlepath 
export const fetchPhysicalHierarchyAttributes = (hierarchyId, type, query) => {
    return dispatch => {
        return apiCall('get', `/hierarchyattributes/${type}/${hierarchyId}${query ? query : ''}`)
            .then(res => {
                dispatch(loadPhysicalHierarchyAttributes(res)); 
            })
            .catch(err => {
                // console.log(err)
                dispatch(addError(err || 'An unknown error has occured.')); 
            });
    }
}
