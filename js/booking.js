/* ==========================================================
                    GLOBAL VARIABLES
========================================================== */

let showAllTheatres = false;
let selectedMovie = null;

let filters = {
    format: "",
    language: "",
    time: "",
    seat: "",
    price: ""
};

let favouriteList = JSON.parse(
    localStorage.getItem("favouriteTheatres")
) || [];


/* ==========================================================
                    BOOKING OBJECT
========================================================== */

let booking = JSON.parse(
    localStorage.getItem("booking")
);

if (!booking) {

    booking = {

        movie: null,

        theatre: null,

        date: null,

        show: null,

        seats: [],

        snacks: [],

        payment: {

            ticketTotal: 0,

            snackTotal: 0,

            convenienceFee: 0,

            tax: 0,

            grandTotal: 0
        },

        rewards: 0
    };

}

function saveBooking() {

    localStorage.setItem(
        "booking",
        JSON.stringify(booking)
    );

}


/* ==========================================================
                    PAGE LOAD
========================================================== */

document.addEventListener("DOMContentLoaded", function () {

    loadMovie();

    createDates();

    showTheatres();

    setupFilters();

});


/* ==========================================================
                LOAD MOVIE DETAILS
========================================================== */

function loadMovie() {

    let movieName =
        localStorage.getItem("selectedMovie");

    if (!movieName) {

        return;

    }

    selectedMovie = movies[movieName];

    if (!selectedMovie) {

        return;

    }

const selectedLanguage =
    localStorage.getItem("selectedLanguage") ||
    (Array.isArray(selectedMovie.language)
        ? selectedMovie.language[0]
        : selectedMovie.language);

localStorage.setItem("selectedLanguage", selectedLanguage);

booking.movie = {
    title: selectedMovie.title,
    year: selectedMovie.year,
    poster: selectedMovie.poster,
    rating: selectedMovie.rating,
    language: selectedLanguage,
    duration: selectedMovie.duration,
    genres: [...selectedMovie.genres]
};
    
    // Reset previous booking
    booking.theatre = null;
    booking.show = null;
    booking.seats = [];
    booking.snacks = [];

    booking.payment = {

        ticketTotal: 0,

        snackTotal: 0,

        convenienceFee: 0,

        tax: 0,

        grandTotal: 0

    };

    booking.rewards = 0;

    saveBooking();


    document.getElementById("movieName").innerHTML =

        `${selectedMovie.title}
        <span>(${selectedMovie.year})</span>`;


    document.querySelector(".poster img").src =
        selectedMovie.poster;


    document.querySelector(".rating").innerHTML =

        `<span>

            <i class="fa-solid fa-star"></i>

            ${selectedMovie.rating}

        </span>`;


    let languageText =
    localStorage.getItem("selectedLanguage");

    if (Array.isArray(selectedMovie.language)) {

        languageText =
            selectedMovie.language.join(", ");

    }

    else {

        languageText =
            selectedMovie.language;

    }


    let genreText = "";

    for (let i = 0; i < selectedMovie.genres.length; i++) {

        genreText +=

            `<span>${selectedMovie.genres[i]}</span>`;

    }


    document.querySelector(".info").innerHTML =

        `<span>${languageText}</span>

         <span>${selectedMovie.duration}</span>

         ${genreText}`;

}

/* ==========================================================
   DATE CREATION
========================================================== */

