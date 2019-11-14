import { apiCall } from '../../services/api'; 
import { addNotification } from './notifications'; 
import { 
    LOAD_LOGICAL_HIERARCHIES, 
    LOAD_PHYSICAL_HIERARCHIES,
    LOAD_LOGICAL_HIERARCHY_ATTRIBUTES, 
    LOAD_PHYSICAL_HIERARCHY_ATTRIBUTES, 
    LOAD_EMPLOYEES,
    LOAD_USER_ROLES, 
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

export const loadEmployees = employees => ({
    type: LOAD_EMPLOYEES,
    employees
});

export const loadUserRoles = roles => ({
    type: LOAD_USER_ROLES,
    roles
});

export const fetchLogicalHierarchyTree = (hierachyId) => {
    return dispatch => {
        return apiCall('get', '/hierarchies/fulltree/' + hierachyId)
            .then(res => {
                dispatch(loadLogicalHierarchies(res.data)); 
            })
            .catch(res => {	
                console.log(res)
                dispatch(addNotification(`TODO: Customize Error Message. ${res.status}`, 'error'));
            });
    }
}

export const fetchPhysicalHierarchyTree = (hierachyId) => {
    return dispatch => {
        return apiCall('get', '/hierarchies/fulltree/' + hierachyId)
            .then(res => {
                dispatch(loadPhysicalHierarchies(res.data)); 
            })
            .catch(res => {	
                console.log(res)
                dispatch(addNotification(`TODO: Customize Error Message. ${res.status}`, 'error'));
            });
    }
}

//Type = fulltree or singlepath 
export const fetchLogicalHierarchyAttributes = (hierarchyId, type, query) => {
    return dispatch => {
        return apiCall('get', `/hierarchyattributes/${type}/${hierarchyId}${query ? query : ''}`)
            .then(res => {
                dispatch(loadLogicalHierarchyAttributes(res.data)); 
            })
            .catch(res => {	
                console.log(res)
                dispatch(addNotification(`TODO: Customize Error Message. ${res.status}`, 'error'));
            });
    }
}

//Type = fulltree or singlepath 
export const fetchPhysicalHierarchyAttributes = (hierarchyId, type, query) => {
    return dispatch => {
        return apiCall('get', `/hierarchyattributes/${type}/${hierarchyId}${query ? query : ''}`)
            .then(res => {
                dispatch(loadPhysicalHierarchyAttributes(res.data)); 
            })
            .catch(res => {	
                console.log(res)
                dispatch(addNotification(`TODO: Customize Error Message. ${res.status}`, 'error'));
            });
    }
}

export const fetchUserRoles = () => {
    return dispatch => {
        return apiCall('get', '/userroles')
            .then(res => {
                dispatch(loadUserRoles(res.data)); 
            })
            .catch(res => {	
                console.log(res)
                dispatch(addNotification(`TODO: Customize Error Message. ${res.status}`, 'error'));
            });
    }
}

export const fetchEmployees = () => {
    return dispatch => {
        return apiCall('get', '/employees')
            .then(res => {
                dispatch(loadEmployees(res.data));
            })
            .catch(res => {	
                console.log(res)
                dispatch(addNotification(`TODO: Customize Error Message. ${res.status}`, 'error'));
            })
    }
}

export const fetchEmployee = (employeeId) => /*(dispatch, getState) =>*/ {
    return dispatch => {
        return apiCall('get', `/employees/${employeeId}`)
            .then(res => {
                return res;
            })
            .catch(res => {
                console.log(res.error.toJSON());
                console.log(res); 
                return res; 
                // switch(res.status){
                //     case 404:
                //         dispatch('Employee Not Found');
                //         return res; 
                //     default:
                //         dispatch('An unknown error has occured.');
                //         return res; 

                // }
            })
    }
}
