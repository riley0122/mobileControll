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

const saveAuth = () => {
    try {
        setCookie("auth", document.getElementById("auth").value, 31);
        alert("saved!");
    } catch (e) {
        alert("something went wrong saving!");
        console.error(e);
    }
}

document.getElementById("auth").value = getCookie("auth");

const loadFunctions = () => {
    const Http = new XMLHttpRequest();
    const url='/api?action=getAll&auth='+getCookie("auth");
    Http.open("GET", url);
    Http.send();

    Http.onreadystatechange = (e) => {
        document.getElementById("container").innerHTML = '';
        if(Http.status == 200 && Http.readyState == 4){
            console.log(Http.response);
            Object.entries(JSON.parse(Http.response)).forEach((entry) => {
                const [key, value] = entry;
                if(key == "exists"){return}
                let button = document.createElement("button");
                button.textContent = key;
                button.setAttribute("class", "action")
                button.setAttribute("onclick", key + "()")
                document.getElementById("container").appendChild(button);
                document.getElementById("container").appendChild(document.createElement("br"));
                document.getElementById("container").appendChild(document.createElement("br"));
                let script = document.createElement("script");
                script.innerHTML = `
                const ${key} = () => {
                    const Http = new XMLHttpRequest();
                    const url='/api?action=run&auth=${getCookie("auth")}&key=${key}';
                    Http.open("GET", url);
                    Http.send();
                }
                `
                document.body.appendChild(script)
            });
        }else if(Http.status == 401 && Http.readyState == 4){
            alert("unauthorized!");
        }
    }
}