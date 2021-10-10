import { BACKEND_PORT } from './config.js';
// A helper you may want to use when uploading new images to the server.
import { 
    fileToDataUrl,
    errorPopUp,
    unload,
} from './helpers.js';

import {
    login,
    register,
    signout,
    loggedIn,
    notLoggedIn,
} from './login.js';


/**
 * Check that a user has been logged in.
 */

function checkUserLogin() {
    if (localStorage.key("token") === null) {
        console.log("checked in here");
        notLoggedIn();
    } else {
        console.log("user is already logged in");
        loggedIn();
    }
}

/* EVENT LISTENERS */

// LOGIN / REGISTRATION PAGE HANDLERS // 

/**
 * User logs in when pressing the login button
 */
document.getElementById('login_submit').addEventListener('click', () => {
    // run login function
    login();
});

/**
 * User logs in when pressing enter on the password
 */
document.getElementById('password').addEventListener('keydown', (e) => {
    if(e.code === "Enter") {
        // run login function
        login();
    }
});

/**
 * User switches to register screen when pressing sign-up button
 */

document.getElementById('sign_up').addEventListener('click', () => {
    // display register
    unload();
    document.getElementById("register_page").style.display = "flex";
});

/**
 * User goes back to the login page from registration screen
 */
document.getElementById('back').addEventListener('click', () => {
    // display login page 
    unload();
    document.getElementById("login_page").style.display = "flex";
});

/**
 * User goes back to the login page from registration screen
 */
document.getElementById('submit').addEventListener('click', () => {
    register();
});


/**
 * User registers when pressing enter on the confirm password field
 */
document.getElementById('confirm_password').addEventListener('keydown', (e) => {
    if(e.code === "Enter") {
        // run register
        register();
    }
});

/**
 * Event handler for user signing out
 */
document.getElementById('signout_button').addEventListener('click', () => {
    signout();
});




/**
 * User closes any pop ups by pressing the x button
 */
document.getElementById('close').addEventListener('click', () => {
    // close popup
    document.getElementById("error_pop_up").style.display = "none";
});

checkUserLogin();