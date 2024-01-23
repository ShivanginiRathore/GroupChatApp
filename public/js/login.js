async function validateForm(e) {
    try{
        e.preventDefault();

        let loginDetails = {
            email : document.getElementById('email').value,
            password : document.getElementById('password').value       
        }
        
        const response = await axios.post("/login", loginDetails);
        if(response.status === 200){
            document.body.innerHTML += `<div style="color:green;"> ${response.data.message} </div>`;
            // console.log(response.data);
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('username', response.data.username);
            localStorage.setItem('useremail', response.data.email)

            window.location.href = "../chat"
        }
        else if(response.status === 401){
            document.body.innerHTML += `<div style="color:red;"> ${response.data.message} </div>`;
        } else {
            document.body.innerHTML += `<div style="color:red;"> ${response.data.message} </div>`;
        }
        e.target.email.value = ""
        e.target.password.value = ""
    }
    catch(err) {
        document.body.innerHTML += `<div style="color:red;"> ${err} </div>`;
    }
    
}
