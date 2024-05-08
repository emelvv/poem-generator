
auth_form = document.getElementById('authorization-form')
reg_form = document.getElementById('registration-form')

auth_form.addEventListener('submit', function(event) {
    event.preventDefault();

    xhr = new XMLHttpRequest();
    xhr.open('POST', '/auth', true);

    xhr.onreadystatechange = function() {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                // Handle the response data here
                if (JSON.parse(xhr.responseText).status == 'success') {
                    location.reload()
                }else{
                    alert("Wrong username or password.")
                }
            } else {
                // Handle errors here
                console.error('Request failed with status:', xhr.status);
            }
        }
    };

    // Get the form data and send the request
    let formData = new FormData(this);
    formData.append('type', 'auth')
    xhr.send(formData);

});

reg_form.addEventListener('submit', function(event) {
    event.preventDefault()
    let logCheck = /^[A-Za-z0-9._\-]{6,20}$/
    let passCheck = /^[A-Za-z0-9-_.:;!@()&#]{8,}$/

    username = reg_form.username.value
    pass = reg_form.password.value
    
    if (pass != reg_form.password_r.value){
        alert("passwords don't match");
        return
    }else if (logCheck.test(username)){
        if (!passCheck.test(pass)){
            alert("Password is incorrect.")
            return
        }
    }else{
        alert("Login is incorrect")
        return
    }

    
    xhr = new XMLHttpRequest();
    xhr.open('POST', '/auth', true);

    xhr.onreadystatechange = function() {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                // Handle the response data here
                if (JSON.parse(xhr.responseText).status == 'success') {
                    location.reload()
                }else{
                    alert("This username already exists.")
                }
            } else {
                // Handle errors here
                console.error('Request failed with status:', xhr.status);
            }
        }
    };

    // Get the form data and send the request
    let formData = new FormData(this);
    formData.append('type', 'reg')
    console.log(formData)
    xhr.send(formData);

})

