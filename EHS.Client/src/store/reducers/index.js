//root reducer 
import { combineReducers } from 'redux';
import currentUser from './currentUser'; 
import errors from './errors';
import safetyIncidents from './events'; 
import lookupData from './lookupData'; 

const rootReducer = combineReducers({
    currentUser, 
    errors, 
    safetyIncidents, 
    lookupData, 
}); 

export default rootReducer; 

