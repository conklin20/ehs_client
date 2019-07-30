import { LOAD_LOOKUP_DATA } from '../actionTypes'; 

const lookupData = (state = [], action) => {
    switch(action.type) {
        case LOAD_LOOKUP_DATA: 
            return [...action.lookupData]
        default: 
            return state;
    }
}

export default lookupData;