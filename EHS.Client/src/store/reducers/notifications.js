import { ADD_NOTIFICATION, REMOVE_NOTIFICATION } from "../actionTypes"

export default (state = {message: null, variant: null}, action) => {
    switch (action.type) {
        
        case ADD_NOTIFICATION:
            return {
                state,
                message: action.message,
                variant: action.variant
            };
            // return {...state, userRoles: action.roles}
        case REMOVE_NOTIFICATION:
            return {
                message: null, 
                variant: null 
            };
        default:
            return state;
    }
}