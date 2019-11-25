//root reducer 
import { combineReducers } from 'redux';
import currentUser from './currentUser'; 
import safetyIncidents from './events'; 
import lookupData from './lookupData'; 
import actions from './actions';
import notifications from './notifications'; 

const rootReducer = combineReducers({
    currentUser, 
    safetyIncidents, 
    lookupData, 
    actions,
    notifications,
}); 

export default rootReducer; 

