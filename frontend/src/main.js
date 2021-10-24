import { BACKEND_PORT } from './config.js';
// A helper you may want to use when uploading new images to the server.
import { 
    fileToDataUrl,
    errorPopUp,
    unload,
    clearChildren,
} from './helpers.js';

import {
    login,
    register,
    signout,
    loggedIn,
    notLoggedIn,
} from './login.js';

import {
    createNewChannel,
} from './channel.js';

import {
    displayChannelMessages, renderMessage,
} from './messages.js';
import { generateUserList } from './user.js';

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

// EVENT HANDLERS FOR CREATING CHANNELS

document.getElementById('create_channel').addEventListener('click', ()=> {
    document.getElementById("new_channel").style.display = "block";
});

document.getElementById('create_channel_submit').addEventListener('click', () => {
    createNewChannel();
});

/**
 * User closes any error pop ups by pressing the x button
 */
document.getElementById('close_error').addEventListener('click', () => {
    // close popup
    document.getElementById("error_pop_up").style.display = "none";
});

document.getElementById('close_form').addEventListener('click', () => {
    document.getElementById("new_channel").style.display = "none";
});

document.getElementById('close_edit_channel').addEventListener('click', () => {
    document.getElementById("edit_channel").style.display = "none";
});

document.getElementById('close_edit_message').addEventListener('click', () => {
    document.getElementById("edit_message").style.display = "none";
});

document.getElementById('close_react_message').addEventListener('click', () => {
    document.getElementById("react_message").style.display = "none";
});


const element = document.getElementById("channel_content");;
const loading = document.getElementById('loading');
let numChildren;
let id;

// Infinite scroll
document.getElementById("channel_content").addEventListener('scroll', () => {
    if (element.scrollHeight + element.scrollTop <= element.clientHeight + 1 && element.childElementCount !== 0) {
        // errorPopUp("hello this is when i reach the top");
        numChildren = element.childElementCount;
        console.log(numChildren);
        id = document.getElementById("display_id").value;
        loading.style.display = "flex";
        setTimeout(function() { displayChannelMessages(id, numChildren); }, 1000);
    } 
});


// mobile layout
document.getElementById("brand").addEventListener('click', () => {
    if (window.screen.width <= 756) {
        const search_filter = document.getElementById("filter");
        const channel_list = document.getElementById("channel_list");
        const add_channel = document.getElementById("user_options");
        

        const details = document.getElementById("channel_nav");
        const buttons = document.getElementById("channel_buttons");
        const container = document.getElementById("message_container");
        const msg_field = document.getElementById("message_field");

        document.getElementById("application_page").style.gridTemplateAreas = '"search" "list" "user_options"'

        console.log(document.getElementById("application_page").style.gridTemplateAreas);

        search_filter.style.display = "flex";
        channel_list.style.display = "block";
        add_channel.style.display = "flex";
        details.style.display = "none";
        buttons.style.display = "none";
        container.style.display = "none";
        msg_field.style.display = "none";

    }
});


// send a message
document.getElementById("msg_send").addEventListener('click', () => {
    renderMessage(document.getElementById("display_id").value);
    document.getElementById("msg_input").value = "";
});

// send a message
document.getElementById("msg_input").addEventListener('keydown', (e) => {
    if(e.code === "Enter") {
        renderMessage(document.getElementById("display_id").value);
        document.getElementById("msg_input").value = "";
    }
});

// Showcase pinned messages modal
document.getElementById('toggle_pinned_messages').addEventListener('click', () => {
    document.getElementById("pinned_messages").style.display = "block";
});

// close pinned messages modal
document.getElementById('close_pinned_messages').addEventListener('click', () => {
    document.getElementById("pinned_messages").style.display = "none";
});

// open invite users modal
document.getElementById('invite_channel').addEventListener('click', () => {
    generateUserList();
    clearChildren(document.getElementById('user_list'));
    document.getElementById('invite_to_channel').style.display = "block";
    
});

document.getElementById('close_invite_channel').addEventListener('click', () => {
    document.getElementById('invite_to_channel').style.display = "none";
});

checkUserLogin();