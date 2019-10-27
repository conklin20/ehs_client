import { apiCall } from "../../services/api";
import { addError } from "./errors";
// import { REMOVE_ACTION, LOAD_ACTIONS } from "../actionTypes";

export const addApproval = (approval) => (dispatch, getState) => {    
	return apiCall('post', '/approvals', approval )
        .then(res => {
            //success status = 201
            return res.status
        })
        .catch(err => {
            console.log(err)
            dispatch(addError(err));
        })
}

export const fetchMyPendingApprovals = (userId) => (dispatch, getState) => {
    return apiCall('get', `/approvals?userId?${userId}`)
        .then(res => {
            return res.data
        })
        .catch(err => {
            console.log(err)
            dispatch(addError(err));
        })
}