function createDates() {

    const dateCards =
        document.querySelectorAll(".date-card");

    const today = new Date();

    const days = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

    const months = ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"];


    document.querySelector(".month-card span").textContent =
        months[today.getMonth()];


    dateCards.forEach(function (card, index) {

        const date = new Date();

        date.setDate(
            today.getDate() + index
        );


        /* =========================
           DISPLAY DATE
        ========================= */

        card.querySelector("h3").textContent =
            date.getDate();

        card.querySelector("p").textContent =
            days[date.getDay()];


        /* =========================
           CHECK PREVIOUS DATE
        ========================= */

        const savedDate = booking.date;

        if (
            savedDate &&
            Number(savedDate.date) === date.getDate() &&
            savedDate.month === months[date.getMonth()] &&
            Number(savedDate.year) === date.getFullYear()
        ) {

            card.classList.add("active");

        }


        /* =========================
           DATE CLICK
        ========================= */

        card.onclick = function () {

            /* Remove previous active */

            dateCards.forEach(function (c) {

                c.classList.remove("active");

            });


            /* Add active */

            card.classList.add("active");


            /* =========================
               CREATE SELECTED DATE
            ========================= */

            const selectedDate = {

                day: days[date.getDay()],

                date: date.getDate(),

                month: months[date.getMonth()],

                year: date.getFullYear()

            };


            /* =========================
               SAVE BOOKING DATE
            ========================= */

            booking.date = selectedDate;

            saveBooking();


            /* =========================
               SAVE SELECTED DATE
               SEPARATELY
            ========================= */

            localStorage.setItem(
                "selectedDate",
                JSON.stringify(selectedDate)
            );


            console.log(
                "Selected Date:",
                selectedDate
            );

        };

    });


    /* ======================================================
       DEFAULT DATE
       ONLY IF NO DATE ALREADY EXISTS
    ====================================================== */

    if (!booking.date) {

        const defaultDate = {

            day: days[today.getDay()],

            date: today.getDate(),

            month: months[today.getMonth()],

            year: today.getFullYear()

        };


        booking.date = defaultDate;

        saveBooking();


        localStorage.setItem(
            "selectedDate",
            JSON.stringify(defaultDate)
        );

    }

}
/* ==========================================================
                    FAVOURITE THEATRE
========================================================== */

function favouriteTheatre(index) {

    const theatre = theatres[index];

    if (!theatre) return;

    const favIndex = favouriteList.indexOf(theatre.name);

    if (favIndex !== -1) {

        favouriteList.splice(favIndex, 1);

    } else {

        favouriteList.push(theatre.name);

    }

    localStorage.setItem(
        "favouriteTheatres",
        JSON.stringify(favouriteList)
    );

    showTheatres();

}


function checkFavourite(name) {

    return favouriteList.includes(name);

}


/* ==========================================================
                    DISPLAY THEATRES
========================================================== */

function showTheatres() {

    const theatreBox =
        document.getElementById("theatreList");

    theatreBox.innerHTML = "";

    let displayList = [];

    // Favourite theatres first
    theatres.forEach(function (theatre) {

        if (checkFavourite(theatre.name)) {

            displayList.push(theatre);

        }

    });

    // Remaining theatres
    theatres.forEach(function (theatre) {

        if (!checkFavourite(theatre.name)) {

            displayList.push(theatre);

        }

    });

    let count = displayList.length;

    if (!showAllTheatres) {

        count = Math.min(5, displayList.length);

    }

    for (let i = 0; i < count; i++) {

        const theatre = displayList[i];

        const originalIndex =
            theatres.indexOf(theatre);

        const heart =
            checkFavourite(theatre.name)
                ? "fa-solid"
                : "fa-regular";

        theatreBox.innerHTML += `

<div class="theatre-card">

    <div class="theatre-left">

        <img
            src="${theatre.logo}"
            class="theatre-logo"
            alt="${theatre.name}"
        >

    </div>

    <div class="theatre-center">

        <h3>${theatre.name}</h3>

        <div class="theatre-info">

            <span>${theatre.distance}</span>

            <span>${theatre.cancel}</span>

        </div>

        <div class="show-times">

            ${createShowButtons(
            theatre,
            originalIndex
        )}

        </div>

    </div>

    <div class="theatre-right">

        <button
            class="fav-btn"
            onclick="favouriteTheatre(${originalIndex})"
        >

            <i class="${heart} fa-heart"></i>

        </button>

    </div>

</div>

`;

    }

    if (displayList.length > 5) {

        theatreBox.innerHTML += `

<div class="text-center mt-4">

    <button
        class="btn btn-outline-danger"
        onclick="viewAll()"
    >

        ${showAllTheatres
                ? "View Less Theatres"
                : "View All Theatres"
            }

    </button>

</div>

`;

    }

}


