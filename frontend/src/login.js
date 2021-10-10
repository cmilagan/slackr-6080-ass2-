
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
            errorPopUp("Successful login");
        } else {
            errorPopUp("Invalid login attempt");
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
            errorPopUp("Successful registration");
            // handles registered emails
        } else {
            errorPopUp("Invalid register attempt, Email is already in use.");
        }
    });
}