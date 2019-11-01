//root reducer 
import { combineReducers } from 'redux';
import currentUser from './currentUser'; 
import errors from './errors';
import safetyIncidents from './events'; 
import lookupData from './lookupData'; 
import hierarchyData from './hierarchyData'; 
import actions from './actions';
import notifications from './notifications'; 

const rootReducer = combineReducers({
    currentUser, 
    errors, 
    safetyIncidents, 
    lookupData, 
    hierarchyData,
    actions,
    notifications,
}); 

export default rootReducer; 

