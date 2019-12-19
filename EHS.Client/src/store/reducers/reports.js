import { LOAD_REPORT_DATA, CLEAR_REPORT_DATA } from "../actionTypes"

const data = (state = {}, action) => {
    // console.log(action)
    // console.log(state)
    switch(action.type){
        case LOAD_REPORT_DATA: 
            return {...state, [action.report]: action.data}
        case CLEAR_REPORT_DATA:
            if(Object.keys(state).includes(action.report)){
                delete state[action.report];
                return state;
            } else {
                return state;
            }
        default: 
            return state;  
    }
}

export default data; 