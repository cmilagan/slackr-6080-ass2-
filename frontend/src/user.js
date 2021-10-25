import { 
    fileToDataUrl,
    errorPopUp,
    unload,
    calculateTimeDate,
} from './helpers.js';

/**
 * Given a users id get the users details
 * @param {*} id
 */
export const getUserDetails = (id, promise_list) => {
    const token = localStorage.getItem('token');
    const requestOptions = {
        method: 'GET',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token,
            'userId': id,
        },
    };

    promise_list.push(
        fetch('http://localhost:5005/user/' + id, requestOptions).then(response => {
            if(response.ok) {
                return response.json();
            } else {
                response.json().then(data => {
                    errorPopUp(data["error"]);
                })
            }
    
        })
    );
}

/**
 * Get the basic details of all users and store them in a promise list
 * @param {*} promise_list 
 */
const getAllUsers = (promise_list) => {
    const token = localStorage.getItem('token');
    const requestOptions = {
        method: 'GET',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token,
        },
    };

    promise_list.push(
        fetch('http://localhost:5005/user', requestOptions).then(response => {
            if(response.ok) {
                return response.json();
            } else {
                response.json().then(data => {
                    errorPopUp(data["error"]);
                })
            }
        })
    );
}

const updateDetailsRequest = (email, password, bio, name, image) => {
    const token = localStorage.getItem('token');
    const url = `http://localhost:5005/user`;
    let update = {
        password: password,
        name: name,
        bio: bio,
        image: image,
    };
    if (email !== localStorage.getItem('email')) {
        update["email"] = email;
    }

    const jsonString = JSON.stringify(update);

    const requestOptions = {
        method: 'PUT',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token,
        },
        body: jsonString,
    };

    fetch(url, requestOptions).then(response => {
        if (response.ok) {
            errorPopUp("User details successfully updated");
            document.getElementById("view_personal_profile").style.display = "none";
            document.getElementById("users_bio").value = bio;
            document.getElementById("users_name").value = name;
            document.getElementById("new_password").value = "";
            if (image !== "") {
                document.getElementById("personal_profile_image").src = image;
            } else {
                document.getElementById("personal_profile_image").src = "../assets/default_profile.jpeg";
            }
            if (email !== localStorage.getItem('email')) {
                document.getElementById("users_email").value = email;
            }
        } else {
            response.json().then(data => {
                errorPopUp(data["error"]);
            })
        }
    });

}

export const updateUserDetails = () => {
    const email = document.getElementById("users_email").value;
    let password = document.getElementById("new_password").value;
    const bio = document.getElementById("users_bio").value;
    const name = document.getElementById("users_name").value;

    if (password === "") {
        password = document.getElementById("users_password").value;
    }
    let image;
    if (document.getElementById("update_profile_pic").files[0] !== undefined) {
        fileToDataUrl(document.getElementById("update_profile_pic").files[0]).then(data => {
            image = data;
            updateDetailsRequest(email, password, bio, name, image);
            document.getElementById("update_profile_pic").value = "";
        });
    } else {
        image = "";
        updateDetailsRequest(email, password, bio, name, image);
    }
}


/**
 * Gets the details of the currently logged in user via localstorage comparisons
 */
export const getLoggedInUserDetails = () => {
    const user_list = [];
    getAllUsers(user_list);
    Promise.all(user_list).then(response => {
        const logged_in_user_details = [];
        let result = response[0]["users"].filter(user => {
            return user.email === localStorage.getItem('email');
        })
        getUserDetails(result[0].id, logged_in_user_details)

        return Promise.all(logged_in_user_details);
    }).then(data => {
        if (data[0].image !== null && data[0].image !== "") {
            document.getElementById("personal_profile_image").src = data[0].image;
        } else {
            document.getElementById("personal_profile_image").src = "../assets/default_profile.jpeg";
        }
        document.getElementById("personal_profile_header").innerText = `${data[0].name}'s profile :D`;
        document.getElementById("users_password").value = localStorage.getItem('password');
        document.getElementById("users_name").value = data[0].name;
        document.getElementById("users_bio").value = data[0].bio;
        document.getElementById("users_email").value = localStorage.getItem('email');
    });
}


/**
 * Invites a user by their user_id
 * @param {*} user_id 
 */
const inviteUser = (user_id) => {
    const token = localStorage.getItem('token');
    const channel_id = document.getElementById("display_id").value;
    const url = `http://localhost:5005/channel/${channel_id}/invite`;

    const jsonString = JSON.stringify({
        userId: user_id,
    });

    const requestOptions = {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token,
        },
        path : {
            'channelId': channel_id,
        },
        body : jsonString,
    };
    
    fetch(url, requestOptions).then(response => {
        if (response.ok) {
            errorPopUp("Users successfully invited");
        } else {
            response.json().then(data => {
                errorPopUp(data["error"]);
            })
        }
    });
}

// creates checklist to invite multiple users at once.
const createUserCheckList = (user_id, user_name) => {

    const list = document.getElementById('user_list');
    const user_container = document.createElement("div");
    user_container.style.display = "flex";
    user_container.style.justifyContent = "space-between";
    user_container.style.width = "75%";
    const new_checkbox = document.createElement("input");
    new_checkbox.type = "checkbox";
    new_checkbox.id = `invite_${user_name}_${user_id}`;
    const new_label = document.createElement("label");
    new_label.for = `invite_${user_name}_${user_id}`;
    new_label.innerText = `${user_name}`;

    user_container.appendChild(new_label);
    user_container.appendChild(new_checkbox);

    list.appendChild(user_container);

    document.getElementById('invite_submit').addEventListener('click', () => {
        if (document.getElementById(`invite_${user_name}_${user_id}`).checked === true) {
            inviteUser(user_id);
        }
    });

}

/**
 * Generate the userlist to the invite users modal
 */
export function generateUserList() {    
    const user_list = [];
    const user_ids = [];
    getAllUsers(user_list);
    Promise.all(user_list).then(response => {
        const user_details_list = [];
        response[0]["users"].map(user => {
            user_ids.push(user.id);
            getUserDetails(user.id, user_details_list);
        })

        return Promise.all(user_details_list);
    }).then(data => {
        let sorted_data = [];
        for (let i = 0; i < user_ids.length; i++) {
            sorted_data.push({id: user_ids[i], name: data[i]["name"]});
        }
        
        sorted_data.sort((a,b) => (a.name > b.name) ? -1 : ((b.name > a.name) ? 1 : 0));
        for (let i = 0; i < sorted_data.length; i++) {
            createUserCheckList(sorted_data[i].id, sorted_data[i].name);
        }
    });
}

