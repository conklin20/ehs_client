import { apiCall } from '../../services/api'; 

export const fetchUsers = () => {
    return dispatch => {
        return apiCall('get', '/users')
            .then(res => {
                //success response = 201
                return res; 
            })
            .catch(err => {
                return err; 
            })
    }
}

//userId in these cases is the user who is creating or updating the new user. Not the userId OF the new/updated user
export const postNewUser = (newUser, userId) => {
    return dispatch => {
        return apiCall('post', `/users?userId=${userId}`, newUser)
            .then(res => {
                //success response = 201
                return res;
            })
            .catch(err => {
                return err; 
            })
    }    
}

//userId in these cases is the user who is creating or updating the new user. Not the userId OF the new/updated user
export const updateUser = (user, userId) => { 
    return dispatch => {
        return apiCall('put', `/users/${user.userId}?userId=${userId}`, user)
            .then(res => {
                //success response = 202
                return res;
            })
            .catch(err => {
                return err; 
            })
    }
}

// cant delete users, can only deactivate the account 
//userId in these cases is the user who is creating or updating the new user. Not the userId OF the new/updated user
// export const deleteUser = (userIdToDelete, userId) => {
//     return dispatch => {
//         return apiCall('delete', `/users/${userIdToDelete}?userId=${userId}`)
//             .then(res => {
//                 return res.data;
//             })
//             .catch(err => {
//                 return err.response; 
//             })
//     }
// }