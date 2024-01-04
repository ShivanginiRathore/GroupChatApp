async function validateForm(e) {
   try{
    e.preventDefault();

    var name = document.getElementById('name').value;
    var email = document.getElementById('email').value;
    var password = document.getElementById('password').value;
    var phoneNumber = document.getElementById('phoneNumber').value;

    let signUpDetails = {
        name,
        email,
        password,
        phoneNumber
    }
    // console.log('User details are----',myObj);
    const response = await axios.post("/signup",signUpDetails)
    // console.log("response is --------------------- ",response.status);
    if(response.status === 201){
        document.body.innerHTML += `<div style="color:green;"> New user added successfully </div>`;
    }
    e.target.name.value = ""
    e.target.email.value = ""
    e.target.password.value = ""
    e.target.phoneNumber.value = ""

   }
   catch(err){
        document.body.innerHTML += `<div style="color:red;"> ${err} </div>`;
   }
}
