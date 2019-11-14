import { apiCall } from "../../services/api";
import { addNotification } from "./notifications";
import { REMOVE_ACTION, LOAD_ACTIONS } from "../actionTypes";

export const remove = actionId => ({
    type: REMOVE_ACTION,
    actionId
  });

export const loadActions = eventId => ({
    type: LOAD_ACTIONS,
    eventId
  });

  
export const addAction = (actionsToAdd) => (dispatch, getState) => {    
	return apiCall('post', '/actions', actionsToAdd )
    .then(res => {
        //success status = 201
        return res.status
    })
    .catch(res => {	
        console.log(res)
        dispatch(addNotification(`TODO: Customize Error Message. ${res.status}`, 'error'));
    })
}

export const removeAction = (actionId, userId) => {
    return dispatch => {
      return apiCall('delete', `/actions/${actionId}?userId=${userId}`)
        .then(() => dispatch(remove(actionId)))
        .catch(res => {	
            console.log(res)
            dispatch(addNotification(`TODO: Customize Error Message. ${res.status}`, 'error'));
        });
    };
  };

export const fetchActions = (query) => {
	return dispatch => {
		return apiCall('get', `/actions${query}`)
			.then(res => {
                // console.log(res)
                return res.data
				// dispatch(loadActions(res));
			})
      .catch(res => {	
          console.log(res)
          dispatch(addNotification(`TODO: Customize Error Message. ${res.status}`, 'error'));
		});
	};
};

// WHERE I LEFT OFF 
// export const fetchActionsByEventId = (eventId) => (dispatch, getState) => {
//   return apiCall('get', `/actions/${eventId}`)
//       .then(res => {
//           return res;
//       })
//       .catch(err => {            
//           console.log(err)
//       }); 
// }

export const updateAction = (actionToUpdate) => (dispatch, getState) => {
  // console.log(actionToUpdate)
	return apiCall('put', `/actions/${actionToUpdate.actionId}`, actionToUpdate )
    .then(res => {
        // console.log(res)
        return res.data
    })
    .catch(res => {	
        console.log(res)
        dispatch(addNotification(`TODO: Customize Error Message. ${res.status}`, 'error'));
    })
}