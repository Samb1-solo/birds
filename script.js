

const submitBtn = document.getElementById("submit");


const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");

const output = document.getElementById("login-page");

const addLocalBirds = document.getElementById("travelling-header");

let username = "apple";
let password = "juice";

const checkInput = ()=>{
       if (usernameInput.value === username && passwordInput.value === password){
        sessionStorage.setItem("loggedIn","true");
        // Set a cookie
        document.cookie = "loggedIn=true; path=/; max-age=86400"; // Expires in 1 day

        output.innerHTML = 
        '<p id="result">You are logged in <a href=" Birds.html"> Click here. </a></p>' ;
        addLocalBirds.innerHTML += '<div class="header-text"><a href="addLocalBirds.html"> Add Bird </a></div>';
       }
            
        else{
            output.innerHTML = '<p id="result">Login failed <a href="login.html"> Click here </a></p>';
        }

     };



submitBtn.addEventListener("click", (event) =>{
event.preventDefault()
checkInput()
});



if (sessionStorage.getItem("loggedIn") === "true" || getCookie("loggedIn") === "true") {
    console.log("User is still logged in!");
    output.innerHTML = '<p>You are still logged in. <a href="Birds.html">Go to Birds Page</a></p>';
}




// Check if the user is logged in
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
}