/* ==========================================================
                CREATE SHOW BUTTONS
========================================================== */

function createShowButtons(theatre, index) {

    let html = "";

    if (!selectedMovie) {
        return html;
    }

    const language =
         localStorage.getItem("selectedLanguage") ||
        (Array.isArray(selectedMovie.language)
            ? selectedMovie.language[0]
            : selectedMovie.language);

    const theatreShows =
        selectedMovie?.theatreTimings?.[language]?.[theatre.shortName];

    if (!theatreShows) {
        return html;
    }

    theatreShows.forEach(function (time) {

        html += `

            <button
                class="time-btn"
                onclick="selectShow(${index}, '${time}')">

                ${time}

            </button>

        `;

    });

    return html;
}
/* ==========================================================
                    VIEW ALL
========================================================== */

function viewAll() {

    showAllTheatres = !showAllTheatres;

    showTheatres();

}

/* ==========================================================
                FILTER SETUP
========================================================== */
function setupFilters() {
    let buttons = document.querySelectorAll(".chips button");
    for (let i = 0; i < buttons.length; i++) {
        buttons[i].onclick = function () {
            let group = buttons[i].parentElement;
            let allButtons = group.querySelectorAll("button");
            for (let j = 0; j < allButtons.length; j++) {
                allButtons[j].classList.remove("active");
            }
            buttons[i].classList.add("active");
            let title = group.parentElement.querySelector("h6").innerText;
            if (title == "Format") {
                if (buttons[i].innerText == "All") {
                    filters.format = "";
                }
                else {

                    filters.format = buttons[i].innerText;

                }

            }
            if (title == "Language") {
                if (buttons[i].innerText == "All") {
                    filters.language = "";
                }
                else {
                    filters.language = buttons[i].innerText;
                }

            }
if (title == "Show Time") {

    let value = buttons[i].innerText.trim();

    if (value == "All") {

        filters.time = "";

    } else if (value == "After 7 PM") {

        filters.time = "Night";

    } else {

        filters.time = value;

    }

}
          if(title=="Seat Type"){

    if(buttons[i].innerText=="All"){
        filters.seat="";
    }else{
        filters.seat=buttons[i].innerText;
    }

}
           if(title=="Price"){

    if(buttons[i].innerText=="All"){
        filters.price="";
    }else{
        filters.price=buttons[i].innerText;
    }

}
        };
    }
    document.querySelector(".apply-btn").onclick = function () {
        applyFilter();
    };

    document.querySelector(".reset-btn").onclick = function () {
        resetFilter();
    };
    setupQuickFilters();
}
/* ==========================================================
                QUICK FILTER BUTTONS
========================================================== */
function setupQuickFilters() {
    let buttons = document.querySelectorAll(".quick-filter");
    for (let i = 0; i < buttons.length; i++) {
        buttons[i].onclick = function () {
            for (let j = 0; j < buttons.length; j++) {
                buttons[j].classList.remove("active");
            }
            buttons[i].classList.add("active");
            filters.time = "";
            filters.seat = "";
            let value =
                buttons[i].innerText.trim();
            if (value == "After 7 PM") {
                filters.time = "Night";
            }
            if (value == "Couple Seats") {
                filters.seat = "Couple Seats";
            }
            if (value == "Wheelchair Friendly") {
                filters.seat = "Wheelchair";
            }
            if (value == "Recliners") {
                filters.seat = "Recliner";
            }
            applyFilter();
        }
    }
}


