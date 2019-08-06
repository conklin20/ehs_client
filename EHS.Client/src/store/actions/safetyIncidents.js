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
		// dispatch(setIsLoading(true));
		return apiCall('get', '/safetyincidents' + query)
			.then(res => {
				dispatch(loadSafteyIncidents(res));
				// dispatch(setIsLoading(false));
			})
			.catch(err => {
				dispatch(addError(err));
				// dispatch(setIsLoading(false));
		});
	};
};