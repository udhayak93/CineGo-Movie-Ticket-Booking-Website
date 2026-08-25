/* ==========================================================
                    MOVIE DETAILS
========================================================== */

const selectedMovie = localStorage.getItem("selectedMovie");
const movie = movies[selectedMovie];


/* ==========================================================
                    SELECTED LANGUAGE
========================================================== */

const selectedLanguage =
    localStorage.getItem("selectedLanguage") ||
    (
        movie && Array.isArray(movie.language)
            ? movie.language[0]
            : movie?.language
    );


/* ==========================================================
                    MOVIE DETAILS DISPLAY
========================================================== */

if (movie) {

    const poster =
        document.getElementById("seatMoviePoster");

    const movieName =
        document.getElementById("seatMovieName");

    const rating =
        document.getElementById("seatMovieRating");

    const badges =
        document.getElementById("seatMovieBadges");

    const description =
        document.getElementById("seatMovieDescription");

    const info =
        document.getElementById("seatMovieInfo");


    /* -------------------------
            POSTER
    ------------------------- */

    if (poster) {
        poster.src = movie.poster;
    }


    /* -------------------------
            MOVIE NAME
    ------------------------- */

    if (movieName) {

        movieName.innerHTML =
            `${movie.title} <span>(${movie.year})</span>`;

    }


    /* -------------------------
            RATING
    ------------------------- */

    if (rating) {
        rating.innerHTML = movie.rating;
    }


    /* -------------------------
            BADGES
    ------------------------- */

    if (badges) {

        badges.innerHTML = `
            <span>UA 13+</span>

            <span>2D</span>

            <span>
                ${
                    Array.isArray(movie.language)
                        ? movie.language.join(", ")
                        : movie.language
                }
            </span>
        `;

    }


    /* -------------------------
            DESCRIPTION
    ------------------------- */

    if (description) {

        description.innerHTML =
            movie.description ||
            `${movie.title} is an exciting ${
                Array.isArray(movie.genres)
                    ? movie.genres.join(", ")
                    : ""
            } movie experience.`;

    }


    /* -------------------------
            MOVIE INFO
    ------------------------- */

    if (info) {

        info.innerHTML = `

            <div>
                <i class="fa-solid fa-film"></i>
                ${
                    Array.isArray(movie.genres)
                        ? movie.genres.join(" • ")
                        : ""
                }
            </div>

            <div>
                <i class="fa-regular fa-clock"></i>
                ${movie.duration || ""}
            </div>

            <div>
                <i class="fa-solid fa-language"></i>
                ${selectedLanguage || ""}
            </div>

            <div>
                <i class="fa-solid fa-volume-high"></i>
                Dolby Atmos
            </div>

        `;

    }

}


/* ==========================================================
   SELECTED THEATRE
========================================================== */

const selectedTheatre =
    JSON.parse(localStorage.getItem("selectedTheatre"));

const selectedDate =
    JSON.parse(localStorage.getItem("selectedDate"));

const theatreContainer =
    document.getElementById("theatreContainer");


if (selectedTheatre && theatreContainer) {

    /* =========================
       SELECTED DATE
    ========================= */

    let displayDate = "Date not selected";

    if (selectedDate) {

        displayDate =
            `${selectedDate.day}, ${selectedDate.date} ${selectedDate.month} ${selectedDate.year}`;

    }


    theatreContainer.innerHTML = `

        <div class="theatre-left">

            <div class="theatre-icon">
                <i class="fa-solid fa-building"></i>
            </div>


            <div>

                <h3>
                    ${selectedTheatre.name || ""}
                </h3>


                <p>
                    ${selectedTheatre.distance || ""}
                </p>


                <div class="show-details">

                    <span>

                        <i class="fa-regular fa-calendar"></i>

                        ${displayDate}

                    </span>


                    <span>

                        <i class="fa-solid fa-clapperboard"></i>

                        ${selectedTheatre.screen || "Screen 1"}

                    </span>

                </div>

            </div>

        </div>


        <div class="theatre-right">

            <span>

                <i class="fa-solid fa-volume-high"></i>

                ${selectedTheatre.sound || "Dolby Atmos"}

            </span>


            <span>

                <i class="fa-solid fa-tv"></i>

                ${selectedTheatre.format || "2D"}

            </span>


            <span>

                <i class="fa-solid fa-square-parking"></i>

                Parking

            </span>

        </div>

    `;
}
/* ==========================================================
                    SELECTED SHOW TIME
========================================================== */

