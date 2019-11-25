import { apiCall } from '../../services/api'; 

export const fetchAttributes = () => {
    return apiCall('get', `/attributes`)
        .then(res => {
            return res;
        })
        .catch(res => {	
            console.log(res)
            return res;
        });
    
}

//SUCH A BAD WAY TO DO THIS... REPEATING ALOT OF CODE FROM /actions/lookupdata but I am not dispatching actions to the store in this case, 
// just returning the response/data to the caller 
//Type = fulltree or singlepath 
export const fetchGlobalHierarchyAttributes = (hierarchyId, type, query) => {
    return apiCall('get', `/hierarchyattributes/${type}/${hierarchyId}${query ? query : ''}`)
        .then(res => {
            // console.log(res); 
            return(res); 
        })
        .catch(res => {	
            console.log(res)
            return(res); 
        });    
}

//SUCH A BAD WAY TO DO THIS... REPEATING ALOT OF CODE FROM /actions/lookupdata but I am not dispatching actions to the store in this case, 
// just returning the response/data to the caller 
//Type = fulltree or singlepath 
export const fetchLogicalHierarchyAttributes = (hierarchyId, type, query) => {
    return apiCall('get', `/hierarchyattributes/${type}/${hierarchyId}${query ? query : ''}`)
        .then(res => {
            // console.log(res); 
            return(res); 
        })
        .catch(res => {	
            console.log(res)
            return(res); 
        });      
}

//SUCH A BAD WAY TO DO THIS... REPEATING ALOT OF CODE FROM /actions/lookupdata but I am not dispatching actions to the store in this case, 
// just returning the response/data to the caller 
//Type = fulltree or singlepath 
export const fetchPhysicalHierarchyAttributes = (hierarchyId, type, query) => {
    return apiCall('get', `/hierarchyattributes/${type}/${hierarchyId}${query ? query : ''}`)
        .then(res => {
            // console.log(res); 
            return(res); 
        })
        .catch(res => {	
            console.log(res)
            return(res); 
        });        
}

export const postNewHierarchyAttribute = (attributeToAdd, userId) => {
    // return dispatch => {
        
        return apiCall('post', `/hierarchyattributes?userId=${userId}`, attributeToAdd )
            .then(res => {
                //success response = 201
                return res;
            })
            .catch(res => {	
                console.log(res)
                return res;
                // dispatch(addNotification(`TODO: Customize Error Message. ${res.status}`, 'error'));
            })
    // }    
}


export const updateHierarchyAttribute = (attributeToUpdate, userId) => { 
    // return dispatch => {
        return apiCall('put', `/hierarchyattributes/${attributeToUpdate.hierarchyAttributeId}?userId=${userId}`, attributeToUpdate)
            .then(res => {
                //success response = 202
                return res;
            })
            .catch(res => {	
                console.log(res)
                return res;
                // dispatch(addNotification(`TODO: Customize Error Message. ${res.status}`, 'error'));
            })
    // }
}

export const deleteHierarchyAttribute = (hierarchyAttributeID, userId) => { 
    console.log(hierarchyAttributeID)
    // return dispatch => {
        return apiCall('delete', `/hierarchyattributes/${hierarchyAttributeID}?userId=${userId}`)
            .then(res => {
                //success response = 202
                return res;
            })
            .catch(res => {	
                console.log(res)
                return res;
                // dispatch(addNotification(`TODO: Customize Error Message. ${res.status}`, 'error'));
            })
    // }
}