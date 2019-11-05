import { apiCall } from '../../services/api'; 

export const fetchHierarchyTreeWithDepth = (type, hierachyId) => {
    // return dispatch => {
        return apiCall('get', `/hierarchies/fulltreedepth/${hierachyId}`)
            .then(res => {
                return { type: type, res: res}
            })
            .catch(err => {
                console.log(err)
                // dispatch(addError(err || 'An unknown error has occured.')); 
            });
    
}

export const fetchHierarchyLevels = () => {
    // return dispatch => {
        return apiCall('get', `/hierarchylevels`)
            .then(res => {
                return res;
            })
            .catch(err => {
                console.log(err)
                // dispatch(addError(err || 'An unknown error has occured.')); 
            });
    
}

export const postNewHierarchy = (hierarchies, firstChild = false, userId) => {
    // return dispatch => {
        return apiCall('post', `/hierarchies?userId=${userId}&firstChild=${firstChild}`, hierarchies )
            .then(res => {
                //success response = 201
                return res;
            })
            .catch(err => {
                return err; 
            })
    // }    
}


export const updateHierarchy = (hierarchy, userId) => { 
    // return dispatch => {
        return apiCall('put', `/hierarchies/${hierarchy.hierarchyId}?userId=${userId}`, hierarchy)
            .then(res => {
                //success response = 202
                return res;
            })
            .catch(err => {
                return err; 
            })
    // }
}

export const deleteHierarchy = (hierarchyId, userId) => { 
    // return dispatch => {
        return apiCall('delete', `/hierarchies/${hierarchyId}?userId=${userId}`)
            .then(res => {
                //success response = 202
                return res;
            })
            .catch(err => {
                return err; 
            })
    // }
}