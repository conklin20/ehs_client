import { SET_CURRENT_USER } from "../actionTypes"; 

const DEFAULT_STATE = {
    isAuthenticated: false, //set to true when logged in
    user: {} // all of the user information when logged in
}

export default (state = DEFAULT_STATE, action) => {
    switch (action.type) {
        case SET_CURRENT_USER:
            return {
                //checking if the user object has data/key, if so, set auth to true
                isAuthenticated: Object.keys(action.user).length > 0,
                user: action.user
            }    
        default:
            return state;
    }
}