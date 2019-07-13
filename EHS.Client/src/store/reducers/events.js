import { LOAD_SAFETY_INCIDENTS } from '../actionTypes'; 

const events = (state = [], action) => {
    switch(action.type){
        case LOAD_SAFETY_INCIDENTS: 
            return [...action.safetyIncidents]; 
        default: 
            return state;  
    }
}

export default events; 