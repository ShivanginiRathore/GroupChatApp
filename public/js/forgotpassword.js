async function submitForgotPassword(e) {
    try{
        e.preventDefault();

        var email = document.getElementById('email').value;

        let emailDetails = {
            email : e.target.email.value,
        }
        console.log("before sending response")
        const response = await axios.post("/forgotpassword",emailDetails);
        console.log("response",response)

        if(response.status === 200){
            document.body.innerHTML += `<div style="color:green;"> Reset password link has been sent to your email ID </div>`;
        } 
        if(response.status === 201){
            console.log('inside 404')
            document.body.innerHTML += `<div style="color:red;"> ${response.data.message} </div>`;
        }
    }
    catch(err) {
        console.log("inside catch block");
        document.body.innerHTML += `<div style="color:red;"> ${err} </div>`;
    }
}
