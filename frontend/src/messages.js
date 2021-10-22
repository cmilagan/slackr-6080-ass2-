import { 
    fileToDataUrl,
    errorPopUp,
    unload,
    calculateTimeDate,
    clearChildren,
} from './helpers.js';
import { getUserDetails } from './user.js';



const getMessageSenders = (message_list, user_list, message) => {
    const token = localStorage.getItem('token');
    message_list.push(message);
    const userRequestOptions = {
        method: 'GET',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token,
            'userId': message["sender"],
        },
    };

    // Get all instances of users sending a message & append them to promise list array
    user_list.push(
        fetch('http://localhost:5005/user/' + message["sender"], userRequestOptions).then(response => {
            if(response.ok) return response.json();
        }).then(json => {
            return json;
        }).catch(err => {
            errorPopUp(err);
            console.log(err);
        })
    );
}


// Helper function to render in new messages
const displayNewMessage = (id) => {
    const display = document.getElementById("channel_content");
    const token = localStorage.getItem('token');    
    const url = `http://localhost:5005/message/${id}?start=0`;
    const requestOptions = {
        method: 'GET',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token,
        },
        path : {
            'channelId': id,
        },
    };

    const message_list = [];
    const promise_list = [];
    fetch(url, requestOptions).then((response) => {
        if (response.ok) {
            return response.json();
        } else {
            response.json().then((data) => {
                errorPopUp(data["error"]);
            });
        }
    }).then(data => {
        return data["messages"];
    }).then(messages => {
        console.log(messages[0].sender);
        getMessageSenders(message_list, promise_list, messages[0]);
        return Promise.all(promise_list);
    }).then(msg_senders => {

        if (msg_senders.length !== message_list.length) {
            errorPopUp("Error loading messages");
        }
        // display latest message at the bottom of the content container
        const block = constructMessage(message_list[0], msg_senders[0]);
        display.insertBefore(block, display.firstChild);

        messageOptionHandlers(id, message_list[0].id);

    }).catch(err => {
        errorPopUp(err);
    });
};


const sendMessage = (message, image, id) => {
    if (image === undefined) image = "";
    const jsonString = JSON.stringify({
        message: message,
        image: image,
    });

    const token = localStorage.getItem('token');    
    const url = `http://localhost:5005/message/${id}`;
    const requestOptions = {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token,
        },
        path : {
            'channelId': id,
        },
        body : jsonString,
    };

    fetch(url, requestOptions).then((response) => {
        if (response.ok) {
            displayNewMessage(id);
        } else {
            response.json().then((data) => {
                errorPopUp(data);
            });
        }
    });
}

/**
 * Sends a message to the given chanel by id
 * @param {*} id 
 */
export const renderMessage = (id) => {
    const display = document.getElementById("channel_content");
    display.style.display = "flex";
    display.style.flexDirection = "column-reverse";

    // getting the message
    const message = document.getElementById("msg_input").value;
    // getting the image
    let image;
    // get image uploaded
    if (document.getElementById("image_upload").files[0] !== undefined) {
        fileToDataUrl(document.getElementById("image_upload").files[0]).then(data => {
            image = data;
            // https://stackoverflow.com/questions/2031085/how-can-i-check-if-string-contains-characters-whitespace-not-just-whitespace
            if (! /\S/.test(message) && image === undefined) {
                errorPopUp("Please dont send empty messages");
                return;
            }
            sendMessage(message, image, id);
            document.getElementById("image_upload").value = '';
        });
    } else {
        // no image uploaded in message
        if (! /\S/.test(message) && image === undefined) {
            errorPopUp("Please dont send empty messages");
            return;
        }
        sendMessage(message, image, id);
    }

}

