import { LOAD_SAFETY_INCIDENTS } from '../actionTypes'; 

const events = (state = [], action) => {
    switch(action.type){
        case LOAD_SAFETY_INCIDENTS: 
            try{
                return action.safetyIncidents.length === 1 
                    ? [action.safetyIncidents]
                    : [...action.safetyIncidents]
            } catch(err){
                console.log(err)
            }
        // case SET_IS_LOADING:
        //     return action.isLoading;
        default: 
            return state;  
    }
}

export default events; 