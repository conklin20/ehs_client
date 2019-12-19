import axios from "axios"; //lib for making ajax requests
import { logout } from '../store/actions/auth';

const APIVERSION = 1;
const AUTHORIZATION_HEADER = 'Authorization';

export function setTokenHeader(token){
    // console.log(token)
    if (token){
        axios.defaults.headers.common[AUTHORIZATION_HEADER] = `Bearer ${token}`;
    } else {
        delete axios.defaults.headers.common[AUTHORIZATION_HEADER];
    }
}

/**
 * A wrapper around axios API call that formats errors, etc. 
 * @param {string} method the HTTP verb you want to use
 * @param {string} path the route path / endpoint
 * @param {object} data (optional) data in JSON form for POST requests
 */
export function apiCall(method, path, data){
    path = `/api/v${APIVERSION}${path}`;
    // console.log(method, path, data); 
    return  new Promise((resolve, reject) => {
        return axios[method](path, data)
            .then(res => {
                // console.log(res); 
                return resolve(res)
            })
            .catch(err => {
                // console.log(err);
                //if the reqs are returning 401, the user is no longer authenticated (could mean their token expired). Log the user out 
                if(err.response.status === 401) { //unauthorized 
                    // console.log('calling logout()')
                    // dispatch(logout()); 
                }

                return reject({
                    error: err, 
                    response: err.response
                }); 
                // return reject(err.response.data.message); 
            });
    });
}

export function apiCallWithFiles(method, path, files, data){
    
    const formData = new FormData();
    files.map(f => {
        return formData.append('file', f)
    })
    // formData.append('data', data)
    const config = {
        headers: {
            'content-type': 'multipart/form-data'
        }
    }
    
    path = `/api/v${APIVERSION}${path}?eventId=${data.eventId}&userId=${data.userId}`;
    
    return  new Promise((resolve, reject) => {
        return axios[method](path, formData, config)
            .then(res => {
                // console.log(res.data); 
                return resolve(res)
            })
            .catch(err => {
                console.log(err);
                return reject({
                    error: err, 
                    response: err.response
                }); 
                // return reject(err.response.data.message); 
            });
    });
}