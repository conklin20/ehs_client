import { apiCall } from "../../services/api";
import { addNotification } from "./notifications";

  
export const saveCauses = (causes, currentUserId) => (dispatch, getState) => {    
	return apiCall('post', `/causes?userId=${currentUserId}`, causes )
        .then(res => {
            //success status = 201
            return res.status
        })
        .catch(res => {	
            console.log(res)
            dispatch(addNotification(`TODO: Customize Error Message. ${res.status}`, 'error'));
        })
}

export const fetchCausesByEventId = (eventId) => (dispatch, getState) => {
    return apiCall('get', `/causes/${eventId}`)
        .then(res => {
            return res.data;
        })
        .catch(res => {	
            console.log(res)
            dispatch(addNotification(`TODO: Customize Error Message. ${res.status}`, 'error'));
        }); 
}