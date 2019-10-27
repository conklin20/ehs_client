import { apiCall } from "../../services/api";
import { addError } from "./errors";

  
export const saveCauses = (causes, currentUserId) => (dispatch, getState) => {    
	return apiCall('post', `/causes?userId=${currentUserId}`, causes )
        .then(res => {
            //success status = 201
            return res.status
        })
        .catch(err => {
            console.log(err)
            dispatch(addError(err));
        })
}

export const fetchCausesByEventId = (eventId) => (dispatch, getState) => {
    return apiCall('get', `/causes/${eventId}`)
        .then(res => {
            return res.data;
        })
        .catch(err => {            
            console.log(err)
            dispatch(addError(err));
        }); 
}