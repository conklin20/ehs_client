import { ADD_NOTIFICATION, REMOVE_NOTIFICATION } from '../actionTypes'; 

export const addNotification = (message, variant) => ({
    type: ADD_NOTIFICATION, 
    message, 
    variant,
})

export const removeNotification = () => ({
    type: REMOVE_NOTIFICATION
})