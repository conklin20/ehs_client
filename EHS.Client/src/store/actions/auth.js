import { apiCall, setTokenHeader } from "../../services/api"; 
import { SET_CURRENT_USER } from "../actionTypes";
import { addError, removeError } from './errors'; 

export function setCurrentUser(user){
  let newUserObj = {}
  //if we're retreiving the user data from the JWT toke, it wont be in the same format as when we initially just pull it from the db, 
  //so we need to map the fields we want from the JWT object to the user object 
  if(user.nameid){
    //nameid indicates we're working with the JWT token array
    //the userData array is created on the server when the user is authenticated and the jwt tokens payload is created. 
    //if the order of which these fields are added to the payload changes, the order in the array below will also need updated 
    const userData = user[`http://schemas.microsoft.com/ws/2008/06/identity/claims/userdata`];
    const phone = user[`http://schemas.xmlsoap.org/ws/2005/05/identity/claims/mobilephone`];
    
    newUserObj = {
      dateFormat: userData[3],
      email: user.email,
      firstName: user.given_name, 
      lastName: user.family_name, 
      fullName: `${user.given_name} ${user.family_name}`,
      phone: phone, 
      logicalHierarchyId: userData[0],
      logicalHierarchyPath: userData[9],
      physicalHierarchyId: userData[1],
      physicalHierarchyPath: userData[10],
      roleId: user.role,
      timeZone: userData[2],
      userId: user.nameid, 
      approvalLevel: userData[4], 
      approvalLevelName: userData[5], 
      roleName: userData[6], 
      roleCapabilities: userData[7], 
      roleLevel: userData[8], 
    }
  } else {
    newUserObj = user; 
  }
  
  return {
    type: SET_CURRENT_USER, 
    user: newUserObj
  }
}

export function setAuthorizationToken(token) {
  setTokenHeader(token);
}

export function logout(){
  return dispatch => {
    sessionStorage.clear();
    setAuthorizationToken(false); //clear the token/force log out
    dispatch(setCurrentUser({}));
  }
}

//"type" will be used for differentiating between login/signup when we get to the signup part
export function authUser(type, userData) {
  console.log('logging user in...')
  return dispatch => {
    // wrap our thunk in a promise so we can wait for the API call
    return new Promise((resolve, reject) => {
      return apiCall("post", `/users/login`, userData)
        .then(res => {
          const { token, ...user } = res.data
          sessionStorage.setItem("jwtToken", token);
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