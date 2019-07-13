import { apiCall, setTokenHeader } from "../../services/api"; 
import { SET_CURRENT_USER } from "../actionTypes";
import { addError, removeError } from './errors'; 

export function setCurrentUser(user){
    return {
        type: SET_CURRENT_USER, 
        user
    }
}

export function setAuthorizationToken(token){
  setTokenHeader(token); 
}

export function logout(){
  return dispatch => {
    localStorage.clear();
    setAuthorizationToken(false); //clear the token/force log out
    dispatch(setCurrentUser({})); 
  }
}

//"type" will be used for differentiating between login/signup when we get to the signup part
export function authUser(type, userData) {
    return dispatch => {
      // wrap our thunk in a promise so we can wait for the API call
      return new Promise((resolve, reject) => {
        return apiCall("post", `/users/login`, userData)
          .then(({ token, ...user }) => {
            localStorage.setItem("jwtToken", token);
            setAuthorizationToken(token);
            dispatch(setCurrentUser(user));
            dispatch(removeError());
            resolve(); // indicate that the API call succeeded
          })
          .catch(err => {
            dispatch(addError(err));
            reject(); // indicate the API call failed
          });
      });
    };
  }