/* ==========================================================
                APPLY FILTER
========================================================== */
function applyFilter() {
    let result = [];
    for (let i = 0; i < theatres.length; i++) {
        let theatre = theatres[i];
        let pass = true;

        // FORMAT
        if (filters.format != "") {
            if (theatre.format != filters.format) {
                pass = false;
            }
        }
        // LANGUAGE

        if (filters.language != "") {

            let movieLanguages = selectedMovie.language;


            if (Array.isArray(movieLanguages) == false) {

                movieLanguages = [movieLanguages];

            }


            if (movieLanguages.includes(filters.language) == false) {

                pass = false;

            }

        }
        // SEAT TYPE
        if (filters.seat == "Recliner") {
            if (theatre.recliner != "yes") {
                pass = false;
            }
        }
        if (filters.seat == "Couple Seats") {
            if (theatre.couple != "yes") {
                pass = false;
            }
        }

        if (filters.seat == "Wheelchair") {
            if (theatre.wheelchair != "yes") {
                pass = false;
            }
        }
        // PRICE
        if (filters.price == "₹150-250") {
            if (theatre.price < 150 ||
                theatre.price > 250) {
                pass = false;

            }
        }
        if (filters.price == "₹250-400") {
            if (theatre.price < 250 ||
                theatre.price > 400) {
                pass = false;
            }
        }
        if (filters.price == "₹400+") {
            if (theatre.price < 400) {
                pass = false;
            }
        }
        // TIME
if (filters.time != "") {

    let found = false;

  const language = localStorage.getItem("selectedLanguage");

const theatreShows =
    selectedMovie.theatreTimings?.[language]?.[theatre.shortName];

if (!theatreShows) {
    pass = false;
} else {

    let found = false;

    theatreShows.forEach(time => {

        const [hourText] = time.split(":");
        let hour = parseInt(hourText);

        if (time.includes("AM")) {

            if (filters.time === "Morning") {
                found = true;
            }

        } else {

            if (hour === 12) hour = 12;
            else hour += 12;

            if (
                filters.time === "Afternoon" &&
                hour >= 12 &&
                hour < 17
            ) {
                found = true;
            }

            if (
                filters.time === "Evening" &&
                hour >= 17 &&
                hour < 20
            ) {
                found = true;
            }

            if (
                filters.time === "Night" &&
                hour >= 20
            ) {
                found = true;
            }

        }

    });

    if (!found) {
        pass = false;
    }
}

    if (!found) {
        pass = false;
    }
}
        if (pass == true) {
            result.push(theatre);
        }
    }
    displayFilteredTheatres(result);
}
/* ==========================================================
                FILTERED DISPLAY
========================================================== */


function displayFilteredTheatres(list) {

    let box = document.getElementById("theatreList");
    box.innerHTML = "";

    let count = showAllTheatres
        ? list.length
        : Math.min(5, list.length);

    for (let i = 0; i < count; i++) {

        let theatre = list[i];
        let index = theatres.indexOf(theatre);

        let heart = checkFavourite(theatre.name)
            ? "fa-solid"
            : "fa-regular";

        box.innerHTML += `
        <div class="theatre-card">

            <div class="theatre-left">
                <img src="${theatre.logo}" class="theatre-logo">
            </div>

            <div class="theatre-center">

                <h3>${theatre.name}</h3>

                <div class="theatre-info">
                    <span>${theatre.distance}</span>
                    <span>${theatre.cancel}</span>
                </div>

                <div class="show-times">
                    ${createShowButtons(theatre,index)}
                </div>

            </div>

            <div class="theatre-right">
                <button
                    class="fav-btn"
                    onclick="favouriteTheatre(${index})">
                    <i class="${heart} fa-heart"></i>
                </button>
            </div>

        </div>`;
    }

    if (list.length > 5) {

        box.innerHTML += `
        <div class="text-center mt-4">

            <button
                class="btn btn-outline-danger"
                onclick="viewAll()">

                ${showAllTheatres
                    ? "View Less Theatres"
                    : "View All Theatres"}

            </button>

        </div>`;
    }

    if (list.length == 0) {

        box.innerHTML = `
        <div class="text-center py-5">
            <h4>No Theatre Found</h4>
            <p>Try changing filters</p>
        </div>`;
    }

}
/* ==========================================================
                RESET FILTER
========================================================== */
function resetFilter() {

    filters.format = "";
    filters.language = "";
    filters.time = "";
    filters.seat = "";
    filters.price = "";

    // Reset quick filters
    document.querySelectorAll(".quick-filter").forEach(btn => {
        btn.classList.remove("active");
    });

    // Reset all chip groups
    document.querySelectorAll(".chips").forEach(group => {

        group.querySelectorAll("button").forEach(btn => {
            btn.classList.remove("active");
        });

        const firstButton = group.querySelector("button");

        if (firstButton) {
            firstButton.classList.add("active");
        }

    });

    showAllTheatres = false;

    showTheatres();

}


