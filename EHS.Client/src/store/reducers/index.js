//root reducer 
import { combineReducers } from 'redux';
import currentUser from './currentUser'; 
import errors from './errors';
import safetyIncidents from './events'; 
import lookupData from './lookupData'; 
import hierarchyData from './hierarchyData'; 
import actions from './actions';

const rootReducer = combineReducers({
    currentUser, 
    errors, 
    safetyIncidents, 
    lookupData, 
    hierarchyData,
    actions,
}); 

export default rootReducer; 

