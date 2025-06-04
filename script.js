document.addEventListener("DOMContentLoaded", () => {
    // Handle cancel contribution
    document.addEventListener("click", (event) => {
        if (event.target && event.target.id === "cancel-contribution") {
            if (isLoggedIn()) {
                localStorage.removeItem("birdContribution");
                alert("Contribution canceled.");
                window.location.href = "add-bird-page.html";
            } else {
                alert("You must be logged in to cancel a contribution.");
            }
        }
    });

    // Handle already-logged-in message
    const output = document.getElementById("login-page");
    if (output && isLoggedIn()) {
        output.innerHTML = `
            <p>You are still logged in. <a href="birds.html">Go to Birds Page</a>.</p>
            <div>
                <label>Click to contribute</label>
                <button type="button" id="addBird">Add</button>
            </div>
        `;
    }

    // Password reset functionality
    const form = document.getElementById("password-form");
    if (form) {
        form.addEventListener("submit", (e) => {
            e.preventDefault();

            const username = document.getElementById("username").value.trim().toLowerCase();
            const forename = document.getElementById("forename").value.trim().toLowerCase();
            const email = document.getElementById("email").value.trim().toLowerCase();
            const password1 = document.getElementById("password-1").value;
            const password2 = document.getElementById("password-2").value;

            const users = JSON.parse(localStorage.getItem("users")) || [];

            if (password1.length < 8) {
                alert("Password must be at least 8 characters.");
                return;
            }

            if (password1 !== password2) {
                alert("Passwords do not match.");
                return;
            }

            const userIndex = users.findIndex(user =>
                user.username === username &&
                user.forename === forename &&
                user.email === email
            );

            if (userIndex === -1) {
                alert("User not found. Please make sure your details are correct.");
                return;
            }

            users[userIndex].password = btoa(password1);
            localStorage.setItem("users", JSON.stringify(users));

            alert("Password reset successful. You can now log in.");
            window.location.href = "login-page.html";
        });
    }

    // Login button
    const loginBtn = document.getElementById("submit");
    if (loginBtn) {
        loginBtn.addEventListener("click", (e) => {
            e.preventDefault();
            login();
        });
    }

    // Registration button
    const registerBtn = document.getElementById("register-submit");
    if (registerBtn) {
        registerBtn.addEventListener("click", (e) => {
            e.preventDefault();
            saveData();
        });
    }

    // Cancel bird form
    const cancelBtn = document.getElementById("cancel-bird");
    if (cancelBtn) {
        cancelBtn.addEventListener("click", () => {
            const form = document.querySelector("form");
            if (form) form.reset();
        });
    }

    // Add bird form
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

    // Render bird contribution if it exists
    const birdData = JSON.parse(localStorage.getItem("birdContribution"));
    if (birdData) {
        const main = document.querySelector(`#${birdData.category}-main`);
        if (main) {
            const container = document.createElement("div");
            container.className = "bird-pages";
            container.innerHTML = `
                <h2><strong>Species:</strong> ${sanitize(birdData.birdName)}</h2>
                <p><strong>Name:</strong> ${sanitize(birdData.userName)}</p>
                <p><strong>Location:</strong> ${sanitize(birdData.birdPlace)}</p>
                <p><strong>Notes:</strong> ${sanitize(birdData.birdInfo)}</p>
                <img src="${birdData.image}" style="max-width: 100%; height: auto;">
                <button id="cancel-contribution">Cancel Contribution</button>
            `;
            main.appendChild(container);
        }
    }
});
