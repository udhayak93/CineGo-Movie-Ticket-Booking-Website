const popup = document.getElementById("authPopup");
const loginForm = document.querySelector(".login-form");
const signupForm = document.querySelector(".signup-form");

function closeAuth() {
    popup.classList.remove("show");
}

function showLogin() {
    loginForm.classList.remove("d-none");
    signupForm.classList.add("d-none");

    document.querySelectorAll(".tab-btn")[0].classList.add("active");
    document.querySelectorAll(".tab-btn")[1].classList.remove("active");
}

function showSignup() {
    signupForm.classList.remove("d-none");
    loginForm.classList.add("d-none");

    document.querySelectorAll(".tab-btn")[1].classList.add("active");
    document.querySelectorAll(".tab-btn")[0].classList.remove("active");
}


/* ==========================
        SIGNUP
========================== */

signupForm.addEventListener("submit", function (e) {

    e.preventDefault();

    const name =
        signupForm.querySelector('input[type="text"]').value.trim();

    const email =
        signupForm.querySelector('input[type="email"]').value.trim();

    const password =
        signupForm.querySelectorAll('input[type="password"]')[0].value;

    const confirm =
        signupForm.querySelectorAll('input[type="password"]')[1].value;

    if (password !== confirm) {

        alert("Passwords do not match");
        return;

    }

    let users =
        JSON.parse(localStorage.getItem("users")) || [];

    const alreadyExists =
        users.find(user => user.email === email);

    if (alreadyExists) {

        alert("Account already exists. Please Login.");
        return;

    }

    users.push({
        name,
        email,
        password
    });

    localStorage.setItem("users", JSON.stringify(users));

    alert("Account Created Successfully");

    signupForm.reset();

    showLogin();

});


/* ==========================
        LOGIN
========================== */

loginForm.addEventListener("submit", function (e) {

    e.preventDefault();

    const email =
        loginForm.querySelector('input[type="email"]').value.trim();

    const password =
        loginForm.querySelector('input[type="password"]').value.trim();

    const users =
        JSON.parse(localStorage.getItem("users")) || [];

    const user =
        users.find(
            u =>
                u.email === email &&
                u.password === password
        );

    if (!user) {

        alert("Invalid Email or Password");
        return;

    }

    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("userName", user.name);
    localStorage.setItem("userEmail", user.email);
    localStorage.setItem("rememberMe", rememberMe.checked);

    closeAuth();

    updateProfile();

    if (typeof renderOffers === "function") {
        renderOffers();
    }

});


/* ==========================
        WINDOW LOAD
========================== */

window.addEventListener("load", () => {

    updateProfile();

    if (typeof renderOffers === "function") {
        renderOffers();
    }

    if (localStorage.getItem("isLoggedIn") !== "true") {

        setTimeout(() => {

            popup.classList.add("show");

        }, 3000);

    }

});


/* ==========================
    FORGOT PASSWORD
========================== */

const rememberMe =
    document.getElementById("rememberMe");

const forgotPassword =
    document.getElementById("forgotPassword");

forgotPassword.addEventListener("click", function (e) {

    e.preventDefault();

    const email =
        prompt("Enter your registered email");

    const users =
        JSON.parse(localStorage.getItem("users")) || [];

    const user =
        users.find(u => u.email === email);

    if (user) {

        alert("Demo: Password reset link sent to your email.");

    } else {

        alert("Email not found.");

    }

});