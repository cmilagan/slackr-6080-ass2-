import { 
    fileToDataUrl,
    errorPopUp,
    unload,
} from './helpers.js';

/**
 * Displays the popup to the user
 */
export function channelform() {
    document.getElementById("new_channel").style.display = "block";
}

export function getChannels() {
    const token = localStorage.getItem('token');

    const requestOptions = {
        method: 'GET',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token,
        },

    };

    console.log(token);
    fetch('http://localhost:5005/channel', requestOptions).then(response => {
        if (response.ok) {
            response.json().then((data) => {
                data["channels"].map((i) => {
                    // Dynammically load the channel list
                    const current = document.createElement("div");
                    const name = document.createTextNode(i["name"]);
                    current.appendChild(name);
                    const channel_list = document.getElementById("channel_list");
                    channel_list.appendChild(current);
                });
            });
        } else {
            response.json().then((data) => {
                errorPopUp(data["error"]);
            });
        }
    });
}