const timeWrapper =
    document.getElementById("timeWrapper");


if (
    selectedTheatre &&
    timeWrapper &&
    movie
) {

    timeWrapper.innerHTML = "";


    /* ------------------------------------------------------
                GET MOVIE TIMINGS
    ------------------------------------------------------ */

    const timings =
        movie.theatreTimings?.[
            selectedLanguage
        ]?.[
            selectedTheatre.shortName
        ] || [];


    console.log(
        "Selected Movie:",
        selectedMovie
    );

    console.log(
        "Selected Language:",
        selectedLanguage
    );

    console.log(
        "Selected Theatre:",
        selectedTheatre.shortName
    );

    console.log(
        "Movie Timings:",
        timings
    );


    /* ------------------------------------------------------
                RENDER TIME CARDS
    ------------------------------------------------------ */

    timings.forEach((show) => {

        /*
            Timing can be:

            "10:00 AM"

            OR

            {
                time: "10:00 AM",
                sound: "Dolby Atmos",
                screen: "Screen 3"
            }
        */


        const time =
            typeof show === "string"
                ? show
                : show.time;


        const sound =
            typeof show === "string"
                ? selectedTheatre.sound ||
                  "Dolby Atmos"
                : show.sound ||
                  selectedTheatre.sound ||
                  "Dolby Atmos";


        const screen =
            typeof show === "string"
                ? selectedTheatre.screen ||
                  "Screen 1"
                : show.screen ||
                  selectedTheatre.screen ||
                  "Screen 1";


        timeWrapper.innerHTML += `

            <button
                class="time-card ${
                    time === selectedTheatre.time
                        ? "active"
                        : ""
                }"
                data-time="${time}"
                data-sound="${sound}"
                data-screen="${screen}"
            >

                <h5>
                    ${time}
                </h5>


                <p>

                    ${sound}

                    •
                    
                    ${screen}

                </p>


                <span class="status available">

                    <i class="fa-solid fa-circle"></i>

                    Available

                </span>

            </button>

        `;

    });


    /* ------------------------------------------------------
                TIME CARD CLICK
    ------------------------------------------------------ */

    document
        .querySelectorAll(".time-card")
        .forEach((card) => {


            card.addEventListener(
                "click",
                function () {


                    /* -------------------------
                            ACTIVE BUTTON
                    ------------------------- */

                    document
                        .querySelectorAll(".time-card")
                        .forEach((btn) => {

                            btn.classList.remove(
                                "active"
                            );

                        });


                    this.classList.add(
                        "active"
                    );


                    /* -------------------------
                            UPDATE TIME
                    ------------------------- */

                    selectedTheatre.time =
                        this.dataset.time;


                    selectedTheatre.sound =
                        this.dataset.sound;


                    selectedTheatre.screen =
                        this.dataset.screen;


                    /* -------------------------
                            SAVE THEATRE
                    ------------------------- */

                    localStorage.setItem(
                        "selectedTheatre",
                        JSON.stringify(
                            selectedTheatre
                        )
                    );


                    /* -------------------------
                            RESET SEATS
                    ------------------------- */

                    selectedSeats = [];


                    document
                        .querySelectorAll(
                            ".seat.selected"
                        )
                        .forEach((seat) => {

                            seat.classList.remove(
                                "selected"
                            );

                        });


                    /* -------------------------
                            UPDATE SUMMARY
                    ------------------------- */

                    updateSummary();


                    /* -------------------------
                            NEW SOLD SEATS
                    ------------------------- */

                    loadRandomSoldSeats();

                }
            );

        });

}


