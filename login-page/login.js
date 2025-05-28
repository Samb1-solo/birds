const submitBtn = document.getElementById("submit");


const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");

const output = document.getElementById("login-page");

let username = "apple";
let password = "juice";

const checkInput = ()=>{
       if (usernameInput.value ==username && passwordInput.value ==password){
        output.innerHTML = '<p id="result">You are logged in <a href=" Birds.html"> Click here. </a></p>' ;
       }
            
        else{
            output.innerHTML = '<p id="result">Login failed <a href="login.html"> Click here </a></p>';
        }

     };



submitBtn.addEventListener("click", (event) =>{
event.preventDefault()
checkInput()
});