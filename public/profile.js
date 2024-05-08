
function sign_out(){
    const xhr = new XMLHttpRequest();
    xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
            location.reload()
        }
    };
    const json = { "type": "sign_out" };
    xhr.open('POST', '/data');
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(json));
}