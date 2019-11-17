import { apiCall } from "../../services/api";
import { addNotification } from "./notifications";
import { REMOVE_ACTION, LOAD_ACTIONS } from "../actionTypes";
import { ACTION_ADDED, ACTIONS_ADDED, ACTION_DELETED, ACTION_COMPLETED } from '../../helpers/notificationMessages';

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
        dispatch(addNotification(actionsToAdd.length > 1 ? actionsToAdd.length + ACTIONS_ADDED : ACTION_ADDED, 'success'));
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
        .then(res => {
            dispatch(addNotification(ACTION_DELETED.replace('{0}', actionId), 'success'));
            dispatch(remove(actionId))
        })
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

export const fetchActionsByEventId = (eventId) => (dispatch, getState) => {
  return apiCall('get', `/actions/${eventId}`)
      .then(res => {
          return res;
      })
      .catch(res => {	
          console.log(res)
          dispatch(addNotification(`TODO: Customize Error Message (see console). ${res.status}`, 'error'));
      }); 
}

//only thing that should be calling this is when an action gets marked as "Completed" by the person its assigned to 
export const updateAction = (actionToUpdate) => (dispatch, getState) => {
  // console.log(actionToUpdate)
	return apiCall('put', `/actions/${actionToUpdate.actionId}`, actionToUpdate )
        .then(res => {
            dispatch(addNotification(ACTION_COMPLETED.replace('{0}', actionToUpdate.actionId), 'success'));
            return res.data
        })
        .catch(res => {	
            console.log(res)
            dispatch(addNotification(`TODO: Customize Error Message. ${res.status}`, 'error'));
        })
}