//-------------Login Page ------------

// Get the submit button element from the login form
const submitBtn = document.getElementById("submit");

// Hardcoded username and password for testing (This is insecure for real applications)
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");

// Get the login message output area
const output = document.getElementById("login-page");

// Attach event listener to login button to prevent default form submission
submitBtn.addEventListener("click", (event) =>{
     // Stop the form from refreshing the page
    event.preventDefault()
    // Validate login credentials
    checkInput()
});

// If user is already logged in, keep them logged in and show contribution button
if (sessionStorage.getItem("loggedIn") === "true" || getCookie("loggedIn") === "true") {
    console.log("User is still logged in!");
    output.innerHTML += `
    <p style="display:inline;">
        You are still logged in. 
        <a href="birds.html">
            Go to Birds Page
        </a> 
        Your login will be valid for an hour since you have logged in.
    </p>
     <div id="addButton">
        <label>
            Click on the button to contribute
        </label>
            <button type="button" id="addBird">
                Add
            </button>
    </div>`;

    // Ensure the "Add Bird" button works after dynamic rendering
    setTimeout(() => {
        const addBirdBtn = document.getElementById("addBird");
        if (addBirdBtn) {
            addBirdBtn.addEventListener("click", addBird);
        }
    }, 100); // Small delay ensures button exists before adding event    
}

// Event listener for dynamically added elements (Fixes missing "Add Bird" button issue)
document.addEventListener("click", (event) => {
    if (event.target.id === "addBird") {
        addBird();
    }
});

// Check if the user is logged in
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
};

// Function to log out and remove login status from session
function logout(){
    document.cookie = "loggedIn=; path=/; max-age=0";
    localStorage.removeItem("authToken");
    sessionStorage.clear();
    alert("You have succesfully logged out!");
    window.location.href="index.html";
};
// Function to redirect users to the bird contribution page
function addBird(){
    alert("Be mindful of what you are adding. This is a personal project!");
    window.location.href="add-bird-page.html";
};
// Attach event listener for cancel button to clear form inputs
document.getElementById("cancel-bird").addEventListener("click", () => {
    document.querySelector("form").reset();
});

//-------------------registration page-----------------
// Empty object to store user registration data

let userData = {}

function saveData(){
    // Retrieve existing users from localStorage or initialize an empty array
    let users = JSON.parse(localStorage.getItem("users")) || [];

    // Get password inputs from registration form
    let passwordInput = document.getElementById("register-password-1").value;
    let passwordConfirm = document.getElementById("register-password-2").value;

    // Validate password length
    if (passwordInput.length < 8) {
        alert("Password must containt at least 8 characters.");
        return;
    }

    // Validate password confirmation
    if (passwordInput !== passwordConfirm) {
        alert("Passwords do not match. Please try again.");
        return;
    }

    // Create a new user object with registration details
    let newUser = {
        username: document.getElementById("register-username").value.trim().toLowerCase(),
        email: document.getElementById("register-email").value.toLowerCase(),
        forename: document.getElementById("register-forename").value.toLowerCase(),
        surname: document.getElementById("register-surname").value.toLowerCase(),
        password: btoa(passwordInput) // Encode password for storage
    };
    
    // Check if username already exists in localStorage
    let usernameTaken = users.some(user => user.username === newUser.username);
    if (usernameTaken) {
        alert("Username is already taken. Please choose another.");
        return;
    }

    // Check if email already exists
    let emailTaken = users.some(user => user.email === newUser.email);
    if (emailTaken) {
        alert("It seems that you already have an account. Please log in instead.");
        alert("If you haven't registered yet, please contact us soon and we'll verify your email address.")
        return;
    }

    // Add new user to the list and update localStorage
    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));

    alert("You have successfully registered! You can now log in.");
    window.location.href = "login-page.html";
    
};

// Retrieve Data Function (Fetches from LocalStorage)
/*function retrieveData() {
    let savedData = JSON.parse(localStorage.getItem("userData"));

    if (savedData.length > 0) {
        console.log("Retrieved Data:", savedData);
        return savedData; // You can use this later in login validation
    } else {
        console.log("No user data found.");
        return null;
    }
};*/
function retrieveData() {
    let users = JSON.parse(localStorage.getItem("users")) || [];
    return users;
}


