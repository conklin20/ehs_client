import { apiCall } from "../../services/api";
import { addError } from "./errors";
// import { REMOVE_ACTION, LOAD_ACTIONS } from "../actionTypes";

export const addApproval = (approval) => (dispatch, getState) => {    
	return apiCall('post', '/approvals', approval )
    .then(res => {
        return res
    })
    .catch(err => {
        console.log(err)
        dispatch(addError(err));
    })
}

