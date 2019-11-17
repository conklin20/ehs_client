import { apiCall } from "../../services/api";
import { addNotification } from "./notifications";
import { CAUSE_ADDED, CAUSES_ADDED } from '../../helpers/notificationMessages';

  
export const saveCauses = (causes, currentUserId) => (dispatch, getState) => {    
	return apiCall('post', `/causes?userId=${currentUserId}`, causes )
        .then(res => {
            //success status = 201
            dispatch(addNotification(`${causes.length > 1 ? causes.length + CAUSES_ADDED : CAUSE_ADDED }`, 'success'));
            return res.status
        })
        .catch(res => {	
            console.log(res)
            dispatch(addNotification(`TODO: Customize Error Message (see console). ${res.status}`, 'error'));
        })
}

export const fetchCausesByEventId = (eventId) => (dispatch, getState) => {
    return apiCall('get', `/causes/${eventId}`)
        .then(res => {
            return res;
        })
        .catch(res => {	
            console.log(res)
            dispatch(addNotification(`TODO: Customize Error Message (see console). ${res.status}`, 'error'));
        }); 
}