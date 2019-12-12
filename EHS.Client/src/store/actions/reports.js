import { apiCall } from '../../services/api'; 
import { addNotification } from './notifications'; 
import { LOAD_REPORT_DATA, CLEAR_REPORT_DATA } from '../actionTypes'; //not including a REMOVE Action because the Drafts arent being stored in the redux store 
import { REPORTS_NO_DATA } from '../../helpers/notificationMessages'; 

export const loadReportData = (report, data) => ({
	type: LOAD_REPORT_DATA, 
	report, 
	data
});

export const clearReportData = (report) => ({
	type: CLEAR_REPORT_DATA, 
	report
});

export const fetchSafetyIncidents = (report, query) => {
	// console.log(report, query)
	return dispatch => {
		return apiCall('get', '/safetyincidents' + query)
			.then(res => {
				dispatch(loadReportData(report, res.data));
			})
			.catch(res => {	
				console.log(res)
				switch(res.response.status){
					case 404:
						return dispatch(addNotification(REPORTS_NO_DATA, 'error'));
					default:
						return dispatch(addNotification(`TODO: Customize Error Message. ${res.response.status} (see console)`, 'error'));
				}
		});
	};
};

export const clearData = (report) => {
	return dispatch => {
		dispatch(clearReportData(report)); 
	}
}

// export const fetchEvent = (eventId) => {
// 	return dispatch => {
// 		return apiCall('get', `/safetyincidents/${eventId}` )
// 			.then(res => {
// 				// dispatch(loadEvent(res));
// 				//sucess status = 200
// 				return res.data
// 			})
// 			.catch(res => {	
// 				console.log(res)
// 				// dispatch(addNotification(`TODO: Customize Error Message. ${res.response.status} (see console)`, 'error'));
// 		});
// 	};
// };
