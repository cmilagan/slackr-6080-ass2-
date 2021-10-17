import { 
    fileToDataUrl,
    errorPopUp,
    unload,
    calculateTimeDate,
} from './helpers.js';
import { 
    displayChannelMessages,
} from './messages.js';

import {
    getUserDetails,
} from './user.js';

/**
 * Displays the popup to the user
 */
export function createNewChannel() {
    const channel_name = document.getElementById("new_channel_name").value;
    const channel_desc = document.getElementById("new_channel_desc").value;
    const private_channel = document.getElementById("make_private").checked; /* e.g value=unchecked */
    console.log(private_channel);

    const token = localStorage.getItem('token');

    const jsonString = JSON.stringify({
        name: channel_name,
        private: private_channel,
        description: channel_desc,
    });

    const requestOptions = {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token,
        },
        body: jsonString,
    };

    fetch('http://localhost:5005/channel', requestOptions).then(response => {
        if (response.ok) {
            console.log("new channel created");
            document.getElementById("new_channel").style.display = "none";
            getChannels();
        } else {
            response.json().then((data) => {
                errorPopUp(data["error"]);
            });
        }
    });
}

/**
 * display the channel details on the page channel navigation bar
 * @param {*} id 
 */
const displayChannelDetails = (id) => {
    const token = localStorage.getItem("token");

    const requestOptions = {
        method: 'GET',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token,
        },
        path : {
            'channelId': id,
        }
    }

    let date_time;

    /**
     * Call back funtion for getting the users details 
     */
    let user_name;
    const success = (data) => {
        user_name = data["name"];
        document.getElementById("attribute_display").innerText = "Created by: " +  user_name + " on: " + date_time;
    }

    fetch('http://localhost:5005/channel/' + id, requestOptions).then(response => {
        if (response.ok) {
            console.log("Details obtained");
            response.json().then(data => {
                document.getElementById("heading_display").innerText = data["name"];
                let channel_type = "Public, "
                if (data["private"]) {
                    channel_type = "Private, "
                }
                document.getElementById("display_id").value = id;
                document.getElementById("description_display").innerText = "Description: " + channel_type + data["description"];
                document.getElementById("attribute_display").style.display = "block";
                document.getElementById("join_channel").style.display = "none";
                document.getElementById("invite_channel").style.display = "block";
                document.getElementById("leave_channel").style.display = "block";
                getUserDetails(data["creator"], success);
                date_time = calculateTimeDate(data["createdAt"]);
                
            });
        } else {
            response.json().then(data => {
                console.log(data["error"]);
                errorPopUp(data["error"]);
            });
            document.getElementById("heading_display").innerText = "You are not a member of this channel";
            document.getElementById("description_display").innerText = "Ask a user to invite you :)";
            document.getElementById("attribute_display").style.display = "none";
            document.getElementById("join_channel").style.display = "block";
            document.getElementById("leave_channel").style.display = "none";
            document.getElementById("invite_channel").style.display = "none";

        }
    });
}




/**
 * Edit selected channels details.
 * @param {*} id 
 */
const editChannelDetails = (id) => {
    // edit channel info
    const edited_name = document.getElementById("edit_channel_name_" + id).value;
    const edited_desc = document.getElementById("edit_channel_desc_" + id).value;
    const token = localStorage.getItem('token');
    console.log(token);

    // console.log(edited_name);
    // console.log(edited_desc);

    const jsonString = JSON.stringify({
        name: edited_name,
        description: edited_desc,
    });

    const requestOptions = {
        method: 'PUT',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token,
        },
        path : {
            'channelId': id,
        },
        body: jsonString,
    }
    fetch('http://localhost:5005/channel/' + id, requestOptions).then(response => {
        if (response.ok) {
            console.log("Succesfully changed channel details");
            getChannels();
            displayChannelDetails(id);
        } else {
            response.json().then((data) => {
                console.log("i got here");
                console.log(data["error"]);
                errorPopUp(data["error"]);
            });
        }
    });
};

/**
 * Dynamically create an edit channel form for 
 * @param {*} id 
 */
const createEditForm = (id) => {

    // let form = document.getElementById("edit_channel_form_" + id);
    const form = document.getElementById("edit_channel_form");
    form.innerHTML = "";
    const form_heading = document.createElement("h1");
    form_heading.innerText = "Edit channel details";

    const input_field_1 = document.createElement("label");
    input_field_1.setAttribute("class", "input_field");
    input_field_1.innerText = "Channel Name";

    const input_field_2 = document.createElement("label");
    input_field_2.setAttribute("class", "input_field");
    input_field_2.innerText = "Description";

    const edit_channel_name = document.createElement("input");
    edit_channel_name.setAttribute("type", "text");
    edit_channel_name.setAttribute("id", "edit_channel_name_" + id);
    edit_channel_name.setAttribute("placeholder", "Enter a channel name...");

    const edit_channel_desc = document.createElement("input");
    edit_channel_desc.setAttribute("type", "text");
    edit_channel_desc.setAttribute("id", "edit_channel_desc_" + id);
    edit_channel_desc.setAttribute("placeholder", "Enter a channel description...");


    const submit = document.createElement("input");
    submit.setAttribute("type", "button");
    submit.setAttribute("id", "edit_channel_submit_" + id);
    submit.setAttribute("class", "btn");
    submit.setAttribute("value", "submit");

    form.appendChild(form_heading);
    form.appendChild(input_field_1);
    form.appendChild(edit_channel_name);
    form.appendChild(input_field_2);
    form.appendChild(edit_channel_desc);
    form.appendChild(submit);

    document.getElementById("edit_channel_submit_" + id).addEventListener("click", () => {
        console.log(id);
        editChannelDetails(id);
        document.getElementById("edit_channel").style.display = "none";
    })
}

/**
 * Displays the channel list
 */
export function getChannels() {
    // hard reset channel list 
    
    const channel_list = document.getElementById("channel_list");
    channel_list.innerHTML = '';

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
                    current.setAttribute("id", "channel_" + i["id"]);
                    let private_status = document.createElement("i");
                    private_status.setAttribute("class", "fas fa-unlock");
                    if (i["private"] === true) {
                        private_status.setAttribute("class", "fas fa-lock");
                    } 


                    const edit_channel = document.createElement("i");
                    edit_channel.setAttribute("class", "fas fa-edit");
                    edit_channel.setAttribute("id", "edit_channel_" + i["id"]);
                    const name = document.createTextNode(i["name"]);
                    current.appendChild(private_status);
                    current.appendChild(name);
                    current.appendChild(edit_channel);
                    channel_list.appendChild(current);


                    document.getElementById("channel_" + i["id"]).addEventListener('click', () => {
                        console.log("displaying clicked channel " + i["id"]);
                        displayChannelDetails(i["id"]);
                        document.getElementById("channel_content").innerHTML = "";
                        displayChannelMessages(i["id"], 0);
                    })

                    document.getElementById("edit_channel_" + i["id"]).addEventListener('click', () => {
                        createEditForm(i["id"]);
                        document.getElementById("edit_channel").style.display = "block";
                    });

                    // document.getElementById("edit_channel_submit_" + i["id"]).addEventListener('click', () => {
                    //     console.log("This is the submit" + i["id"]);
                    // });
                });
                
            });
        } else {
            response.json().then((data) => {
                errorPopUp(data["error"]);
            });
        }
    });
    
}