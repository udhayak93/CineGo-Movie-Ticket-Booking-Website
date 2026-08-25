/* ==========================================================
                    BOOKING HISTORY
========================================================== */

document.addEventListener("DOMContentLoaded", function () {

    const list = document.getElementById("bookingList");
    const detailsModal = document.getElementById("detailsModal");
    const detailContent = document.getElementById("detailContent");

    /* ----------------------------------------------------------
                    CHECK REQUIRED ELEMENT
    ---------------------------------------------------------- */

    if (!list) {
        console.error("❌ bookingList element not found.");
        return;
    }


    /* ==========================================================
                        DEMO BOOKINGS
    ========================================================== */

    const demoBookings = [
        {
            id: "CG-10482",
            movie: "furious",
            date: "10 Aug 2026",
            time: "10:40 PM",
            tickets: "2 tickets",
            theater: "PVR Velachery",
            screen: "Audi 04",
            seats: "E7, E8",
            language: "English",
            format: "IMAX",
            amount: "₹720",
            status: "booked"
        },

        {
            id: "CG-10431",
            movie: "janaNayagan",
            date: "08 Aug 2026",
            time: "07:30 PM",
            tickets: "2 tickets",
            theater: "INOX Phoenix",
            screen: "Audi 05",
            seats: "F8, F9",
            language: "Tamil",
            format: "2D",
            amount: "₹560",
            status: "booked"
        },

        {
            id: "CG-10395",
            movie: "gattaKusthi2",
            date: "02 Aug 2026",
            time: "06:45 PM",
            tickets: "3 tickets",
            theater: "PVR Velachery",
            screen: "Audi 02",
            seats: "D6, D7, D8",
            language: "Tamil",
            format: "2D",
            amount: "₹840",
            status: "failed"
        }
    ];


    /* ==========================================================
                    GET MOVIE FROM movie-data.js
    ========================================================== */

    function getMovieData(movieKey) {

        /*
            movie-data.js ல இருக்கும் global "movies" object
            இங்கே use ஆகும்.
        */

        if (
            typeof movies !== "undefined" &&
            movies &&
            movieKey &&
            movies[movieKey]
        ) {
            return movies[movieKey];
        }

        console.warn("Movie not found in movie-data.js:", movieKey);

        return {
            title: movieKey || "Unknown Movie",
            poster: "https://via.placeholder.com/300x420?text=CineGo"
        };
    }


    /* ==========================================================
                    NORMALIZE BOOKING DATA
    ========================================================== */

    function normalizeBooking(booking) {

        if (!booking) {
            return null;
        }

        /*
            Old data ல "movies"
            New data ல "movie"

            இரண்டு format-யும் support பண்ணும்.
        */

        const movieKey =
            booking.movie ||
            booking.movies ||
            booking.movieId ||
            booking.movieKey ||
            "";

        const movieData = getMovieData(movieKey);

        return {

            ...booking,

            /* Movie key */
            movieKey: movieKey,

            /* Actual movie title from movie-data.js */
            movieTitle:
                booking.movieTitle ||
                movieData.title ||
                movieKey ||
                "Unknown Movie",

            /* Poster from movie-data.js */
            poster:
                booking.poster ||
                movieData.poster ||
                "https://via.placeholder.com/300x420?text=CineGo",

            /* Safe values */
            date: booking.date || "Date unavailable",

            time: booking.time || "Time unavailable",

            tickets:
                booking.tickets ||
                "0 tickets",

            theater:
                booking.theater ||
                "Theater unavailable",

            screen:
                booking.screen ||
                "Standard Screen",

            seats:
                booking.seats ||
                "Not available",

            language:
                booking.language ||
                (
                    Array.isArray(movieData.language)
                        ? movieData.language[0]
                        : movieData.language
                ) ||
                "Tamil",

            format:
                booking.format ||
                "2D",

            amount:
                booking.amount !== undefined &&
                booking.amount !== null &&
                booking.amount !== ""
                    ? booking.amount
                    : "₹0",

            status:
                booking.status || "booked"
        };
    }


    /* ==========================================================
                        GET BOOKINGS
    ========================================================== */

    function getBookings() {

        try {

            const stored =
                localStorage.getItem("cinegoBookings");

            if (stored) {

                const parsed =
                    JSON.parse(stored);

                if (
                    Array.isArray(parsed) &&
                    parsed.length > 0
                ) {

                    return parsed
                        .map(normalizeBooking)
                        .filter(Boolean);
                }
            }

        } catch (error) {

            console.error(
                "❌ Error reading cinegoBookings:",
                error
            );
        }

        /*
            localStorage booking இல்லனா
            demo bookings show ஆகும்.
        */

        return demoBookings
            .map(normalizeBooking)
            .filter(Boolean);
    }


    /* ==========================================================
                        STATUS LABEL
    ========================================================== */

    function statusLabel(status) {

        switch (status) {

            case "booked":
                return "Booking Confirmed";

            case "failed":
                return "Booking Failed";

            case "cancelled":
            case "canceled":
                return "Booking Cancelled";

            default:
                return "Booking Status";
        }
    }


    /* ==========================================================
                        STATUS ICON
    ========================================================== */

    function statusIcon(status) {

        if (status === "booked") {
            return "fa-circle-check";
        }

        if (status === "failed") {
            return "fa-circle-xmark";
        }

        return "fa-circle-exclamation";
    }


    /* ==========================================================
                    ESCAPE HTML
    ========================================================== */

    function escapeHTML(value) {

        if (value === null || value === undefined) {
            return "";
        }

        return String(value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }


    /* ==========================================================
                    SHOW EMPTY STATE
    ========================================================== */

    function showEmpty(filter) {

        const text =
            filter === "all"
                ? "Your bookings will appear here."
                : `Your ${filter} bookings will appear here.`;

        list.innerHTML = `

            <div class="empty">

                <i class="fa-solid fa-ticket"></i>

                <h3>No bookings found</h3>

                <p>${text}</p>

            </div>

        `;
    }


    /* ==========================================================
                    RENDER BOOKINGS
    ========================================================== */

    function renderBookings(filter = "all") {

        const allBookings = getBookings();

        const bookings = allBookings.filter(function (booking) {

            if (filter === "all") {
                return true;
            }

            return booking.status === filter;
        });


        /* No bookings */

        if (!bookings.length) {

            showEmpty(filter);

            return;
        }


        /* Render */

        list.innerHTML = bookings.map(function (b) {

            const movieTitle =
                escapeHTML(b.movieTitle);

            const poster =
                escapeHTML(b.poster);

            const movieKey =
                escapeHTML(b.movieKey);

            const date =
                escapeHTML(b.date);

            const time =
                escapeHTML(b.time);

            const tickets =
                escapeHTML(b.tickets);

            const theater =
                escapeHTML(b.theater);

            const screen =
                escapeHTML(b.screen);

            const seats =
                escapeHTML(b.seats);

            const language =
                escapeHTML(b.language);

            const format =
                escapeHTML(b.format);

            const amount =
                escapeHTML(b.amount);

            const status =
                escapeHTML(b.status);


            return `

                <article
                    class="booking-card"
                    data-booking-id="${escapeHTML(b.id)}"
                >

                    <!-- POSTER -->

                    <img
                        class="poster"
                        src="${poster}"
                        alt="${movieTitle}"
                        onerror="
                            this.src='https://via.placeholder.com/300x420?text=CineGo'
                        "
                    >


                    <!-- MAIN CONTENT -->

                    <div class="booking-main">

                        <h2 class="booking-title">
                            ${movieTitle}
                        </h2>


                        <div class="meta">

                            ${date}

                            &nbsp;•&nbsp;

                            ${time}

                            <br>

                            ${tickets}

                        </div>


                        <!-- INFO GRID -->

                        <div class="info-grid">


                            <div class="info">

                                <label>
                                    Location
                                </label>

                                <span>
                                    ${theater}
                                </span>

                            </div>


                            <div class="info">

                                <label>
                                    Screen
                                </label>

                                <span>
                                    ${screen}
                                </span>

                            </div>


                            <div class="info">

                                <label>
                                    Seats
                                </label>

                                <span>
                                    ${seats}
                                </span>

                            </div>


                            <div class="info">

                                <label>
                                    Format / Language
                                </label>

                                <span>
                                    ${format}
                                    •
                                    ${language}
                                </span>

                            </div>


                        </div>


                        <!-- STATUS -->

                        <span class="status ${status}">

                            <i
                                class="fa-solid ${statusIcon(b.status)}"
                            ></i>

                            ${statusLabel(b.status)}

                        </span>


                    </div>


                    <!-- ACTIONS -->

                    <div class="booking-actions">


                        <div class="amount">

                            <small>
                                Total Paid
                            </small>

                            <strong>
                                ${amount}
                            </strong>

                        </div>


                        <div class="actions">


                            <button
                                type="button"
                                class="button"
                                data-action="details"
                                data-id="${escapeHTML(b.id)}"
                            >

                                View Details

                            </button>


                            ${
                                b.status === "booked"

                                ?

                                `
                                <button
                                    type="button"
                                    class="button primary"
                                    data-action="ticket"
                                    data-id="${escapeHTML(b.id)}"
                                >

                                    <i class="fa-solid fa-ticket"></i>

                                    Ticket

                                </button>
                                `

                                :

                                ""
                            }


                        </div>


                    </div>


                </article>

            `;

        }).join("");


        /*
            Add button events after rendering
        */

        attachBookingEvents();

    }


    /* ==========================================================
                    ATTACH BOOKING EVENTS
    ========================================================== */

    function attachBookingEvents() {

        const buttons =
            list.querySelectorAll("[data-action]");


        buttons.forEach(function (button) {

            button.addEventListener("click", function () {

                const action =
                    button.dataset.action;

                const bookingId =
                    button.dataset.id;


                const booking =
                    getBookings().find(function (item) {

                        return String(item.id) ===
                               String(bookingId);

                    });


                if (!booking) {

                    console.error(
                        "Booking not found:",
                        bookingId
                    );

                    return;
                }


                if (action === "details") {

                    showDetails(booking);

                }


                if (action === "ticket") {

                    downloadTicket(booking);

                }

            });

        });

    }


    /* ==========================================================
                        SHOW DETAILS
    ========================================================== */

    function showDetails(booking) {

        if (!detailContent || !detailsModal) {

            console.error(
                "❌ detailsModal or detailContent not found."
            );

            return;
        }


        const movieTitle =
            escapeHTML(booking.movieTitle);

        const bookingId =
            escapeHTML(booking.id);

        const date =
            escapeHTML(booking.date);

        const time =
            escapeHTML(booking.time);

        const theater =
            escapeHTML(booking.theater);

        const screen =
            escapeHTML(booking.screen);

        const seats =
            escapeHTML(booking.seats);

        const language =
            escapeHTML(booking.language);

        const format =
            escapeHTML(booking.format);

        const tickets =
            escapeHTML(booking.tickets);

        const amount =
            escapeHTML(booking.amount);


        detailContent.innerHTML = `

            <div class="detail-row">

                <span>Booking ID</span>

                <span>
                    ${bookingId || "—"}
                </span>

            </div>


            <div class="detail-row">

                <span>Movie</span>

                <span>
                    ${movieTitle}
                </span>

            </div>


            <div class="detail-row">

                <span>Date & Time</span>

                <span>
                    ${date}
                    •
                    ${time}
                </span>

            </div>


            <div class="detail-row">

                <span>Tickets</span>

                <span>
                    ${tickets}
                </span>

            </div>


            <div class="detail-row">

                <span>Theater</span>

                <span>
                    ${theater}
                </span>

            </div>


            <div class="detail-row">

                <span>Screen</span>

                <span>
                    ${screen}
                </span>

            </div>


            <div class="detail-row">

                <span>Seats</span>

                <span>
                    ${seats}
                </span>

            </div>


            <div class="detail-row">

                <span>Language</span>

                <span>
                    ${language}
                </span>

            </div>


            <div class="detail-row">

                <span>Format</span>

                <span>
                    ${format}
                </span>

            </div>


            <div class="detail-row">

                <span>Total Paid</span>

                <strong>
                    ${amount}
                </strong>

            </div>

        `;


        detailsModal.classList.add("show");

        document.body.classList.add("modal-open");

    }


    /* ==========================================================
                        CLOSE DETAILS
    ========================================================== */

    function closeDetails() {

        if (!detailsModal) {
            return;
        }

        detailsModal.classList.remove("show");

        document.body.classList.remove("modal-open");

    }


    /* ==========================================================
                        DOWNLOAD TICKET
    ========================================================== */

    function downloadTicket(booking) {

        /*
            Temporary ticket action.

            Later இதை QR / PDF ticket system-க்கு
            connect பண்ணலாம்.
        */

        if (!booking) {
            return;
        }

        alert(
            `Ticket\n\n` +
            `Booking ID: ${booking.id}\n` +
            `Movie: ${booking.movieTitle}\n` +
            `Seats: ${booking.seats}\n` +
            `Amount: ${booking.amount}`
        );

    }


    /* ==========================================================
                        TAB FILTER
    ========================================================== */

    const tabs =
        document.querySelectorAll(".tab");


    tabs.forEach(function (tab) {

        tab.addEventListener("click", function () {

            tabs.forEach(function (item) {

                item.classList.remove("active");

            });


            tab.classList.add("active");


            const filter =
                tab.dataset.filter || "all";


            renderBookings(filter);

        });

    });


    /* ==========================================================
                    MODAL BACKDROP CLICK
    ========================================================== */

    if (detailsModal) {

        detailsModal.addEventListener(
            "click",
            function (event) {

                if (
                    event.target === detailsModal
                ) {

                    closeDetails();

                }

            }
        );

    }


    /* ==========================================================
                        ESC KEY
    ========================================================== */

    document.addEventListener(
        "keydown",
        function (event) {

            if (event.key === "Escape") {

                closeDetails();

            }

        }
    );


    /* ==========================================================
                        CLOSE BUTTON
    ========================================================== */

    const closeButton =
        document.querySelector(
            "#detailsModal .close-btn, #detailsModal [data-close]"
        );


    if (closeButton) {

        closeButton.addEventListener(
            "click",
            closeDetails
        );

    }


    /* ==========================================================
                        PROFILE INITIAL
    ========================================================== */

    const userName =
        localStorage.getItem("userName");


    const profileInitial =
        document.getElementById("profileInitial");


    if (
        userName &&
        profileInitial
    ) {

        profileInitial.textContent =
            userName
                .trim()
                .charAt(0)
                .toUpperCase();

    }


    /* ==========================================================
                        INITIAL RENDER
    ========================================================== */
    renderBookings("all");
});