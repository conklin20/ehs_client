import { apiCall } from '../../services/api'; 
import { addError } from './errors'; 
import { LOAD_SAFETY_INCIDENTS } from '../actionTypes'; 

export const loadSafteyIncidents = safetyIncidents => ({
	type: LOAD_SAFETY_INCIDENTS, 
	safetyIncidents
});

// export const setIsLoading = isLoading => ({
// 	type: SET_IS_LOADING, 
// 	isLoading
// });

export const fetchSafteyIncidents = (query) => {
	return dispatch => {
		return apiCall('get', '/safetyincidents' + query)
			.then(res => {
				dispatch(loadSafteyIncidents(res));
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
				return res; // <- just returning to the caller insetad of disoatching an action 
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
			console.log(res)
			return res
			// dispatch(res);
		})
		.catch(err => {
			console.log(err)
			dispatch(addError(err));
		})
}

