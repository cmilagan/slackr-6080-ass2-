
import { 
    fileToDataUrl,
    errorPopUp,
    unload,
} from './helpers.js';

// User Login/Authentication

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
                console.log(data['token']);
                loggedIn();
            })
        } else {
            response.json().then((data) => {
                errorPopUp(data["error"]);
            });
        }
    });
}

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
                console.log(data['token']);
                loggedIn();
            })           
        } else {
            response.json().then((data) => {
                errorPopUp(data["error"]);
            });
        }
    });
}

export function signout() {
    const token = localStorage.getItem('token');

    const requestOptions = {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token,
        },

    };

    console.log(token);
    fetch('http://localhost:5005/auth/logout', requestOptions).then(response => {
        if (response.ok) {
            localStorage.removeItem('token');
            notLoggedIn();
        } else {
            response.json().then((data) => {
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
    console.log("user is not logged in, displaying login page");
}
/**
 * If the user is logged in, display the main application page
 */
export function loggedIn() {
    unload();
    document.getElementById("navbar").style.display = "flex";
    document.getElementById("footer").style.display = "flex";
    console.log(localStorage.getItem('token'));
}