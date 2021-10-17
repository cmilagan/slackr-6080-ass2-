import { 
    fileToDataUrl,
    errorPopUp,
    unload,
    calculateTimeDate,
} from './helpers.js';
import { getUserDetails } from './user.js';

/**
 * Gets the specified channels messages
 * @param {*} id 
 */
export const getChannelMessages = (id) => {

}


const constructMessage = (message, sender) => {
    const display = document.getElementById("channel_content");
    const message_block = document.createElement("div");
    message_block.className = "msg_block";
    message_block.id = `msg_block_${message.id}`;
    message_block.style.margin = "2%";
    message_block.style.padding = "10px";
    message_block.style.boxShadow = "0px 2px #cccccc";

    // creating message header section
    const message_header = document.createElement("div");

    const left_section = document.createElement("div");
    const time_sent = document.createElement("small");
    time_sent.innerText = calculateTimeDate(message.sentAt);
    const user_name = document.createElement("h4");
    user_name.innerText = sender.name;
    const profile_picture = document.createElement("img");
    profile_picture.src = sender.image;
    profile_picture.style.height = "3%";
    profile_picture.style.width = "3%";
    profile_picture.style.borderRadius = "50%";
    if (sender.image === null) {
        profile_picture.src = "../assets/default_profile.jpeg";
    }

    message_header.style.display = "block"
    left_section.appendChild(profile_picture);
    left_section.appendChild(user_name);
    left_section.appendChild(time_sent);

    const options = document.createElement("i");
    options.className = "fas fa-ellipsis-v";
    options.style = "float: right";

    message_header.appendChild(left_section);

    const message_content = document.createElement("div");
    const text = document.createElement("p");
    text.innerText = message.message;
    message_content.appendChild(text);

    message_block.appendChild(options);
    message_block.appendChild(message_header);
    message_block.appendChild(message_content);

    display.appendChild(message_block);
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

    // get user name & profile photo from getUserDetails

    fetch(url, requestOptions).then(response => {
        return response.json();
    }).then(data => {
        return data["messages"];
    }).then(messages => {
        const promise_list = [];
        messages.map((i) => {
            message_list.push(i);

            const userRequestOptions = {
                method: 'GET',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token,
                    'userId': id,
                },
            };

            promise_list.push(
                fetch('http://localhost:5005/user/' + i["sender"], userRequestOptions).then(response => {
                    if(response.ok) return response.json();
                }).then(json => {
                    return json;
                }).catch(err => {
                    errorPopUp(err);
                })
            );
            
        });
        return Promise.all(promise_list);
    }).then(msg_senders => {
        if (msg_senders.length !== message_list.length) {
            errorPopUp("Error loading messages");
        }

        for (let i = 0; i < msg_senders.length; i++) {
            constructMessage(message_list[i], msg_senders[i]);
            flag += 1;
        }

    }).then(() => {
        // errorPopUp("hi");
        const loading = document.querySelector('.loading');
        loading.classList.remove('show');
    }).catch(err => {
        errorPopUp(err);
    });

}