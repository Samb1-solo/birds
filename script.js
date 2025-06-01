

const submitBtn = document.getElementById("submit");


const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");

const output = document.getElementById("login-page");


let username = "orange";
let password = "juice";

const checkInput = ()=>{
       if (usernameInput.value === username && passwordInput.value === password){
        sessionStorage.setItem("loggedIn","true");
        // Set a cookie
        document.cookie = "loggedIn=true; path=/; max-age=3600"; // Expires in 1 day

        output.innerHTML = 
        '<p id="result">You are logged in <a href=" birds-page.html"> Click here. </a> Your login will be valid for an hour.</p>'
        + '<div id="addButton"><label>Click on the button to contribute</label><button type="button" onClick="addBird()">Add</button></div>';
        
       
        }
            
        else{
            output.innerHTML = '<p id="result">Login failed <a href="login-page.html"> Click here </a></p>';
        }

     };



submitBtn.addEventListener("click", (event) =>{
event.preventDefault()
checkInput()
});



if (sessionStorage.getItem("loggedIn") === "true" || getCookie("loggedIn") === "true") {
    console.log("User is still logged in!");
    output.innerHTML = '<p style="display:inline;">You are still logged in. <a href="birds.html">Go to Birds Page</a> Your login will be valid for an hour since you have logged in.</p>'
     + '<div id="addButton"><label>Click on the button to contribute</label><button type="button" onClick="addBird()">Add</button></div>';
}




// Check if the user is logged in
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
}

function logout(){
    document.cookie = "loggedIn=; path=/; max-age=0";
    localStorage.removeItem("authToken");
    sessionStorage.clear();
    alert("You have succesfully logged out!");
    window.location.href="/index.html";
}
function addBird(){
    alert("Be mindful of what you are adding. This is a personal project!");
    window.location.href="/add-bird-page.html";
}

document.getElementById("cancel-bird").addEventListener("click", () => {
    document.querySelector("form").reset();
});
