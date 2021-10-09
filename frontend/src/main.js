console.log("hello");

const config = require('./config.json');
// A helper you may want to use when uploading new images to the server.
import { fileToDataUrl } from './helpers.js';

console.log('Let\'s go!');

/**
 * If the user is not logged in, display login/register pages
 */
function notLoggedIn() {
    document.getElementById("login").style.display ="block";
    console.log("notLoggedIn");
}

/**
 * Check that a user has been logged in.
 */

function checkUserLogin() {
    if (localStorage.key("token") === null) {
        console.log("checked in here");
        notLoggedIn();
    } else {
        // loggedIn();
    }
}

console.log("hello");
notLoggedIn();