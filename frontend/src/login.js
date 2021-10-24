
import { 
    fileToDataUrl,
    errorPopUp,
    unload,
} from './helpers.js';

import {
    getChannels,
} from './channel.js';

// User Login/Authentication

/**
 * Logs in the user by their email and password
 */
export function login() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const jsonString = JSON.stringify({
        email: email,
        password: password,
    });

    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: jsonString,
    };

    fetch('http://localhost:5005/auth/login', requestOptions).then((response) => {
        if (response.ok) {
            response.json().then((data) => {
                localStorage.setItem('token', data['token']);
                localStorage.setItem('password', password);
                localStorage.setItem('email', email);

                loggedIn();
            })
        } else {
            response.json().then((data) => {
                errorPopUp(data["error"]);
            });
        }
    });
}

/**
 * Registers the user by the details filled out in registration the form
 * 
 */
export function register() {
    const email = document.getElementById('register_email').value;
    const name = document.getElementById('create_username').value;
    const password = document.getElementById('create_password').value;
    const confirm = document.getElementById('confirm_password').value;

    if (password.toString() !== confirm.toString()) {
        errorPopUp("Please make sure your passwords match.");
        return;
    }

    const jsonString = JSON.stringify({
        email: email,
        password: password,
        name: name,
    });

    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: jsonString,
    };

    fetch('http://localhost:5005/auth/register', requestOptions).then((response) => {
        if (response.ok) {
            response.json().then((data) => {
                localStorage.setItem('token', data['token']);
                localStorage.setItem('password', password);
                localStorage.setItem('email', email);
                loggedIn();
            })           
        } else {
            response.json().then((data) => {
                errorPopUp(data["error"]);
            });
        }
    });
}

/**
 * Logs out the current user by their token (stored in localStorage)
 */
export function signout() {
    const token = localStorage.getItem('token');

    const requestOptions = {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token,
        },

    };

    fetch('http://localhost:5005/auth/logout', requestOptions).then(response => {
        if (response.ok) {
            localStorage.removeItem('token');
            notLoggedIn();
        } else {
            response.json().then((data) => {
                localStorage.removeItem('token');
                localStorage.removeItem('password');
                localStorage.removeItem('email');

                notLoggedIn();
                errorPopUp(data["error"]);
            });
        }
    });
}

/**
 * If the user is not logged in, display login/register pages
 */
export function notLoggedIn() {
    unload();
    document.getElementById("login_page").style.display ="flex";
}
/**
 * If the user is logged in, display the main application page
 */
export function loggedIn() {
    unload();
    document.getElementById("navbar").style.display = "flex";
    document.getElementById("application_page").style.display = "grid";
    getChannels();
}