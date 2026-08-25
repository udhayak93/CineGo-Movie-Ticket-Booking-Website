function theme() {

    const themeBtn = document.querySelector(".theme-btn");

    if (!themeBtn) return;

    // Apply saved theme
    if (localStorage.getItem("theme") === "light") {
        document.body.classList.add("light-mode");
    }

    themeBtn.addEventListener("click", () => {

        document.body.classList.toggle("light-mode");

        // Save theme
        if (document.body.classList.contains("light-mode")) {
            localStorage.setItem("theme", "light");
        } else {
            localStorage.setItem("theme", "dark");
        }

    });

}

theme();