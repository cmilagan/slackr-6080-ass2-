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

export function compare ( a , b ) {
    if ( a.name < b.name ){
        return -1;
    }
    if ( a.name > b.name ){
    return 1;
    }
    return 0;
}