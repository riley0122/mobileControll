class action{
    constructor(name="", func=() => {}){
        this.isaction = true;
        this.name = name;
        this.func = func;
    }
}

const newAction = () => {
    console.log("getting")
    const name = document.getElementById("action_name").value;
    const func = eval(document.getElementById("action_func").value)

    const obj = new action(name, func);                                     // Create an object
    const b64 = objectToBase64(obj);

    const log = (res) => {
        console.log(res)
    }

    const checkExists = (res)=>{
        console.log(res)
        if(res.hasOwnProperty(name)){
            return console.error("action already exists with that name!")   // If another function already exists dont create a new one
        }
        callEndpoint(`api?action=set&key=${name}&value=${b64}`, log);
    }

    callEndpoint("api?action=getAll", checkExists);
}

function callEndpoint(endpoint, _callback=()=>{}){
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            let response = xhttp.responseText;
            _callback(response)
        }
    };
    xhttp.open("GET", `${window.location.origin}/${endpoint}`, true);
    xhttp.send();
}


const covertObjectToBinary = (obj) => {
    let output = '',
        input = JSON.stringify(obj) // convert the json to string.
    // loop over the string and convert each charater to binary string.
    for (i = 0; i < input.length; i++) {
        output += input[i].charCodeAt(0).toString(2) + " ";
    }
    return output.trimEnd();
}
  
const convertBinaryToObject = (str) => {
    var newBin = str.split(" ");
    var binCode = [];
    for (i = 0; i < newBin.length; i++) {
        binCode.push(String.fromCharCode(parseInt(newBin[i], 2)));
    }
    let jsonString = binCode.join("");
    return JSON.parse(jsonString)
}
  
const objectToBase64 = (obj) => {
    let bin = covertObjectToBinary(obj);
    let enc = btoa(bin)
    return enc;
}
  
const base64ToObject = (str) => {
    let bin = atob(str)
    let obj = convertBinaryToObject(bin);
    return obj;
}


// get and set cookies from w3schools cuz i'm too lazy to write myself
function setCookie(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    let expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
    let name = cname + "=";
    let ca = document.cookie.split(';');
    for(let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}
