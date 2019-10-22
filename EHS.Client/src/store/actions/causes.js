import { apiCall } from "../../services/api";
import { addError } from "./errors";

  
export const saveCauses = (causes, currentUserId) => (dispatch, getState) => {    
	return apiCall('post', `/causes?userId=${currentUserId}`, causes )
        .then(res => {
            return res;
        })
        .catch(err => {
            console.log(err)
            dispatch(addError(err));
        })
}

export const fetchCausesByEventId = (eventId) => (dispatch, getState) => {
    return apiCall('get', `/causes/${eventId}`)
        .then(res => {
            return res;
        })
        .catch(err => {            
            console.log(err)
            dispatch(addError(err));
        }); 
}