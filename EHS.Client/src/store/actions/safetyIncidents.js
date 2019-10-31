import { apiCall } from '../../services/api'; 
import { addError } from './errors'; 
import { LOAD_SAFETY_INCIDENTS } from '../actionTypes'; //not including a REMOVE Action because the Drafts arent being stored in the redux store 

export const loadSafetyIncidents = safetyIncidents => ({
	type: LOAD_SAFETY_INCIDENTS, 
	safetyIncidents
});

// export const loadEvent = event => ({
// 	type: LOAD_EVENT, 
// 	event
// })

export const fetchSafetyIncidents = (query) => {
	console.log(query)
	return dispatch => {
		return apiCall('get', '/safetyincidents' + query)
			.then(res => {
				dispatch(loadSafetyIncidents(res.data));
			})
			.catch(err => {	
				console.log(err)
				dispatch(addError(err));
		});
	};
};

export const fetchEvent = (eventId) => {
	return dispatch => {
		return apiCall('get', `/safetyincidents/${eventId}` )
			.then(res => {
				// dispatch(loadEvent(res));
				return res.data
			})
			.catch(err => {
				console.log(err)
				dispatch(addError(err));
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
			.catch(err => {
				console.log(err)
				dispatch(addError(err));
		});
	};
};

export const postNewSafetyIncident = (safetyEventToAdd) => (dispatch, getState) => {
	// console.log(getState())
	return apiCall('post', '/safetyincidents', safetyEventToAdd )
		.then(res => {
			//success status = 201
			return res.status
			// dispatch(res);
		})
		.catch(err => {
			console.log(err)
			dispatch(addError(err));
		})
}

export const putSafetyIncident = (safetyEventToUpdate, userId) => (dispatch, getState) => {
	// console.log(getState())
	return apiCall('put', `/safetyincidents/${safetyEventToUpdate.eventId}?userId=${userId}`, safetyEventToUpdate )
		.then(res => {
			//success status = 202
			return res.status
			// dispatch(res);
		})
		.catch(err => {
			console.log(err)
			dispatch(addError(err));
		})
}

export const deleteSafetyIncident = (eventId, userId) => (dispatch, getState) => {
	// console.log(getState())
	return apiCall('delete', `/safetyincidents/${eventId}?userId=${userId}` )
		.then(res => {
			//success status = 202
			return res.status
		})
		.catch(err => {
			console.log(err)
			dispatch(addError(err));
		})
}