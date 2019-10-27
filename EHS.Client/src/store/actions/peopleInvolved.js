import { apiCall } from "../../services/api";
import { addError } from "./errors";
  
export const savePeopleInvolved = (peopleInvolved, currentUserId) => (dispatch, getState) => {    
	return apiCall('post', `/peopleinvolved?userId=${currentUserId}`, peopleInvolved )
    .then(res => {
        //success status = 201
        return res.status
    })
    .catch(err => {
        console.log(err)
        dispatch(addError(err));
    })
}

export const fetchPeopleByEventId = (eventId) => (dispatch, getState) => {
    return apiCall('get', `/peopleinvolved/${eventId}`)
        .then(res => {
            return res.data
        })
        .catch(err => {
            console.log(err)
            dispatch(addError(err));
        }); 
}

// export const fetchActions = (query) => {
// 	return dispatch => {
// 		return apiCall('get', `/actions${query}`)
// 			.then(res => {
//                 console.log(res)
//                 return res
// 				// dispatch(loadActions(res));
// 			})
// 			.catch(err => {
// 				console.log(err)
// 				dispatch(addError(err));
// 		});
// 	};
// };