// DOM manipulation function for rendering individual messages/ message senders
const constructMessage = (message, sender) => {
    const message_block = document.createElement("div");
    message_block.className = "msg_block";
    message_block.id = `msg_block_${message.id}`;
    message_block.style.margin = "2%";
    message_block.style.padding = "10px";
    message_block.style.width = "90%";
    message_block.style.boxShadow = "0px 2px #cccccc";

    // creating message header section
    const message_header = document.createElement("div");

    const left_section = document.createElement("div");
    const time_sent = document.createElement("small");
    time_sent.setAttribute("id", `message_time_stamp_${message.id}`)
    time_sent.innerText = calculateTimeDate(message.sentAt);
    console.log(message.edited);
    if (message.edited === true) {
        time_sent.innerText = calculateTimeDate(message.editedAt) + " (edited)";
    }
    const user_name = document.createElement("h4");
    user_name.innerText = sender.name;
    const profile_picture = document.createElement("img");
    profile_picture.src = sender.image;
    profile_picture.style.height = "30px";
    profile_picture.style.width = "30px";
    profile_picture.style.borderRadius = "50%";
    if (sender.image === null) {
        profile_picture.src = "../assets/default_profile.jpeg";
    }

    message_header.style.display = "block"
    left_section.appendChild(profile_picture);
    left_section.appendChild(user_name);
    left_section.appendChild(time_sent);

    // Options for messages
    const options = document.createElement("div");
    options.style.float = "right";
    options.style.width = "15%";
    
    const options_content = document.createElement("div");
    options_content.id = `options_content_${message.id}`;
    options_content.style.justifyContent = "space-between";
    options_content.style.display = "flex";

    const remove_msg = document.createElement("div");
    const bin_icon = document.createElement("i");
    bin_icon.className = "fas fa-trash";
    bin_icon.style.color = "red";
    remove_msg.appendChild(bin_icon);
    remove_msg.id = `remove_msg_${message.id}`;

    const edit_msg = document.createElement("div");
    const edit_icon = document.createElement("i");
    edit_icon.className = "fas fa-edit";
    edit_msg.appendChild(edit_icon);
    edit_msg.id = `edit_msg_${message.id}`;

    const react_msg = document.createElement("div");
    const react_icon = document.createElement("i");
    react_icon.className = "fas fa-grin";
    react_msg.appendChild(react_icon);
    react_msg.id = `react_msg_${message.id}`;

    const pin_msg = document.createElement("div");
    const pin_icon = document.createElement("i");
    pin_icon.className = "fas fa-thumbtack";
    pin_msg.appendChild(pin_icon);
    pin_msg.id = `pin_msg_${message.id}`;

    options_content.appendChild(pin_msg);
    options_content.appendChild(edit_msg);
    options_content.appendChild(react_msg);
    options_content.appendChild(remove_msg);

    options.appendChild(options_content);


    message_header.appendChild(left_section);

    const message_content = document.createElement("div");
    message_content.id = `message_content_${message.id}`;
    const text = document.createElement("p");
    text.id = `message_text_${message.id}`;
    text.innerText = message.message;
    const img = document.createElement("img");
    img.setAttribute("id", `message_image_${message.id}`);
    img.style.height = "auto";
    img.style.width = "20%";
    img.src = message.image;
    message_content.appendChild(text);
    if (message.image !== undefined) {
        message_content.appendChild(img);
    }

    message_block.appendChild(options);
    message_block.appendChild(message_header);
    message_block.appendChild(message_content);

    return message_block;
}

const deleteMessage = (channel_id, message_id) => {
    const token = localStorage.getItem('token');    
    const url = `http://localhost:5005/message/${channel_id}/${message_id}`;
    
    const requestOptions = {
        method: 'DELETE',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token,
        },
        path : {
            'channelId': channel_id,
            'messageId': message_id,
        },
    };

    fetch(url, requestOptions).then((response) => {
        if (response.ok) {
            const message_block = document.getElementById(`msg_block_${message_id}`);
            message_block.remove();
        } else {
            response.json().then((data) => {
                errorPopUp(data["error"]);
            });
        }
    });
}

const editMessage = (channel_id, message_id, message, image) => {
    const token = localStorage.getItem('token');
    const current_image_container = document.getElementById(`message_image_${message_id}`);
    if (image === undefined && current_image_container !== null) {
        image = current_image_container.src;
    }
    const url = `http://localhost:5005/message/${channel_id}/${message_id}`;
    const curr_time = new Date();
    const iso_time = curr_time.toISOString();
    const jsonString = JSON.stringify({
        message: message,
        image: image,
        edited: true,
        editedAt: iso_time,
    });
    const requestOptions = {
        method: 'PUT',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token,
        },
        path : {
            'channelId': channel_id,
            'messageId': message_id,
        },
        body : jsonString,
    };

    fetch(url, requestOptions).then((response) => {
        if (response.ok) {
            document.getElementById(`message_text_${message_id}`).innerText = message;
            if (image !== undefined) {
                if (document.getElementById(`message_image_${message_id}`) === null) {
                    const message_content = document.getElementById(`message_content_${message.id}`);
                    const img = document.createElement("img");
                    img.setAttribute("id", `message_image_${message.id}`);
                    img.style.height = "auto";
                    img.style.width = "20%";
                    img.src = image;
                    message_content.appendChild(img);
                } else {
                    document.getElementById(`message_image_${message_id}`).src = image;
                }
            }
            document.getElementById(`message_time_stamp_${message_id}`).innerText = calculateTimeDate(iso_time) + " (edited)";
        } else {
            response.json().then((data) => {
                errorPopUp(data["error"]);
            });
        }
    });
}


