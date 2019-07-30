import { apiCall } from '../../services/api'; 
import { addError } from './errors'; 
import { LOAD_LOOKUP_DATA } from '../actionTypes'; 

export const loadLookupData = lookupData => ({
    type: LOAD_LOOKUP_DATA, 
    lookupData
}); 

export const fetchLookupData = (query) => {
    return dispatch => {
        return apiCall('get', '/hierarchyattributes' + (query ? query : ''))
            .then(res => {
                dispatch(loadLookupData(res)); 
            })
            .catch(err => {
                // console.log(err)
                dispatch(addError(err || 'An unknown error has occured.')); 
            });
    }
}