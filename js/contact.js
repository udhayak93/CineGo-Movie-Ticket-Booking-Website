document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("cinegoContactForm");

    const categories = document.querySelectorAll(".support-category");
    const categoryInput = document.getElementById("supportCategory");

    const name = document.getElementById("fullName");
    const email = document.getElementById("email");
    const mobile = document.getElementById("mobile");
    const message = document.getElementById("message");

    const success = document.getElementById("contactSuccess");


    // ==========================
    // Category
    // ==========================

    categories.forEach((category) => {

        category.addEventListener("click", () => {

            categories.forEach((item) => {
                item.classList.remove("active");
            });

            category.classList.add("active");

            categoryInput.value =
                category.dataset.category;

        });

    });


    // ==========================
    // Form Submit
    // ==========================

    form.addEventListener("submit", (e) => {

        e.preventDefault();

        const nameValue = name.value.trim();
        const emailValue = email.value.trim();
        const mobileValue = mobile.value.trim();
        const messageValue = message.value.trim();


        // Basic validation

        if (nameValue === "") {
            alert("Please enter your name.");
            name.focus();
            return;
        }


        if (emailValue === "") {
            alert("Please enter your email.");
            email.focus();
            return;
        }


        if (mobileValue === "") {
            alert("Please enter your mobile number.");
            mobile.focus();
            return;
        }


        if (messageValue === "") {
            alert("Please enter your message.");
            message.focus();
            return;
        }
        success.classList.add("show");

        form.reset();


        categories.forEach((item) => {
            item.classList.remove("active");
        });

        categoryInput.value = "";

    });

});