import { apiCall } from '../../services/api'; 
import { addError } from './errors'; 
import { LOAD_LOGICAL_TREE, LOAD_PHYSICAL_TREE } from '../actionTypes'; 

export const loadFullLogicalTree = logicalHierarchyData => ({
    type: LOAD_LOGICAL_TREE, 
    logicalHierarchyData
}); 

export const loadFullPhysicalTree = physicalHierarchyData => ({
    type: LOAD_PHYSICAL_TREE, 
    physicalHierarchyData
}); 

export const fetchLogicalHierarchyTree = (hierachyId, minLevel = 0) => {
    return dispatch => {
        return apiCall('get', '/hierarchies/' + hierachyId + '/' + minLevel)
            .then(res => {
                dispatch(loadFullLogicalTree(res)); 
            })
            .catch(err => {
                console.log(err)
                dispatch(addError(err || 'An unknown error has occured.')); 
            });
    }
}

export const fetchPhysicalHierarchyTree = (hierachyId, minLevel = 0) => {
    return dispatch => {
        return apiCall('get', '/hierarchies/' + hierachyId + '/' + minLevel)
            .then(res => {
                dispatch(loadFullPhysicalTree(res)); 
            })
            .catch(err => {
                console.log(err)
                dispatch(addError(err || 'An unknown error has occured.')); 
            });
    }
}