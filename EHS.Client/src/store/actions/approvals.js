import { apiCall } from "../../services/api";
import { addNotification } from "./notifications";
// import { REMOVE_ACTION, LOAD_ACTIONS } from "../actionTypes";

export const addApproval = (approval) => (dispatch, getState) => {    
	return apiCall('post', '/approvals', approval )
        .then(res => {
            //success status = 201
            return res.status
        })
        .catch(res => {	
            console.log(res)
            dispatch(addNotification(`TODO: Customize Error Message. ${res.status}`, 'error'));
        })
}

export const fetchMyPendingApprovals = (userId) => (dispatch, getState) => {
    // console.log(userId); 
    return apiCall('get', `/approvals?userId=${userId}`)
        .then(res => {
            return res.data
        })
        .catch(res => {	
            console.log(res)
            dispatch(addNotification(`TODO: Customize Error Message. ${res.status}`, 'error'));
        })
}