/* ==========================================================
                    SEAT BOOKING
========================================================== */

const primePrice = 184;

const classicPrice = 54;


const seats =
    document.querySelectorAll(".seat");


console.log(
    "SEATS:",
    seats.length
);


const seatList =
    document.getElementById(
        "selectedSeats"
    );


const totalPrice =
    document.getElementById(
        "totalPrice"
    );


const continueBtn =
    document.getElementById(
        "continueBtn"
    );


let selectedSeats = [];


const MAX_SEATS = 6;


/* ==========================================================
                    RANDOM SOLD SEATS
========================================================== */

function loadRandomSoldSeats() {

    const allSeats =
        document.querySelectorAll(
            ".seat"
        );


    /* -------------------------
            RESET
    ------------------------- */

    allSeats.forEach((seat) => {

        seat.classList.remove(
            "sold"
        );

        seat.disabled = false;

    });


    /* -------------------------
            AVAILABLE SEATS
    ------------------------- */

    const availableSeats = [
        ...document.querySelectorAll(
            ".seat:not(.accessible)"
        )
    ];


    /* -------------------------
            SHUFFLE
    ------------------------- */

    availableSeats.sort(
        () => Math.random() - 0.5
    );


    /* -------------------------
            SOLD COUNT
    ------------------------- */

    const soldCount =
        Math.min(
            Math.floor(
                Math.random() * 16
            ) + 20,

            availableSeats.length
        );


    /* -------------------------
            MARK SOLD
    ------------------------- */

    for (
        let i = 0;
        i < soldCount;
        i++
    ) {

        availableSeats[i]
            .classList
            .add("sold");


        availableSeats[i]
            .disabled = true;

    }

}


/* ==========================================================
                    INITIAL SOLD SEATS
========================================================== */

loadRandomSoldSeats();


/* ==========================================================
                    SEAT CLICK
========================================================== */

seats.forEach((seat) => {


    seat.addEventListener(
        "click",
        function () {


            /* -------------------------
                    SOLD SEAT
            ------------------------- */

            if (
                this.classList.contains(
                    "sold"
                )
            ) {

                return;

            }


            /* -------------------------
                    ACCESSIBLE SEAT
            ------------------------- */

            if (
                this.classList.contains(
                    "accessible"
                ) &&
                !this.classList.contains(
                    "selected"
                )
            ) {

                const confirmSeat =
                    confirm(
                        "This is an Accessible Seat reserved for wheelchair users. Do you want to continue?"
                    );


                if (!confirmSeat) {

                    return;

                }

            }


            /* -------------------------
                    ROW NAME
            ------------------------- */

            const rowElement =
                this
                    .closest(".seat-row")
                    ?.querySelector(
                        ".row-name"
                    );


            if (!rowElement) {

                console.log(
                    "Row name not found"
                );

                return;

            }


            const row =
                rowElement
                    .innerText
                    .trim();


            /* -------------------------
                    PRIME ROWS
            ------------------------- */

            const primeRows = [

                "L",
                "K",
                "J",
                "I",
                "H",
                "G",
                "F",
                "E",
                "D",
                "C"

            ];


            /* -------------------------
                    PRICE
            ------------------------- */

            const price =
                primeRows.includes(row)
                    ? primePrice
                    : classicPrice;


            /* -------------------------
                    SEAT NUMBER
            ------------------------- */

            const number =
                this.innerText.trim();


            /* -------------------------
                    FULL SEAT NAME
            ------------------------- */

            const seatName =
                row + number;


            /* ==================================================
                        REMOVE SELECTED SEAT
            ================================================== */

            if (
                this.classList.contains(
                    "selected"
                )
            ) {

                this.classList.remove(
                    "selected"
                );


                selectedSeats =
                    selectedSeats.filter(
                        (seat) =>
                            seat.name !==
                            seatName
                    );

            }


            /* ==================================================
                        ADD SELECTED SEAT
            ================================================== */

            else {


                if (
                    selectedSeats.length >=
                    MAX_SEATS
                ) {

                    alert(
                        "Maximum 6 seats allowed"
                    );

                    return;

                }


                this.classList.add(
                    "selected"
                );


                selectedSeats.push({

                    name: seatName,

                    price: price

                });

            }


            /* -------------------------
                    UPDATE
            ------------------------- */

            updateSummary();

        }
    );

});


