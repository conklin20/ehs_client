import { apiCall,  apiCallWithFiles } from "../../services/api";
import { addNotification } from "./notifications";
import { EVENT_FILE_ADDED, EVENT_FILES_ADDED, EVENT_FILE_DELETED } from '../../helpers/notificationMessages';

  
export const saveFiles = (files, data) => (dispatch, getState) => {    
    // console.log(`saveFiles Called`, files)
	return apiCallWithFiles('post', `/eventfiles`, files, data )
    .then(res => {
        //success status = 201
        dispatch(addNotification(`${files.length > 1 ? files.length + EVENT_FILES_ADDED : EVENT_FILE_ADDED}`, 'success'));
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
            // console.log(res); 
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
            dispatch(addNotification(EVENT_FILE_DELETED.replace('{0}', eventFileId), 'success'));
            return res.status
        })
        .catch(res => {	
            console.log(res)
            dispatch(addNotification(`TODO: Customize Error Message. ${res.status}`, 'error'));
        });
    };
  };