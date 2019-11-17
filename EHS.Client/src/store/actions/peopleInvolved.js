import { apiCall } from "../../services/api";
import { addNotification } from "./notifications";
import { PERSON_ADDED, PEOPLE_ADDED } from '../../helpers/notificationMessages';
  
export const savePeopleInvolved = (peopleInvolved, currentUserId) => (dispatch, getState) => {    
	return apiCall('post', `/peopleinvolved?userId=${currentUserId}`, peopleInvolved )
    .then(res => {
        //success status = 201
        dispatch(addNotification(`${peopleInvolved.length > 1 ? peopleInvolved.length + PEOPLE_ADDED : PERSON_ADDED} `, 'success'));
        return res.status
    })
    .catch(res => {	
        console.log(res)
        dispatch(addNotification(`TODO: Customize Error Message (see console). ${res.status}`, 'error'));
    })
}

export const fetchPeopleByEventId = (eventId) => (dispatch, getState) => {
    return apiCall('get', `/peopleinvolved/${eventId}`)
        .then(res => {
            return res
        })
        .catch(res => {	
            console.log(res)
            dispatch(addNotification(`TODO: Customize Error Message (see console). ${res.status}`, 'error'));
        }); 
}