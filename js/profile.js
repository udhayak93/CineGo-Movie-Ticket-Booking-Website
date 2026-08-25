const profileIcon = document.getElementById("profileIcon");
const profileOverlay = document.getElementById("profileOverlay");
const closeProfile = document.getElementById("closeProfile");
const authBtn = document.getElementById("authBtn");
const loginBtn = document.getElementById("loginBtn");
const logoutBtn = document.getElementById("logoutBtn");

profileIcon.addEventListener("click", () => {
    profileOverlay.classList.add("show");

});

closeProfile.addEventListener("click", () => {
    profileOverlay.classList.remove("show");

});

profileOverlay.addEventListener("click", (e) => {
    if (e.target === profileOverlay) {
        profileOverlay.classList.remove("show");

    }

});

function updateProfile() {

    const isLoggedIn = localStorage.getItem("isLoggedIn");
    const avatar = document.getElementById("profileAvatar");
    const loginBtn = document.getElementById("loginBtn");
    const logoutBtn = document.getElementById("logoutBtn");

    if (isLoggedIn === "true") {

        const name = localStorage.getItem("userName");
        const email = localStorage.getItem("userEmail");

        avatar.innerHTML = name.charAt(0).toUpperCase();

        document.getElementById("profileName").textContent = name;
        document.getElementById("profileEmail").textContent = email;

        loginBtn.style.display = "none";
        logoutBtn.style.display = "block";

    } else {

        avatar.innerHTML = '<i class="fa-solid fa-user"></i>';

        document.getElementById("profileName").textContent = "Guest";
        document.getElementById("profileEmail").textContent = "Please Login";

        logoutBtn.style.display = "none";
        loginBtn.style.display = "block";

    }
}


function logout() {

    const email = localStorage.getItem("userEmail");

    if (email && typeof offers !== "undefined") {

        offers.forEach(offer => {

            localStorage.removeItem(
                `claimedOffer_${email}_${offer.code}`
            );

        });

    }


    localStorage.removeItem("isLoggedIn");



    if (typeof resetOfferButtons === "function") {
        resetOfferButtons();
    }


    updateProfile();


    profileOverlay.classList.remove("show");


    showLogin();


    popup.classList.add("show");

}

function showAuth() {
    profileOverlay.classList.remove("show");
    showLogin();
    popup.classList.add("show");

}