// Example Usage:
let user = retrieveData(); // Call this where needed

//-------------------Login functionality---------------------
//logging in
function login() {
    let username = document.getElementById("login-username").value.toLowerCase();
    let password = document.getElementById("login-password").value;

    // Get all registered users
    let users = JSON.parse(localStorage.getItem("users")) || [];

    // Check if any user matches
    let user = users.find(u => u.username.toLowerCase() === username && atob(u.password) === password);

    if (user) {
        sessionStorage.setItem("loggedIn", "true");
        document.cookie = "loggedIn=true; path=/; max-age=3600"; // Expires in 1 hour
        alert(`Welcome, ${user.username}! Login successful.`);
        window.location.href = "birds-page.html";
    } else {
        alert("Invalid username or password. Please try again.");
    }
};

//--------------  Submitting birds sightings -------------------

// Event listener for submitting bird contribution form
document.getElementById("submit-bird").addEventListener("click",(event)=>{

    //Prevents default form submission
    event.preventDefault();

    // Function to capitalize the first letter of a string
    function capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    };

    // Get image file input
    let imageInput = document.getElementById("bird-image").files[0];

    // Ensure an image is uploaded before proceeding
    if(!imageInput){
        alert("Please upload an image of the bird.");
        return;
    };

    // Read the image file as Base64
    let reader = new FileReader();
    reader.readAsDataURL(imageInput);
    reader.onload = ()=> {
        //Collecting form data
        let birdData = {
        userName: document.getElementById("bird-username").value,
        birdName: document.getElementById("bird-name").value,
        birdPlace: document.getElementById("bird-place").value,
        birdInfo: document.getElementById("bird-info").value,
        category:document.getElementById("bird-category").value,// Bird category
        image: reader.result // Store Base64 image data

        };

        //Store data in LocalStorage
        localStorage.setItem("birdContribution", JSON.stringify(birdData));

        alert("Your bird contribution has been submitted succesfully! Thank you. We will review it and add it to the birds page.")
    
        // Redirect user based on selected category
        if (birdData.category === "herons") {
        window.location.href = "heron-page.html";
        } else if (birdData.category === "local") {
        window.location.href = "local-birds.html";
        } else if (birdData.category === "travelling") {
        window.location.href = "travelling-birds.html";
        }
    };

    reader.onerror = (error) => {
        console.error("Error reading image file:", error);
        alert("There was an error uploading the image. Please try again.");
    };

    
document.addEventListener("DOMContentLoaded", () => {
    let birdData = JSON.parse(localStorage.getItem("birdContribution"));

    // Check if birdData exists before querying the DOM
    if (!birdData || !birdData.category) {
        document.querySelector("main").innerHTML = "<p>No bird sightings have been shared yet.</p>";
        return;
    }

    let mainContent = document.querySelector(`#${birdData.category}-main`);
    
    if (mainContent) {
        mainContent.innerHTML = `
            <h2>Bird Contribution Details</h2>
            <p><strong>Name:</strong> ${birdData.userName}</p>
            <p><strong>Bird Species:</strong> ${birdData.birdName}</p>
            <p><strong>Spotted At:</strong> ${birdData.birdPlace}</p>
            <p><strong>Observation:</strong> ${birdData.birdInfo}</p>
            <img src="${birdData.image}" alt="Bird Image" style="max-width:100%; height:auto;">
            <button id="cancel-contribution">Cancel Contribution</button>
        `;
    }

    // Use event delegation for cancel button to work dynamically
    document.addEventListener("click", (event) => {
        if (event.target.id === "cancel-contribution") {
            let loggedInUser = sessionStorage.getItem("loggedIn");

            if (!loggedInUser) {
                alert("You must be logged in to cancel a contribution.");
                return;
            }

            if (birdData) {
                localStorage.removeItem("birdContribution"); // Remove saved contribution
                alert("Your bird contribution has been canceled.");
                location.reload(); // Refresh page after cancellation
            } else {
                alert("No bird contribution found to cancel.");
            }
        }
    });

    // Reset the form correctly
    let formElement = document.querySelector("form");
    if (formElement) {
        formElement.reset();
    }
});
})


