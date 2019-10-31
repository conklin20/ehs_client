import { REMOVE_ACTION, LOAD_ACTIONS } from '../actionTypes'; 

const actions = (state = [], action) => {
    switch(action.type){
        case REMOVE_ACTION: 
            return state.filter(a => a.actionId !== action.actionId);
        case LOAD_ACTIONS: 
            return state
        default: 
            return state;  
    }
}

export default actions; 