/* ==========================================================
                    SELECT SHOW
========================================================== */

function selectShow(index, time) {

    const theatre = theatres[index];

    if (!theatre) {
        console.log("Theatre not found:", index);
        return;
    }

    const language =
        localStorage.getItem("selectedLanguage");

    /* ------------------------------------------------------
       GET TIMINGS FROM MOVIE DATA
    ------------------------------------------------------ */

    const theatreShows =
        selectedMovie?.theatreTimings?.[language]?.[theatre.shortName];

    if (!theatreShows) {

        console.log(
            "No timings found for:",
            theatre.name,
            language
        );

        return;
    }

    console.log("Selected Movie:", selectedMovie.title);
    console.log("Selected Language:", language);
    console.log("Selected Theatre:", theatre.name);
    console.log("Movie Timings:", theatreShows);


    /* ------------------------------------------------------
       CREATE SHOW OBJECTS
       MOVIE TIMING + THEATRE DETAILS
    ------------------------------------------------------ */

    const shows = theatreShows.map(function (showTime) {

        return {

            time: showTime,

            sound: theatre.sound || "Dolby Atmos",

            screen: theatre.screen || "Screen 1"

        };

    });


    /* ------------------------------------------------------
       FIND SELECTED SHOW
    ------------------------------------------------------ */

    const selectedShow =
        shows.find(function (show) {

            return show.time === time;

        });


    if (!selectedShow) {

        console.log("Selected show not found:", time);

        return;

    }


    /* ------------------------------------------------------
       SAVE SELECTED THEATRE
    ------------------------------------------------------ */

    const selectedTheatre = {

        id: theatre.id,

        name: theatre.name,

        shortName: theatre.shortName,

        logo: theatre.logo,

        distance: theatre.distance,

        cancel: theatre.cancel,

        format: theatre.format,

        price: theatre.price,

        recliner: theatre.recliner,

        couple: theatre.couple,

        wheelchair: theatre.wheelchair,

        /* All timings for this theatre */
        shows: shows,

        /* Currently selected show */
        time: selectedShow.time,

        sound: selectedShow.sound,

        screen: selectedShow.screen

    };


    /* ------------------------------------------------------
       SAVE TO LOCAL STORAGE
    ------------------------------------------------------ */

    localStorage.setItem(
        "selectedTheatre",
        JSON.stringify(selectedTheatre)
    );


    /* ------------------------------------------------------
       BOOKING OBJECT
    ------------------------------------------------------ */

    booking.movie = {

        title: selectedMovie.title,

        year: selectedMovie.year,

        poster: selectedMovie.poster,

        rating: selectedMovie.rating,

        language: language,

        duration: selectedMovie.duration,

        genres: [...selectedMovie.genres]

    };


    booking.theatre = {

        id: theatre.id,

        name: theatre.name,

        logo: theatre.logo,

        distance: theatre.distance,

        cancel: theatre.cancel,

        format: theatre.format,

        price: theatre.price

    };


    booking.show = {

        time: selectedShow.time,

        language: language,

        sound: selectedShow.sound,

        screen: selectedShow.screen

    };


    /* ------------------------------------------------------
       RESET BOOKING
    ------------------------------------------------------ */

    booking.seats = [];

    booking.snacks = [];

    booking.payment = {

        ticketTotal: 0,

        snackTotal: 0,

        convenienceFee: 0,

        tax: 0,

        grandTotal: 0

    };

    booking.rewards = 0;


    saveBooking();


    /* ------------------------------------------------------
       GO TO SEAT BOOKING
    ------------------------------------------------------ */

    window.location.href = "seat_booking.html";

}