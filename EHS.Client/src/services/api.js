import axios from "axios"; //lib for making ajax requests 

const APIVERSION = 1;
const AUTHORIZATION_HEADER = 'Authorization';

export function setTokenHeader(token){
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
    // console.log(path); 
    return  new Promise((resolve, reject) => {
        return axios[method](path, data)
            .then(res => {
                // console.log(res.data); 
                return resolve(res.data)
            })
            .catch(err => {
                return reject({
                    error: err, 
                    response: err.response
                }); 
                // return reject(err.response.data.message); 
            });
    });
}