/* ==========================================================
                    UPDATE SUMMARY
========================================================== */

function updateSummary() {


    if (
        !seatList ||
        !totalPrice ||
        !continueBtn
    ) {

        console.log(
            "Summary elements not found"
        );

        return;

    }


    /* ======================================================
                        NO SEATS
    ====================================================== */

    if (
        selectedSeats.length === 0
    ) {

        seatList.innerHTML =
            "None";


        totalPrice.innerHTML =
            "0";


        continueBtn.disabled =
            true;


        continueBtn.innerText =
            "Continue";


        localStorage.removeItem(
            "booking"
        );


        return;

    }


    /* ======================================================
                        SORT SEATS
    ====================================================== */

    selectedSeats.sort(
        (a, b) =>
            a.name.localeCompare(
                b.name
            )
    );


    /* ======================================================
                        DISPLAY SEATS
    ====================================================== */

    seatList.innerHTML =
        selectedSeats
            .map(
                (seat) =>
                    seat.name
            )
            .join(", ");


    /* ======================================================
                        TOTAL PRICE
    ====================================================== */

    const total =
        selectedSeats.reduce(
            (sum, seat) =>
                sum + seat.price,
            0
        );


    totalPrice.innerHTML =
        total.toFixed(2);


    /* ======================================================
                        CONTINUE BUTTON
    ====================================================== */

    continueBtn.disabled =
        false;


    continueBtn.innerText =
        `Continue (${selectedSeats.length})`;


    /* ======================================================
                        SAVE BOOKING
    ====================================================== */

    const booking = {

        seats:
            selectedSeats,

        total:
            total

    };


    localStorage.setItem(
        "booking",
        JSON.stringify(
            booking
        )
    );

}


/* ==========================================================
                    CONTINUE
========================================================== */

if (continueBtn) {

    continueBtn.addEventListener(
        "click",
        () => {


            /* -------------------------
                    VALIDATION
            ------------------------- */

            if (
                selectedSeats.length === 0
            ) {

                alert(
                    "Please select at least one seat"
                );

                return;

            }


            /* -------------------------
                    BOOKING DATA
            ------------------------- */

            const bookingData = {

                /* Movie */

                poster:
                    movie?.poster || "",

                title:
                    movie?.title || "",


                /* Theatre */

                theatre:
                    selectedTheatre?.name || "",

                location:
                    selectedTheatre?.distance || "",


                /* Show */

                date:
                    new Date().toDateString(),

                time:
                    selectedTheatre?.time || "",

                language:
                    selectedLanguage || "",


                /* Screen */

                screen:
                    selectedTheatre?.screen ||
                    "",

                sound:
                    selectedTheatre?.sound ||
                    "",

                format:
                    selectedTheatre?.format ||
                    "",


                /* Seats */

                seats:
                    selectedSeats.map(
                        (seat) =>
                            seat.name
                    ),


                /* Price */

                subtotal:
                    totalPrice.innerText

            };


            /* -------------------------
                    SAVE
            ------------------------- */

            localStorage.setItem(
                "bookingData",
                JSON.stringify(
                    bookingData
                )
            );


            /* -------------------------
                    GO PAYMENT
            ------------------------- */

            window.location.href =
                "payment.html";

        }
    );

}


/* ==========================================================
                    INITIAL SUMMARY
========================================================== */

updateSummary();