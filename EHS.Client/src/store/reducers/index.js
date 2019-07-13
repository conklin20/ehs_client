//root reducer 
import { combineReducers } from 'redux';
import currentUser from './currentUser'; 
import errors from './errors';
import safetyIncidents from './events'; 

const rootReducer = combineReducers({
    currentUser, 
    errors, 
    safetyIncidents
}); 

export default rootReducer; 

