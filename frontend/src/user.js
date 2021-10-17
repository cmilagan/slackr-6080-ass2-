import { 
    fileToDataUrl,
    errorPopUp,
    unload,
    calculateTimeDate,
} from './helpers.js';

/**
 * Given a users id get the username
 * @param {*} id
 */
export function getUserDetails (id, successFunction) {
    const token = localStorage.getItem('token');
    const requestOptions = {
        method: 'GET',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token,
            'userId': id,
        },
    };

    fetch('http://localhost:5005/user/' + id, requestOptions).then(response => {
        if(response.ok) return response.json();
    }).then(json => {
        // console.log(json);
        // return 5;
        successFunction(json);
    }).catch(err => {
        errorPopUp(err);
    });
}