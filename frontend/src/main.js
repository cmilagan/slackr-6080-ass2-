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
    createNewChannel, getChannels, joinChannel, leaveChannel,
} from './channel.js';

import {
    displayChannelMessages, renderMessage,
} from './messages.js';
import { generateUserList, getLoggedInUserDetails, updateUserDetails } from './user.js';


// fragment based url routing
window.onhashchange = loadHashPage;
function loadHashPage() {
    let hash = location.hash;
    if (hash === "#profile") {

    } else if (/^#channel={/.test(hash)) {
        const id = hash.substring(10, hash.length - 1);
        const channel_id = parseInt(id);

        
    } else if (/^#profile={/.test(hash)) {
        const id = hash.substring(9, hash.length - 1);
        const user_id = parseInt(id);
    }
}


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
    window.location.hash = "register";
});

/**
 * User goes back to the login page from registration screen
 */
document.getElementById('back').addEventListener('click', () => {
    // display login page 
    unload();
    window.location.hash = "login";
    document.getElementById("login_page").style.display = "flex";
});

/**
 * User registers upon clicking submit button
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
    window.location.hash = "login";
    signout();
});

// EVENT HANDLERS FOR CREATING CHANNELS

document.getElementById('create_channel').addEventListener('click', ()=> {
    window.location.hash = "create_channel";
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

/**
 * closes create channel form
 */
document.getElementById('close_form').addEventListener('click', () => {
    window.location.hash = `channel=\{${document.getElementById("display_id").value}\}`;
    document.getElementById("new_channel").style.display = "none";
});

/**
 * closes edit channel form
 */
document.getElementById('close_edit_channel').addEventListener('click', () => {
    window.location.hash = `channel=\{${document.getElementById("display_id").value}\}`;
    document.getElementById("edit_channel").style.display = "none";
});


/**
 * closes edit message form
 */
document.getElementById('close_edit_message').addEventListener('click', () => {
    window.location.hash = `channel=\{${document.getElementById("display_id").value}\}`;
    document.getElementById("edit_message").style.display = "none";
});

/**
 * closes react message popup
 */
document.getElementById('close_react_message').addEventListener('click', () => {
    window.location.hash = `channel=\{${document.getElementById("display_id").value}\}`;
    document.getElementById("react_message").style.display = "none";
});


// Showcase pinned messages modal
document.getElementById('toggle_pinned_messages').addEventListener('click', () => {
    window.location.hash = `pinned_messages_channel=\{${document.getElementById("display_id").value}\}`;
    document.getElementById("pinned_messages").style.display = "block";
});

// close pinned messages modal
document.getElementById('close_pinned_messages').addEventListener('click', () => {
    window.location.hash = `channel=\{${document.getElementById("display_id").value}\}`;
    document.getElementById("pinned_messages").style.display = "none";
});

// open invite users modal
document.getElementById('invite_channel').addEventListener('click', () => {
    window.location.hash = `invite_channel=\{${document.getElementById("display_id").value}\}`;
    generateUserList();
    clearChildren(document.getElementById('user_list'));
    document.getElementById('invite_to_channel').style.display = "block";
    
});

// close invite channel modal
document.getElementById('close_invite_channel').addEventListener('click', () => {
    window.location.hash = `channel=\{${document.getElementById("display_id").value}\}`;
    document.getElementById('invite_to_channel').style.display = "none";
});

document.getElementById('join_channel').addEventListener('click', () => {
    joinChannel(document.getElementById("display_id").value);
});

document.getElementById('leave_channel').addEventListener('click', () => {
    leaveChannel(document.getElementById("display_id").value);
});

// closes currently viewed profile
document.getElementById("close_user_profile").addEventListener('click', () => {
    window.location.hash = `channel=\{${document.getElementById("display_id").value}\}`;
    document.getElementById('view_user_profile').style.display = "none";
});

document.getElementById("profile_button").addEventListener('click', () => {
    window.location.hash = `profile`;
    document.getElementById("view_personal_profile").style.display = "block";
    getLoggedInUserDetails();
});

document.getElementById("close_personal_profile").addEventListener('click', () => {
    window.location.hash = `channel=\{${document.getElementById("display_id").value}\}`;
    document.getElementById("view_personal_profile").style.display = "none";
});

document.getElementById("close_channel_images").addEventListener('click', () => {
    window.location.hash = `channel=\{${document.getElementById("display_id").value}\}`;
    document.getElementById("view_channel_images").style.display = "none";
});

document.getElementById("submit_profile_changes").addEventListener('click', () => {
    window.location.hash = `channel=\{${document.getElementById("display_id").value}\}`;
    updateUserDetails();
});

/**
 * Buttons to navigate through full screen images;
 */
document.getElementById("left_button").addEventListener('click', () => {
    const view_width = document.getElementById("image_container").offsetWidth;
    document.getElementById("image_container").scrollBy(- view_width, 0);
});

document.getElementById("right_button").addEventListener('click', () => {
    const view_width = document.getElementById("image_container").offsetWidth;
    document.getElementById("image_container").scrollBy(view_width, 0);
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
        id = document.getElementById("display_id").value;
        loading.style.display = "flex";
        setTimeout(function() { displayChannelMessages(id, numChildren); }, 1000);
    } 
});

window.addEventListener('resize', () => {
    if (window.screen.width > 756) {
        // const search_filter = document.getElementById("filter");
        // const channel_list = document.getElementById("channel_list");
        // const add_channel = document.getElementById("user_options");
        

        // const details = document.getElementById("channel_nav");
        // const buttons = document.getElementById("channel_buttons");
        // const container = document.getElementById("message_container");
        // const msg_field = document.getElementById("message_field");
        // document.getElementById("application_page").style.gridTemplateAreas = '"search details" "list content_container" "user_options msg_field"'
    
        // search_filter.style.display = "flex";
        // channel_list.style.display = "block";
        // add_channel.style.display = "flex";
        // details.style.display = "flex";
        // buttons.style.display = "flex";
        // container.style.display = "block";
        // msg_field.style.display = "flex";
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
    document.getElementById("image_icon").style.backgroundColor = "#f6cd59";

});

// send a message
document.getElementById("msg_input").addEventListener('keydown', (e) => {
    if(e.code === "Enter") {
        renderMessage(document.getElementById("display_id").value);
        document.getElementById("msg_input").value = "";
        document.getElementById("image_icon").style.backgroundColor = "#f6cd59";
    }
});


// toggle password visibility on and off on user profile
document.getElementById("visibility_switch").addEventListener('click', () => {
    if (document.getElementById("users_password").type === "text") {
        document.getElementById("users_password").type = "password";
    } else {
        document.getElementById("users_password").type = "text";
    }
});


/**
 * Visual indicator that a file has been chosen and can be sent
 */
document.getElementById("image_upload").addEventListener("change", () => {
    const node = document.getElementById("image_upload");
    if (node.files[0] !== undefined) {
        document.getElementById("image_icon").style.backgroundColor = "#c38d9d";
    }
});

// event handler for search filter
document.getElementById("channel_search").addEventListener('keydown', () => {
    getChannels();
});

checkUserLogin();