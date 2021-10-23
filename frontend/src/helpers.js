/**
 * Given a js file object representing a jpg or png image, such as one taken
 * from a html file input element, return a promise which resolves to the file
 * data as a data url.
 * More info:
 *   https://developer.mozilla.org/en-US/docs/Web/API/File
 *   https://developer.mozilla.org/en-US/docs/Web/API/FileReader
 *   https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/Data_URIs
 * 
 * Example Usage:
 *   const file = document.querySelector('input[type="file"]').files[0];
 *   console.log(fileToDataUrl(file));
 * @param {File} file The file to be read.
 * @return {Promise<string>} Promise which resolves to the file as a data url.
 */
export function fileToDataUrl(file) {
    const validFileTypes = [ 'image/jpeg', 'image/png', 'image/jpg' ]
    const valid = validFileTypes.find(type => type === file.type);
    // Bad data, let's walk away.
    if (!valid) {
        throw Error('provided file is not a png, jpg or jpeg image.');
    }
    
    const reader = new FileReader();
    const dataUrlPromise = new Promise((resolve,reject) => {
        reader.onerror = reject;
        reader.onload = () => resolve(reader.result);
    });
    reader.readAsDataURL(file);
    return dataUrlPromise;
}

/**
 * display appropiate error msg in popup
 */
export function errorPopUp(err) {
    const message = document.getElementById("error_msg");
    message.innerText = err;
    console.log(err);
    document.getElementById("error_pop_up").style.display = "block";
}

/* Unloads all elements in the html file */
export function unload() {
    document.getElementById("error_pop_up").style.display = "none";
    document.getElementById("navbar").style.display = "none";
    document.getElementById("footer").style.display = "none";
    document.getElementById("register_page").style.display ="none";
    document.getElementById("login_page").style.display ="none";
    document.getElementById("error_pop_up").style.display ="none";
    document.getElementById("application_page").style.display ="none";
    document.getElementById("loading").style.display = "none";
}

export const calculateTimeDate = (isoString) => {
    // console.log(isoString);
    // https://www.codegrepper.com/code-examples/javascript/javascript+get+current+time+in+iso+format
    const time = new Date(isoString).toLocaleTimeString('en',
                { timeStyle: 'short', hour12: true, timeZone: 'Australia/Sydney' });
    const date = new Date(isoString);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();

    if (day < 10) {
        day = '0' + day;
    }
    if (month < 10) {
        month = '0' + month;
    }

    return day +'/' + month + '/'+ year + ' at ' + time;
}
/**
 * Removes all children of the specified element
 * @param {*} element 
 */
export const clearChildren = (element) => {
    
    while (element.firstChild) {
        element.removeChild(element.lastChild);
    }
}

// DOM manipulation function for rendering individual messages/ message senders
export const constructMessage = (message, sender) => {
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

/**
 * Generates a new react under the message
 * @param {*} channel_id 
 * @param {*} message_id 
 * @param {*} react_type 
 */
export const constructReactButton = (channel_id, message_id, react_type) => {
    let emoji;
    if (react_type === "thank") {
        emoji = "🙏";
    } else if (react_type === "heart") {
        emoji = "💗";
    } else if (react_type === "laugh") {
        console.log("hello");
        emoji = "😂";
    }
    console.log(emoji);
    const new_react = document.createElement("div");
    new_react.className = "react_button";
    new_react.id = `${react_type}_react_${message_id}`;
    new_react.style.display = "flex";
    new_react.style.justifyContent = "space-around";
    const num_reacts = document.createElement("p");
    num_reacts.id = `${react_type}_react_num_${message_id}`;
    num_reacts.innerText = "1";
    const react = document.createElement("p");
    react.innerText = emoji;
    new_react.appendChild(num_reacts);
    new_react.appendChild(react);
    
    const react_block = document.getElementById(`message_reacts_${message_id}`);
    console.log(react_block);
    react_block.appendChild(new_react);

    // unreact event handler
    document.getElementById(`${react_type}_react_${message_id}`).addEventListener('click', () => {
        messageUnReact(channel_id, message_id, react_type);
    });
}

/**
 * General function for creating a edit message form to appear on the modal
 * @param {*} channel_id 
 * @param {*} message_id 
 */
export const createEditMessageForm = (channel_id, message_id) => {
    const form = document.getElementById("edit_message_form");
    clearChildren(form);
    const form_container = document.createElement("div");
    form_container.style.display = "block";
    form_container.style.width = "90%";
    form_container.style.margin = "0 auto";
    form_container.style.textAlign = "center";
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


    const upload_div = document.createElement("div");
    upload_div.appendChild(input_field_2);
    upload_div.appendChild(edit_image);

    form_container.appendChild(form_heading);
    form_container.appendChild(document.createElement("br"));
    form_container.appendChild(input_field_1);
    form_container.appendChild(document.createElement("br"));
    form_container.appendChild(edit_text);
    form_container.appendChild(document.createElement("br"));
    form_container.appendChild(upload_div);
    form_container.appendChild(document.createElement("br"));
    form_container.appendChild(submit);

    form.appendChild(form_container);
    document.getElementById("edit_message_submit_" + message_id).addEventListener("click", () => {
        console.log(`editing message ${message_id} in ${channel_id}`);
        editMessageRequest(channel_id, message_id);
        document.getElementById("edit_message").style.display = "none";
    });
}

// Event handlers for message modifications (removing editing pinning reacting)
export const messageOptionHandlers = (channel_id, message_id) => {
    document.getElementById(`remove_msg_${message_id}`).addEventListener('click', () => {
        deleteMessage(channel_id, message_id);
    });

    document.getElementById(`edit_msg_${message_id}`).addEventListener('click', () => {
        createEditMessageForm(channel_id, message_id);
        document.getElementById("edit_message").style.display= "block";
    });

    document.getElementById(`react_msg_${message_id}`).addEventListener('click', () => {
        createReactForm(channel_id, message_id);
        document.getElementById("react_message").style.display = "block";
    });

    document.getElementById(`pin_msg_${message_id}`).addEventListener('click', () => {
        
    });
}