import { LOAD_SAFETY_INCIDENTS } from '../actionTypes'; 

const events = (state = [], action) => {
    
    switch(action.type){
        case LOAD_SAFETY_INCIDENTS: 
            console.log(action)
            try{
                return action.safetyIncidents.length === 1 
                    ? [action.safetyIncidents]
                    : [...action.safetyIncidents]
            } catch(err){
                console.log(err)
            }
        // case LOAD_EVENT:
        //     console.log(state) 
        //     console.log(action)
        //     return state
        default: 
            return state;  
    }
}

export default events; 