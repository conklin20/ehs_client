import { apiCall,  apiCallWithFiles } from "../../services/api";
import { addNotification } from "./notifications";

  
export const saveFiles = (files, data) => (dispatch, getState) => {    
    // console.log(`saveFiles Called`, files)
	return apiCallWithFiles('post', `/eventfiles`, files, data )
    .then(res => {
        //success status = 201
        return res.status
    })
    .catch(res => {	
        console.log(res)
        dispatch(addNotification(`TODO: Customize Error Message. ${res.status}`, 'error'));
    })
}

export const fetchFilesByEventId = (eventId) => (dispatch, getState) => {
    return apiCall('get', `/eventfiles/${eventId}`)
        .then(res => {
            return res.data
        })
        .catch(res => {	
            console.log(res)
            dispatch(addNotification(`TODO: Customize Error Message. ${res.status}`, 'error'));
        }); 
}

export const removeFile = (eventFileId, userId) => {
    return dispatch => {
      return apiCall('delete', `/eventfiles/${eventFileId}?userId=${userId}`)
        .then(res => {
            //success status = 202
            return res.status
        })
        .catch(res => {	
            console.log(res)
            dispatch(addNotification(`TODO: Customize Error Message. ${res.status}`, 'error'));
        });
    };
  };