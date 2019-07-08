import axios from "axios"; //lib for making ajax requests 

const APIVERSION = 1;

export function apiCall(method, path, data){
    path = `/api/v${APIVERSION}${path}`;
    return  new Promise((resolve, reject) => {
        return axios[method](path, data)
            .then(res => {
                return resolve(res.data)
            })
            .catch(err => {
                return reject(err.response.data.error); 
            });
    });
}