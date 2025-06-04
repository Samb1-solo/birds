function sanitize(str) {
    return str.replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
    return null;
}

function logout() {
    document.cookie = "loggedIn=; path=/; max-age=0";
    sessionStorage.clear();
    alert("You have successfully logged out!");
    window.location.href = "index.html";
}

function addBird() {
    window.location.href = "add-bird-page.html";
}

function saveData() {
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const password = document.getElementById("register-password-1").value;
    const confirm = document.getElementById("register-password-2").value;

    if (password.length < 8) {
        alert("Password must contain at least 8 characters.");
        return;
    }

    if (password !== confirm) {
        alert("Passwords do not match.");
        return;
    }

    const newUser = {
        username: sanitize(document.getElementById("register-username").value.trim().toLowerCase()),
        email: sanitize(document.getElementById("register-email").value.toLowerCase()),
        forename: sanitize(document.getElementById("register-forename").value.toLowerCase()),
        surname: sanitize(document.getElementById("register-surname").value.toLowerCase()),
        password: btoa(password)
    };

    if (users.some(user => user.username === newUser.username)) {
        alert("Username is already taken.");
        return;
    }

    if (users.some(user => user.email === newUser.email)) {
        alert("This email is already registered. Please log in.");
        return;
    }

    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));
    alert("Registration successful! You can now log in.");
    window.location.href = "login-page.html";
}

function login() {
    const username = document.getElementById("login-username").value.toLowerCase();
    const password = document.getElementById("login-password").value;
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const user = users.find(u => u.username === username && atob(u.password) === password);

    if (user) {
        sessionStorage.setItem("loggedIn", "true");
        document.cookie = "loggedIn=true; path=/; max-age=3600";
        alert(`Welcome, ${user.username}!`);
        window.location.href = "birds-page.html";
    } else {
        alert("Invalid username or password.");
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const output = document.getElementById("login-page");

    if (output && (sessionStorage.getItem("loggedIn") === "true" || getCookie("loggedIn") === "true")) {
        output.innerHTML = `
            <p>You are still logged in. <a href="birds.html">Go to Birds Page</a>.</p>
            <div>
                <label>Click to contribute</label>
                <button type="button" id="addBird">Add</button>
            </div>
        `;
    }

    document.addEventListener("click", (event) => {
        if (event.target.id === "addBird") {
            addBird();
        }
        if (event.target.id === "cancel-contribution") {
            if (sessionStorage.getItem("loggedIn") === "true") {
                localStorage.removeItem("birdContribution");
                alert("Contribution canceled.");
                location.reload();
            } else {
                alert("You must be logged in to cancel a contribution.");
            }
        }
    });

    const loginBtn = document.getElementById("submit");
    if (loginBtn) {
        loginBtn.addEventListener("click", (e) => {
            e.preventDefault();
            login();
        });
    }

    const registerBtn = document.getElementById("register-submit");
    if (registerBtn) {
        registerBtn.addEventListener("click", (e) => {
            e.preventDefault();
            saveData();
        });
    }

    const cancelBtn = document.getElementById("cancel-bird");
    if (cancelBtn) {
        cancelBtn.addEventListener("click", () => {
            const form = document.querySelector("form");
            if (form) form.reset();
        });
    }

    const birdForm = document.getElementById("add-bird-form");
    if (birdForm) {
        birdForm.addEventListener("submit", (event) => {
            event.preventDefault();

            const imageInput = document.getElementById("bird-image").files[0];
            if (!imageInput) {
                alert("Please upload an image.");
                return;
            }

            const reader = new FileReader();
            reader.onload = () => {
                const birdData = {
                    userName: sanitize(document.getElementById("bird-username").value),
                    birdName: sanitize(document.getElementById("bird-name").value),
                    birdPlace: sanitize(document.getElementById("bird-place").value),
                    birdInfo: sanitize(document.getElementById("bird-info").value),
                    category: document.getElementById("bird-category").value,
                    image: reader.result
                };

                localStorage.setItem("birdContribution", JSON.stringify(birdData));
                alert("Bird contribution submitted!");

                const redirectMap = {
                    herons: "heron-page.html",
                    local: "local-birds.html",
                    travelling: "travelling-birds.html"
                };
                window.location.href = redirectMap[birdData.category] || "birds-page.html";
            };

            reader.onerror = (err) => {
                console.error("Image upload failed:", err);
                alert("Failed to upload image. Try again.");
            };

            reader.readAsDataURL(imageInput);
        });
    }

    // Render bird data if it exists
    const birdData = JSON.parse(localStorage.getItem("birdContribution"));
    if (birdData) {
        const main = document.querySelector(`#${birdData.category}-main`);
        if (main) {
            main.innerHTML = `
                <h2>Bird Contribution Details</h2>
                <p><strong>Name:</strong> ${sanitize(birdData.userName)}</p>
                <p><strong>Species:</strong> ${sanitize(birdData.birdName)}</p>
                <p><strong>Location:</strong> ${sanitize(birdData.birdPlace)}</p>
                <p><strong>Notes:</strong> ${sanitize(birdData.birdInfo)}</p>
                <img src="${birdData.image}" style="max-width: 100%; height: auto;">
                <button id="cancel-contribution">Cancel Contribution</button>
            `;
        }
    }
});
