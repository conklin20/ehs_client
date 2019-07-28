import { apiCall } from '../../services/api'; 
import { addError } from './errors'; 
import { LOAD_SAFETY_INCIDENTS } from '../actionTypes'; 

export const loadSafteyIncidents = safetyIncidents => ({
	type: LOAD_SAFETY_INCIDENTS, 
	safetyIncidents
});

export const fetchSafteyIncidents = (query) => {
	return dispatch => {
		return apiCall('get', '/safetyincidents' + query)
			.then(res => {
				dispatch(loadSafteyIncidents(res));
			})
			.catch(err => {
				dispatch(addError(err));
		});
	};
};