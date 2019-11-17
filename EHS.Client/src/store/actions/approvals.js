import { apiCall } from "../../services/api";
import { addNotification } from "./notifications";
import { ACTION_APPROVED } from '../../helpers/notificationMessages';

export const addApproval = (approval, approvalLevel) => (dispatch, getState) => {  
	return apiCall('post', '/approvals', approval )
        .then(res => {
            //success status = 201
            dispatch(addNotification(ACTION_APPROVED.replace('{0}', approval.actionId).replace('{1}', approvalLevel), 'success'));
            return res
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