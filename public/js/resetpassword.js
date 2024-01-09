document.getElementById("resetForm").addEventListener("submit", async function (event) {
    event.preventDefault();
    
    try{
        const newPassword = document.getElementById("newPassword").value;
        let passwordDetails = {
            newPassword
        }

        const response = await axios.post("/updatePassword", passwordDetails);
        
        if(response.status === 201){
            document.body.innerHTML += `<div style="color:green;"> password updated </div>`;
        }
    }catch(err){
        document.body.innerHTML += `<div style="color:red;"> ${err} </div>`;
    }
});
