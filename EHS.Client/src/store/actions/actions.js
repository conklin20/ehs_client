import { apiCall } from "../../services/api";
import { addError } from "./errors";
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
        return res
    })
    .catch(err => {
        console.log(err)
        dispatch(addError(err));
    })
}

export const removeAction = (actionId, userId) => {
    return dispatch => {
      return apiCall('delete', `/actions/${actionId}?userId=${userId}`)
        .then(() => dispatch(remove(actionId)))
        .catch(err => {
          addError(err.message);
        });
    };
  };

export const fetchActions = (query) => {
	return dispatch => {
		return apiCall('get', `/actions${query}`)
			.then(res => {
                console.log(res)
                return res
				// dispatch(loadActions(res));
			})
			.catch(err => {
				console.log(err)
				dispatch(addError(err));
		});
	};
};

export const updateAction = (actionToUpdate) => (dispatch, getState) => {
  // console.log(actionToUpdate)
	return apiCall('put', `/actions/${actionToUpdate.actionId}`, actionToUpdate )
    .then(res => {
        // console.log(res)
        return res
    })
    .catch(err => {
        console.log(err)
        dispatch(addError(err));
    })
}