const editMessageRequest = (channel_id, message_id) => {
    const message = document.getElementById(`edit_message_text_${message_id}`).value;
    let image;

    if (document.getElementById(`edit_message_image_${message_id}`).files[0] !== undefined) {
        fileToDataUrl(document.getElementById(`edit_message_image_${message_id}`).files[0]).then(data => {
            image = data;
            // https://stackoverflow.com/questions/2031085/how-can-i-check-if-string-contains-characters-whitespace-not-just-whitespace
            if (! /\S/.test(message) && image === undefined) {
                errorPopUp("No modifications have been made please input into the fields");
                return;
            }

            console.log(message);
            if (message === document.getElementById(`message_text_${message_id}`).value) {
                errorPopUp("Please modify your text");
                return;
            }
            editMessage(channel_id, message_id, message, image);
            document.getElementById(`edit_message_image_${message_id}`).value = '';
        });
    } else {
        // no image uploaded in message
        if (! /\S/.test(message) && image === undefined) {
            errorPopUp("No modifications have been made please input into the fields");
            return;
        }
        console.log(message);
        console.log(message_id);
        console.log(document.getElementById(`message_text_${message_id}`));
        if (message === document.getElementById(`message_text_${message_id}`).innerText) {
            errorPopUp("Please modify your text");
            return;
        }
        editMessage(channel_id, message_id, message, image);
        document.getElementById(`edit_message_image_${message_id}`).value = '';
    }
}

const createEditMessageForm = (channel_id, message_id) => {
    console.log("creating new edit");
    const form = document.getElementById("edit_message_form");
    clearChildren(form);
    const form_heading = document.createElement("h1");
    form_heading.innerText = "Edit message";

    const input_field_1 = document.createElement("label");
    input_field_1.setAttribute("class", "input_field");
    input_field_1.innerText = "Edit text";

    const input_field_2 = document.createElement("label");
    input_field_2.setAttribute("class", "input_field");
    input_field_2.innerText = "Edit image uploaded";

    const edit_text = document.createElement("input");
    edit_text.setAttribute("type", "text");
    edit_text.setAttribute("id", "edit_message_text_" + message_id);
    edit_text.setAttribute("placeholder", "New message text");

    const edit_image = document.createElement("input");
    edit_image.setAttribute("type", "file");
    edit_image.setAttribute("id", "edit_message_image_" + message_id);

    const submit = document.createElement("input");
    submit.setAttribute("type", "button");
    submit.setAttribute("id", "edit_message_submit_" + message_id);
    submit.setAttribute("class", "btn");
    submit.setAttribute("value", "submit");

    form.appendChild(form_heading);
    form.appendChild(input_field_1);
    form.appendChild(edit_text);
    form.appendChild(document.createElement("br"));
    form.appendChild(input_field_2);
    form.appendChild(edit_image);
    form.appendChild(document.createElement("br"));
    form.appendChild(submit);

    document.getElementById("edit_message_submit_" + message_id).addEventListener("click", () => {
        console.log(`editing message ${message_id} in ${channel_id}`);
        editMessageRequest(channel_id, message_id);
        document.getElementById("edit_message").style.display = "none";
    });
}


// Event handlers for message modifications
const messageOptionHandlers = (channel_id, message_id) => {
    document.getElementById(`remove_msg_${message_id}`).addEventListener('click', () => {
        deleteMessage(channel_id, message_id);
    });

    document.getElementById(`edit_msg_${message_id}`).addEventListener('click', () => {
        console.log("hello");
        createEditMessageForm(channel_id, message_id);
        document.getElementById("edit_message").style.display= "block";
    });

    document.getElementById(`react_msg_${message_id}`).addEventListener('click', () => {
        
    });

    document.getElementById(`pin_msg_${message_id}`).addEventListener('click', () => {
        
    });
}


/**
 * Display channel messages on 
 * @param {*} id channelId
 */
export const displayChannelMessages = (id, flag) => {
    const display = document.getElementById("channel_content");
    display.style.display = "flex";
    display.style.flexDirection = "column-reverse";

    const token = localStorage.getItem('token');    
    const url = `http://localhost:5005/message/${id}?start=${flag}`;
    const requestOptions = {
        method: 'GET',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token,
        },
        path : {
            'channelId': id,
        },
    };

    const message_list = [];
    const promise_list = [];

    // get user name & profile photo from getUserDetails

    fetch(url, requestOptions).then(response => {
        if (response.ok) {
            return response.json();
        } else {
            response.json().then((data) => {
                errorPopUp(data["error"]);
            });
        }
    }).then(data => {
        return data["messages"];
    }).then(messages => {
        messages.map((i) => {
            getMessageSenders(message_list, promise_list, i);
            
        });
        // resolve all users data before continuing
        return Promise.all(promise_list);
    }).then(msg_senders => {
        console.log(message_list, msg_senders);
        if (msg_senders.length !== message_list.length) {
            errorPopUp("Error loading messages");
        }
        for (let i = 0; i < msg_senders.length; i++) {
            const block = constructMessage(message_list[i], msg_senders[i]);
            display.appendChild(block);

            messageOptionHandlers(id, message_list[i].id);
        }
    }).then(() => {
        // All messages finished loading, stop displaying loading animation
        const loading = document.getElementById("loading");
        loading.style.display = "none";
    }).catch(err => {
        errorPopUp(err);
    });

}