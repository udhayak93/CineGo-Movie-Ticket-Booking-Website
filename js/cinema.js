

/* =========================================================
                    DOM ELEMENTS
========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    const cinemaLocation =
        document.getElementById("cinemaLocation");

    const cinemaSearchInput =
        document.getElementById("cinemaSearchInput");

    const cinemaExperience =
        document.getElementById("cinemaExperience");

    const cinemaSearchBtn =
        document.querySelector(".cinema-search-btn");

    const cinemaCards =
        document.querySelectorAll(".theater-card");


    /* =====================================================
                    POPULAR CINEMA SECTION
    ===================================================== */

    const popularSection =
        document.querySelector(".main-theater");


    const sectionTitle =
        popularSection
            ? popularSection.querySelector(".section-title")
            : null;


    const viewAllBtn =
        sectionTitle
            ? sectionTitle.querySelector("a")
            : null;


    /* =====================================================
                    SETTINGS
    ===================================================== */

    const initialCardCount = 3;

    let showAllCinemas = false;


    /* =====================================================
                    DEBUG
    ===================================================== */

    console.log(
        "Cinema cards:",
        cinemaCards.length
    );

    console.log(
        "View All button:",
        viewAllBtn
    );


    /* =====================================================
                    GET CARD INFORMATION
    ===================================================== */

    function getCinemaData(card) {

        const nameElement =
            card.querySelector("h5");


        const addressElement =
            card.querySelector("p");


        const experienceElement =
            card.querySelector(".experience");


        const name =
            nameElement
                ? nameElement.innerText.toLowerCase()
                : "";


        const address =
            addressElement
                ? addressElement.innerText.toLowerCase()
                : "";


        const experience =
            experienceElement
                ? experienceElement.innerText.toLowerCase()
                : card.innerText.toLowerCase();


        return {
            name,
            address,
            experience
        };

    }


    /* =====================================================
                    GET SEARCH VALUE
    ===================================================== */

    function getSearchValue() {

        if (!cinemaSearchInput) {

            return "";

        }


        return cinemaSearchInput.value
            .toLowerCase()
            .trim();

    }


    /* =====================================================
                    GET LOCATION
    ===================================================== */

    function getLocationValue() {

        if (!cinemaLocation) {

            return "all";

        }


        return cinemaLocation.value
            .toLowerCase()
            .trim();

    }


    /* =====================================================
                    GET EXPERIENCE
    ===================================================== */

    function getExperienceValue() {

        if (!cinemaExperience) {

            return "all";

        }


        return cinemaExperience.value
            .toLowerCase()
            .trim();

    }


    /* =====================================================
                    NO RESULT MESSAGE
    ===================================================== */

    function showNoResult(show) {

        const cardsContainer =
            document.querySelector(".cards");


        if (!cardsContainer) {

            return;

        }


        let noResult =
            document.getElementById(
                "noCinemaResult"
            );


        if (show) {

            if (!noResult) {

                noResult =
                    document.createElement("div");


                noResult.id =
                    "noCinemaResult";


                noResult.innerHTML = `
                    <div class="no-cinema-box">

                        <i class="fa-solid fa-film"></i>

                        <h3>
                            No Cinemas Found
                        </h3>

                        <p>
                            Try changing your search
                            or filter.
                        </p>

                    </div>
                `;


                cardsContainer.appendChild(
                    noResult
                );

            }


            noResult.style.display =
                "block";

        }

        else {

            if (noResult) {

                noResult.style.display =
                    "none";

            }

        }

    }


    /* =====================================================
                    UPDATE VIEW BUTTON
    ===================================================== */

    function updateViewButton() {

        if (!viewAllBtn) {

            return;

        }


        const searchText =
            getSearchValue();


        const experience =
            getExperienceValue();

        if (
            searchText !== "" ||
            experience !== "all"
        ) {

            viewAllBtn.style.display =
                "none";

            return;

        }


        /*
            Normal state
            -> show button
        */

        viewAllBtn.style.display =
            "inline-flex";


        if (showAllCinemas) {

            viewAllBtn.innerHTML =
                `View Less`;

        }

        else {

            viewAllBtn.innerHTML =
                `View All`;

        }

    }


    /* =====================================================
                    RENDER CINEMAS
    ===================================================== */

    function renderCinemas() {

        const searchText =
            getSearchValue();


        const location =
            getLocationValue();


        const experience =
            getExperienceValue();


        const matchedCards = [];


        /* =================================================
                    FIND MATCHING CINEMAS
        ================================================= */

        cinemaCards.forEach(function (card) {

            const data =
                getCinemaData(card);


            /* ---------------------------------------------
                        SEARCH
            --------------------------------------------- */

            const searchMatch =
                searchText === "" ||
                data.name.includes(searchText) ||
                data.address.includes(searchText);


            /* ---------------------------------------------
                        LOCATION
            --------------------------------------------- */

            let locationMatch = true;


            if (
                location !== "" &&
                location !== "all"
            ) {

                locationMatch =
                    data.address.includes(location);

            }


            /* ---------------------------------------------
                        EXPERIENCE
            --------------------------------------------- */

            let experienceMatch = true;


            if (
                experience !== "" &&
                experience !== "all"
            ) {

                experienceMatch =
                    data.experience.includes(
                        experience
                    );

            }


            /* ---------------------------------------------
                        FINAL MATCH
            --------------------------------------------- */

            if (
                searchMatch &&
                locationMatch &&
                experienceMatch
            ) {

                matchedCards.push(card);

            }

        });


        /* =================================================
                    HIDE ALL CARDS FIRST
        ================================================= */

        cinemaCards.forEach(function (card) {

            card.style.display = "none";

        });


        /* =================================================
                    SEARCH / FILTER ACTIVE
        ================================================= */

        const filterActive =
            searchText !== "" ||
            experience !== "all";


        if (filterActive) {

            /*
                Search/filter:
                show every matching card
            */

            matchedCards.forEach(function (card) {

                card.style.display = "";

            });

        }


        /* =================================================
                    NORMAL VIEW
        ================================================= */

        else {

            if (showAllCinemas) {

                matchedCards.forEach(
                    function (card) {

                        card.style.display = "";

                    }
                );

            }


            /*
                View Less
            */

            else {

                matchedCards
                    .slice(0, initialCardCount)
                    .forEach(function (card) {

                        card.style.display = "";

                    });

            }

        }


        /* =================================================
                    NO RESULT
        ================================================= */

        showNoResult(
            matchedCards.length === 0
        );


        /* =================================================
                    BUTTON
        ================================================= */

        updateViewButton();

    }


    /* =====================================================
                    VIEW ALL / VIEW LESS
    ===================================================== */

    if (viewAllBtn) {

        viewAllBtn.addEventListener(
            "click",
            function (event) {

                event.preventDefault();


                showAllCinemas =
                    !showAllCinemas;


                renderCinemas();

            }
        );

    }


    /* =====================================================
                    SEARCH BUTTON
    ===================================================== */

    if (cinemaSearchBtn) {

        cinemaSearchBtn.addEventListener(
            "click",
            function () {

                renderCinemas();

            }
        );

    }


    /* =====================================================
                    LIVE SEARCH
    ===================================================== */

    if (cinemaSearchInput) {

        cinemaSearchInput.addEventListener(
            "input",
            function () {

                /*
                    Search cleared
                    -> reset to first 3
                */

                if (
                    cinemaSearchInput.value
                        .trim() === ""
                ) {

                    showAllCinemas = false;

                }


                renderCinemas();

            }
        );

    }


    /* =====================================================
                    ENTER KEY SEARCH
    ===================================================== */

    if (cinemaSearchInput) {

        cinemaSearchInput.addEventListener(
            "keydown",
            function (event) {

                if (
                    event.key === "Enter"
                ) {

                    event.preventDefault();

                    renderCinemas();

                }

            }
        );

    }


    /* =====================================================
                    LOCATION FILTER
    ===================================================== */

    if (cinemaLocation) {

        cinemaLocation.addEventListener(
            "change",
            function () {

                renderCinemas();

            }
        );

    }


    /* =====================================================
                    EXPERIENCE FILTER
    ===================================================== */

    if (cinemaExperience) {

        cinemaExperience.addEventListener(
            "change",
            function () {

                renderCinemas();

            }
        );

    }


    /* =====================================================
                    VIEW DETAILS
    ===================================================== */

    const detailsButtons =
        document.querySelectorAll(
            ".theater-card button"
        );


    detailsButtons.forEach(
        function (button) {

            button.addEventListener(
                "click",
                function () {

                    const card =
                        button.closest(
                            ".theater-card"
                        );


                    if (!card) {

                        return;

                    }


                    const nameElement =
                        card.querySelector("h5");


                    const addressElement =
                        card.querySelector("p");


                    const cinemaName =
                        nameElement
                            ? nameElement.innerText
                            : "Cinema";


                    const cinemaAddress =
                        addressElement
                            ? addressElement.innerText
                            : "Location unavailable";


                    alert(
                        "Cinema: " +
                        cinemaName +
                        "\n\nLocation: " +
                        cinemaAddress
                    );

                }
            );

        }
    );


    /* =====================================================
                    FEATURED CINEMA - VIEW SHOWS
    ===================================================== */

    const viewShowsButtons =
        document.querySelectorAll(
            ".cinema-primary-btn"
        );


    viewShowsButtons.forEach(
        function (button) {

            button.addEventListener(
                "click",
                function () {

                    const card =
                        button.closest(
                            ".cinema-card"
                        );


                    if (!card) {

                        return;

                    }


                    const nameElement =
                        card.querySelector("h3");


                    const cinemaName =
                        nameElement
                            ? nameElement.innerText
                            : "Cinema";


                    alert(
                        "Showing movies at:\n\n" +
                        cinemaName
                    );

                }
            );

        }
    );


    /* =====================================================
                    THEATER DETAILS
    ===================================================== */

    const theaterDetailsButtons =
        document.querySelectorAll(
            ".cinema-secondary-btn"
        );


    theaterDetailsButtons.forEach(
        function (button) {

            button.addEventListener(
                "click",
                function () {

                    const card =
                        button.closest(
                            ".cinema-card"
                        );


                    if (!card) {

                        return;

                    }


                    const nameElement =
                        card.querySelector("h3");


                    const locationElement =
                        card.querySelector(
                            ".cinema-location"
                        );


                    const descriptionElement =
                        card.querySelector(
                            ".cinema-description"
                        );


                    const cinemaName =
                        nameElement
                            ? nameElement.innerText
                            : "Cinema";


                    const location =
                        locationElement
                            ? locationElement.innerText
                            : "";


                    const description =
                        descriptionElement
                            ? descriptionElement.innerText
                            : "";


                    alert(
                        cinemaName +
                        "\n\n" +
                        location +
                        "\n\n" +
                        description
                    );

                }
            );

        }
    );


    /* =====================================================
                    INITIAL LOAD
    ===================================================== */

    renderCinemas();


});