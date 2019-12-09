//root reducer 
import { combineReducers } from 'redux';
import currentUser from './currentUser'; 
import safetyIncidents from './events'; 
import lookupData from './lookupData'; 
import actions from './actions';
import notifications from './notifications'; 
import reportData from './reports';

const rootReducer = combineReducers({
    currentUser, 
    safetyIncidents, 
    lookupData, 
    actions,
    notifications,
    reportData
}); 

export default rootReducer; 

