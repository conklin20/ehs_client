import { apiCall } from '../../services/api'; 
import { addNotification } from './notifications'; 
import { LOAD_SAFETY_INCIDENTS } from '../actionTypes'; //not including a REMOVE Action because the Drafts arent being stored in the redux store 
import { EVENT_DRAFT_ADDED, EVENT_DRAFT_DELETED, EVENT_SUBMITTED } from '../../helpers/notificationMessages'; 

export const loadSafetyIncidents = safetyIncidents => ({
	type: LOAD_SAFETY_INCIDENTS, 
	safetyIncidents
});

export const fetchSafetyIncidents = (query) => {
	// console.log(query)
	return dispatch => {
		return apiCall('get', '/safetyincidents' + query)
			.then(res => {
				dispatch(loadSafetyIncidents(res.data));
			})
			.catch(res => {	
				console.log(res)
				dispatch(addNotification(`TODO: Customize Error Message. ${res.response.status} (see console)`, 'error'));
		});
	};
};

export const fetchEvent = (eventId) => {
	return dispatch => {
		return apiCall('get', `/safetyincidents/${eventId}` )
			.then(res => {
				// dispatch(loadEvent(res));
				//sucess status = 200
				return res.data
			})
			.catch(res => {	
				console.log(res)
				// dispatch(addNotification(`TODO: Customize Error Message. ${res.response.status} (see console)`, 'error'));
		});
	};
};

//unfortunately, we have to create a separate function for this because we dont want this saved to the redux store 
export const fetchDrafts = (query) => {
	return dispatch => {
		return apiCall('get', '/safetyincidents' + query)
			.then(res => {
				return res.data; // <- just returning to the caller insetad of dispatching an action 
			})
			.catch(res => {	
				console.log(res)
				dispatch(addNotification(`TODO: Customize Error Message. ${res.response.status} (see console)`, 'error'));
		});
	};
};

export const postNewSafetyIncident = (safetyEventToAdd) => (dispatch, getState) => {
	// console.log(getState())
	return apiCall('post', '/safetyincidents', safetyEventToAdd )
		.then(res => {
			//success status = 201
            dispatch(addNotification(EVENT_DRAFT_ADDED.replace('{0}', res.data.eventId), 'success'));
			return res
			// dispatch(res);
		})
        .catch(res => {	
            console.log(res)
			dispatch(addNotification(`TODO: Customize Error Message. ${res.response.status} (see console)`, 'error'));
			return res; 
		})
}

export const updateSafetyIncident = (safetyEventToUpdate, userId, sendMail = false) =>
	 (dispatch, getState) => {
		// console.log(getState())
		return apiCall('put', `/safetyincidents/${safetyEventToUpdate.eventId}?userId=${userId}&sendMail=${sendMail}`, safetyEventToUpdate )
			.then(res => {
				//success status = 202
				// dispatch(addNotification(`Event ${safetyEventToUpdate.eventId} successfully updated!`, 'success'));
				return res
			})
			.catch(res => {	
				//check for validation (ModelValidation) error's from API.
				//since these are coming from the API, they come with the verbiage, so we cant use the notificationMessage.js like normal
				if(res.response.data && res.response.data){
					const validationErrors = Object.keys(res.response.data.value)
												.reduce((acc, val) => {
													return acc.concat(` ${res.response.data.value[val]}`)
												},[])
					console.log(validationErrors)
					dispatch(addNotification(`Validation Error(s): ${validationErrors.join()}`, 'error'));
				}
				return res
			})
}

export const deleteSafetyIncident = (eventId, userId) => (dispatch, getState) => {
	// console.log(getState())
	return apiCall('delete', `/safetyincidents/${eventId}?userId=${userId}` )
		.then(res => {
			//success status = 202
            dispatch(addNotification(EVENT_DRAFT_DELETED.replace('{0}', eventId), 'success'));
			return res.status
		})
        .catch(res => {	
            console.log(res)
			dispatch(addNotification(`TODO: Customize Error Message. ${res.response.status} (see console)`, 'error'));
		})
}