/* ==========================================================
                    BOOKING TIMER
========================================================== */

function startBookingTimer(durationInMinutes) {

    let totalSeconds = durationInMinutes * 60;

    const timer = document.getElementById("timer");

    if (!timer) {
        console.error("Timer element not found!");
        return;
    }

    const interval = setInterval(() => {

        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;

        timer.textContent =
            `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

        if (totalSeconds <= 0) {

            clearInterval(interval);

            timer.textContent = "00:00";

            alert("Booking session expired!");

            return;
        }

        totalSeconds--;

    }, 1000);
}


/* ==========================================================
                    START TIMER
========================================================== */

document.addEventListener("DOMContentLoaded", () => {

    startBookingTimer(7);

});

/* ==========================================================
        MOVIE / THEATRE / SHOW / SEAT SUMMARY
========================================================== */

function loadMovieBookingDetails() {

    /* ======================================================
                    GET LOCAL STORAGE
    ====================================================== */

    const selectedMovie =
        localStorage.getItem("selectedMovie");

    const selectedLanguage =
        localStorage.getItem("selectedLanguage");

    const selectedTheatre =
        JSON.parse(
            localStorage.getItem("selectedTheatre")
        );

    const selectedDate =
        JSON.parse(
            localStorage.getItem("selectedDate")
        );

    const booking =
        JSON.parse(
            localStorage.getItem("booking")
        );


    console.log("========== CHECKOUT DATA ==========");
    console.log("Selected Movie:", selectedMovie);
    console.log("Selected Language:", selectedLanguage);
    console.log("Selected Theatre:", selectedTheatre);
    console.log("Selected Date:", selectedDate);
    console.log("Booking:", booking);


    /* ======================================================
                    GET MOVIE FROM movie-data.js
    ====================================================== */

    if (
        !selectedMovie ||
        typeof movies === "undefined" ||
        !movies[selectedMovie]
    ) {

        console.log(
            "❌ Movie data not found"
        );

        return;
    }


    const movie =
        movies[selectedMovie];


    console.log("✅ Movie Data:", movie);

    /* ======================================================
                        MOVIE POSTER
    ====================================================== */

    const moviePoster =
        document.getElementById("moviePoster");

    if (moviePoster) {

        moviePoster.src =
            booking?.movie?.poster ||
            movie?.poster ||
            "";

        moviePoster.alt =
            movie?.title ||
            "Movie Poster";

    }


    /* ======================================================
                        THEATRE
    ====================================================== */

    const theatreName =
        document.getElementById(
            "theatreName"
        );

    const theatreLocation =
        document.getElementById(
            "theatreLocation"
        );


    if (theatreName) {

        theatreName.textContent =
            selectedTheatre?.name ||
            selectedTheatre?.shortName ||
            "-";
    }


    if (theatreLocation) {

        theatreLocation.textContent =
            selectedTheatre?.location ||
            selectedTheatre?.distance ||
            "-";
    }


    /* ======================================================
                        SHOW DATE
    ====================================================== */

    const showDate =
        document.getElementById(
            "showDate"
        );


    if (showDate) {

        if (selectedDate) {

            showDate.textContent =
                `${selectedDate.day}, ${selectedDate.date} ${selectedDate.month} ${selectedDate.year}`;

        } else {

            showDate.textContent =
                "-";
        }
    }


    /* ======================================================
                        SHOW TIME
    ====================================================== */

    const showTime =
        document.getElementById(
            "showTime"
        );


    if (showTime) {

        showTime.textContent =
            selectedTheatre?.time ||
            "-";
    }


    /* ======================================================
                        SEATS
    ====================================================== */

    const seatRow =
        document.getElementById(
            "seatRow"
        );

    const seatNumbers =
        document.getElementById(
            "seatNumbers"
        );

    const seats =
        Array.isArray(booking?.seats)
            ? booking.seats
            : [];


    /* ======================================================
                        ROW
    ====================================================== */

    if (seatRow) {

        if (seats.length > 0) {

            const firstSeat =
                String(seats[0].name);


            const match =
                firstSeat.match(/^[A-Za-z]+/);


            if (match) {

                seatRow.textContent =
                    `Row ${match[0]}`;

            } else {

                seatRow.textContent =
                    "Row -";
            }

        } else {

            seatRow.textContent =
                "Row -";
        }
    }


    /* ======================================================
                    SEAT NUMBERS
    ====================================================== */

    if (seatNumbers) {

        if (seats.length > 0) {

            seatNumbers.textContent =
                seats
                    .map(seat => seat.name)
                    .join(", ");

        } else {

            seatNumbers.textContent =
                "-";
        }
    }


    /* ======================================================
                    TICKET SUBTOTAL
    ====================================================== */

    const movieTicketSubtotal =
        document.getElementById(
            "movieTicketSubtotal"
        );


    if (movieTicketSubtotal) {

        const subtotal =
            Number(
                booking?.total || 0
            );


        movieTicketSubtotal.textContent =
            `₹${subtotal.toFixed(2)}`;
    }


    /* ======================================================
                        DEBUG
    ====================================================== */

    console.log(
        "Movie:",
        movie.title
    );

    console.log(
        "Theatre:",
        selectedTheatre?.name
    );

    console.log(
        "Location:",
        selectedTheatre?.location
    );

    console.log(
        "Date:",
        selectedDate
    );

    console.log(
        "Time:",
        selectedTheatre?.time
    );

    console.log(
        "Seats:",
        seats.map(
            seat => seat.name
        )
    );

    console.log(
        "Subtotal:",
        booking?.total
    );
}


/* ==========================================================
                        PAGE LOAD
========================================================== */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        resetCouponOnCheckoutStart();
        loadMovieBookingDetails();

    }
);



/* ==========================================================
                    COUPON SECTION
========================================================== */

const offersContainer =
    document.getElementById("offersContainer");

const viewAllBtn =
    document.querySelector(".view-all-offers");

const couponInput =
    document.getElementById("couponInput");

const applyBtn =
    document.getElementById("applyCouponBtn");

const couponMessage =
    document.getElementById("couponMessage");


/* ==========================================================
                    BOOKING DATA
========================================================== */

let booking =
    JSON.parse(
        localStorage.getItem("booking")
    );


if (!booking) {

    console.log("Booking data not found");

}


/* ==========================================================
                    COUPON VARIABLES
========================================================== */

let discountAmount = 0;

let appliedCoupon = null;

let showAllOffers = false;



/* ==========================================================
          RESET COUPON ON CHECKOUT START
========================================================== */

function resetCouponOnCheckoutStart() {

    const currentBooking =
        JSON.parse(
            localStorage.getItem("booking")
        ) || {};


    /*
        Remove previously saved coupon
    */

    delete currentBooking.coupon;


    /*
        Reset discount
    */

    currentBooking.discount = 0;


    /*
        Get original ticket subtotal
    */

    const originalSubtotal =
        Number(
            String(
                currentBooking.subtotal ??
                currentBooking.total ??
                0
            ).replace(/[^\d.]/g, "")
        ) || 0;


    /*
        Reset final ticket price
    */

    currentBooking.finalTicketPrice =
        originalSubtotal;


    /*
        Save clean booking
    */

    localStorage.setItem(
        "booking",
        JSON.stringify(currentBooking)
    );


    /*
        Reset coupon variables
    */

    discountAmount = 0;

    appliedCoupon = null;


    /*
        Reset coupon input
    */

    if (couponInput) {

        couponInput.value = "";

        couponInput.readOnly = false;

    }


    /*
        Reset Apply button
    */

    if (applyBtn) {

        applyBtn.disabled = false;

        applyBtn.innerHTML = `
            <i class="fa-solid fa-tag"></i>
            Apply Coupon
        `;

    }


    /*
        Clear coupon message
    */

    if (couponMessage) {

        couponMessage.innerHTML = "";

    }

}
/* ==========================================================
                    GET TICKET SUBTOTAL
========================================================== */

function getTicketSubtotal() {

    const currentBooking =
        JSON.parse(
            localStorage.getItem("booking")
        );

    if (!currentBooking) {
        return 0;
    }


    /*
       Different places-la subtotal
       different key-la irundha handle pannum.
    */

    let amount = 0;


    if (
        currentBooking.subtotal !== undefined &&
        currentBooking.subtotal !== null
    ) {

        amount =
            Number(
                String(currentBooking.subtotal)
                    .replace(/[^\d.]/g, "")
            );

    }


    /*
       subtotal illa na total check pannum
    */

    if (
        amount <= 0 &&
        currentBooking.total !== undefined
    ) {

        amount =
            Number(
                String(currentBooking.total)
                    .replace(/[^\d.]/g, "")
            );

    }


    /*
       payment.ticketTotal irundhaalum check pannum
    */

    if (
        amount <= 0 &&
        currentBooking.payment?.ticketTotal !== undefined
    ) {

        amount =
            Number(
                currentBooking.payment.ticketTotal
            );

    }


    return amount || 0;
}


/* ==========================================================
                    RENDER OFFERS
========================================================== */

function renderOffers() {

    if (!offersContainer) {
        return;
    }


    offersContainer.innerHTML = "";


    const displayOffers =
        showAllOffers
            ? offers
            : offers.slice(0, 2);


    displayOffers.forEach(function (offer) {

        offersContainer.innerHTML += `

            <div class="col-md-6 d-flex">

                <div
                    class="coupon-card w-100"
                    data-code="${offer.code}"
                >

                    <div class="coupon-icon">

                        <i class="${offer.icon}"></i>

                    </div>


                    <div class="coupon-content">

                        <h6>
                            ${offer.title}
                        </h6>

                        <p>
                            ${offer.description}
                        </p>

                        <span class="coupon-code">
                            ${offer.code}
                        </span>

                    </div>

                </div>

            </div>

        `;

    });


    /* ======================================================
                    CARD CLICK
    ====================================================== */

    document
        .querySelectorAll(".coupon-card")
        .forEach(function (card) {

            card.addEventListener(
                "click",
                function () {

                    if (
                        applyBtn &&
                        applyBtn.disabled
                    ) {
                        return;
                    }


                    couponInput.value =
                        card.dataset.code;


                    couponInput.focus();

                }
            );

        });


    /* ======================================================
                    VIEW ALL BUTTON
    ====================================================== */

    if (viewAllBtn) {

        viewAllBtn.innerHTML =
            showAllOffers

                ? `
                    Show Less
                    <i class="fa-solid fa-chevron-up"></i>
                  `

                : `
                    View All
                    <i class="fa-solid fa-arrow-right"></i>
                  `;

    }

}


/* ==========================================================
                    VIEW ALL
========================================================== */

if (viewAllBtn) {

    viewAllBtn.addEventListener(
        "click",
        function (e) {

            e.preventDefault();

            showAllOffers =
                !showAllOffers;

            renderOffers();

        }
    );

}


/* ==========================================================
                    APPLY COUPON
========================================================== */

if (applyBtn) {

    applyBtn.addEventListener(
        "click",
        function () {

            /* ----------------------------------------------
                    GET CURRENT SUBTOTAL
            ---------------------------------------------- */

            const subtotal =
                getTicketSubtotal();


            console.log(
                "Ticket Subtotal:",
                subtotal
            );


            /* ----------------------------------------------
                    CHECK MINIMUM ₹500
            ---------------------------------------------- */

            if (subtotal < 500) {

                couponMessage.innerHTML = `

                    <div class="alert alert-warning mb-0">

                        <i class="fa-solid fa-circle-exclamation"></i>

                        Coupon can be applied only for
                        ticket totals of
                        <strong>₹500 or above.</strong>

                        <br>

                        Current ticket total:
                        <strong>
                            ₹${subtotal.toFixed(2)}
                        </strong>

                    </div>

                `;

                return;

            }


            /* ----------------------------------------------
                    GET COUPON CODE
            ---------------------------------------------- */

            const code =
                couponInput.value
                    .trim()
                    .toUpperCase();


            if (!code) {

                couponMessage.innerHTML = `

                    <div class="alert alert-danger mb-0">

                        <i class="fa-solid fa-circle-xmark"></i>

                        Please enter a coupon code.

                    </div>

                `;

                return;

            }


            /* ----------------------------------------------
                    FIND OFFER
            ---------------------------------------------- */

            const offer =
                offers.find(function (item) {

                    return (
                        item.code.toUpperCase() === code
                    );

                });


            /* ----------------------------------------------
                    INVALID COUPON
            ---------------------------------------------- */

            if (!offer) {

                couponMessage.innerHTML = `

                    <div class="alert alert-danger mb-0">

                        <i class="fa-solid fa-circle-xmark"></i>

                        Invalid Coupon Code

                    </div>

                `;

                return;

            }


            /* ----------------------------------------------
                    CALCULATE DISCOUNT
            ---------------------------------------------- */

            if (offer.type === "percentage") {

                discountAmount =
                    (subtotal * offer.discount) / 100;

            }

            else {

                discountAmount =
                    offer.discount;

            }


            /* ----------------------------------------------
                    DON'T EXCEED SUBTOTAL
            ---------------------------------------------- */

            discountAmount =
                Math.min(
                    discountAmount,
                    subtotal
                );


            /* ----------------------------------------------
                    FINAL TICKET PRICE
            ---------------------------------------------- */

            const finalTicketPrice =
                Math.max(
                    subtotal - discountAmount,
                    0
                );


            /* ----------------------------------------------
                    SAVE COUPON
            ---------------------------------------------- */

            appliedCoupon = {

                code: offer.code,

                type: offer.type,

                discount: offer.discount,

                discountAmount: discountAmount

            };


            /* ----------------------------------------------
                    SUCCESS MESSAGE
            ---------------------------------------------- */

            couponMessage.innerHTML = `

                <div class="alert alert-success mb-0">

                    <i class="fa-solid fa-circle-check"></i>

                    Coupon
                    <strong>
                        ${offer.code}
                    </strong>

                    applied successfully!

                    <br>

                    You saved
                    <strong>
                        ₹${discountAmount.toFixed(2)}
                    </strong>

                </div>

            `;


            /* ----------------------------------------------
                    UPDATE TICKET SUBTOTAL
            ---------------------------------------------- */

            const movieTicketSubtotal =
                document.getElementById(
                    "movieTicketSubtotal"
                );


            if (movieTicketSubtotal) {

                movieTicketSubtotal.innerHTML = `

                    <del
                        style="
                        color:#888;
                        font-size:16px;
                        "
                    >
                        ₹${subtotal.toFixed(2)}
                    </del>

                    <br>

                    <span
                        style="
                        color:#22c55e;
                        font-size:30px;
                        font-weight:700;
                        "
                    >
                        ₹${finalTicketPrice.toFixed(2)}
                    </span>

                `;

            }


            /* ----------------------------------------------
                    SAVE DISCOUNT
            ---------------------------------------------- */

            const currentBooking =
                JSON.parse(
                    localStorage.getItem("booking")
                );


            if (currentBooking) {

                currentBooking.coupon = {

                    code: offer.code,

                    type: offer.type,

                    discount: offer.discount,

                    discountAmount:
                        discountAmount

                };


                currentBooking.subtotal =
                    subtotal;


                currentBooking.discount =
                    discountAmount;


                currentBooking.finalTicketPrice =
                    finalTicketPrice;


                localStorage.setItem(
                    "booking",
                    JSON.stringify(currentBooking)
                );

            }


            /* ----------------------------------------------
                    UPDATE BILL
            ---------------------------------------------- */

            updateBillSummary();


            /* ----------------------------------------------
                    DISABLE APPLY
            ---------------------------------------------- */

            applyBtn.innerHTML = `

                <i class="fa-solid fa-circle-check"></i>

                Applied

            `;


            applyBtn.disabled = true;


            couponInput.readOnly = true;

        }
    );

}



/* ==========================================================
                    SNACK SECTION
========================================================== */

let snackCart = {};

let selectedSnackCategory = "All";

let showAllSnacks = false;


/* ==========================================================
                    GET ELEMENTS
========================================================== */

const snackContainer =
    document.getElementById("snackContainer");

const snackTotalElement =
    document.getElementById("snackTotal");

const viewAllSnacksButton =
    document.getElementById("viewAllSnacks");

const snackCategoryButtons =
    document.querySelectorAll(
        ".snack-category button"
    );


/* ==========================================================
                    GET BOOKING
========================================================== */

function getBooking() {

    let data =
        JSON.parse(
            localStorage.getItem("booking")
        );

    if (!data) {

        data = {};

    }

    return data;
}


/* ==========================================================
                RESTORE SNACK CART
========================================================== */

function restoreSnackCart() {

    const booking =
        getBooking();


    snackCart = {};


    if (
        Array.isArray(booking.snacks)
    ) {

        booking.snacks.forEach(function (item) {

            if (
                item.id &&
                Number(item.quantity) > 0
            ) {

                snackCart[item.id] =
                    Number(item.quantity);

            }

        });

    }

}


/* ==========================================================
                GET TICKET TOTAL
========================================================== */

function getTicketTotal() {

    const booking =
        getBooking();


    let amount = 0;


    /*
        Priority:

        1. booking.subtotal
        2. booking.total
        3. booking.payment.ticketTotal
    */


    if (
        booking.subtotal !== undefined &&
        booking.subtotal !== null
    ) {

        amount =
            Number(
                String(booking.subtotal)
                    .replace(/[^\d.]/g, "")
            );

    }

    else if (
        booking.total !== undefined &&
        booking.total !== null
    ) {

        amount =
            Number(
                String(booking.total)
                    .replace(/[^\d.]/g, "")
            );

    }

    else if (
        booking.payment &&
        booking.payment.ticketTotal !== undefined
    ) {

        amount =
            Number(
                booking.payment.ticketTotal
            );

    }


    if (!Number.isFinite(amount)) {

        amount = 0;

    }


    return amount;

}


/* ==========================================================
                RENDER SNACKS
========================================================== */

function renderSnacks() {

    if (!snackContainer) {

        console.log(
            "snackContainer not found"
        );

        return;

    }


    let list =
        [...snacks];


    /* ======================================================
                    CATEGORY
    ====================================================== */

    if (
        selectedSnackCategory !== "All"
    ) {

        list =
            list.filter(function (snack) {

                return (
                    snack.category ===
                    selectedSnackCategory
                );

            });

    }


    /* ======================================================
                    VIEW ALL
    ====================================================== */

    if (!showAllSnacks) {

        list =
            list.slice(0, 3);

    }


    /* ======================================================
                    HTML
    ====================================================== */

    let html = "";


    list.forEach(function (snack) {

        const quantity =
            snackCart[snack.id] || 0;


        html += `

            <div class="snack-card">

                <span class="snack-badge ${snack.badgeColor || "green"}">
                    ${snack.badge || ""}
                </span>


                <div class="snack-img">

                    <img
                        src="${snack.image}"
                        alt="${snack.name}"
                    >

                </div>


                <div class="snack-content">

                    <h5>
                        ${snack.name}
                    </h5>


                    <p>
                        ${snack.description}
                    </p>


                    <div class="snack-bottom">


                        <div class="snack-price">

                            <h6>
                                ₹${Number(snack.price).toFixed(2)}
                            </h6>

                            <small>
                                Inclusive of taxes
                            </small>

                        </div>


                        ${quantity === 0

                ?

                `
                            <button
                                type="button"
                                class="add-btn"
                                data-snack-id="${snack.id}"
                            >
                                ADD
                            </button>
                            `

                :

                `
                            <div
                                class="quantity-btn"
                                data-snack-id="${snack.id}"
                            >

                                <button
                                    type="button"
                                    class="minus"
                                >
                                    -
                                </button>


                                <span>
                                    ${quantity}
                                </span>


                                <button
                                    type="button"
                                    class="plus"
                                >
                                    +
                                </button>

                            </div>
                            `
            }


                    </div>

                </div>

            </div>

        `;

    });


    snackContainer.innerHTML =
        html;


    /* ======================================================
                VIEW ALL BUTTON
    ====================================================== */

    if (viewAllSnacksButton) {

        viewAllSnacksButton.innerHTML =

            showAllSnacks

                ?

                `
                View Less
                <i class="fa-solid fa-arrow-up"></i>
                `

                :

                `
                View All
                <i class="fa-solid fa-arrow-right"></i>
                `;

    }

}


/* ==========================================================
                ADD / PLUS / MINUS
========================================================== */

if (snackContainer) {

    snackContainer.addEventListener(
        "click",
        function (event) {


            const wrapper =
                event.target.closest(
                    "[data-snack-id]"
                );


            if (!wrapper) {

                return;

            }


            const id =
                Number(
                    wrapper.dataset.snackId
                );


            /* ==================================================
                        ADD
            ================================================== */

            if (
                event.target.classList.contains(
                    "add-btn"
                )
            ) {

                snackCart[id] = 1;

            }


            /* ==================================================
                        PLUS
            ================================================== */

            else if (
                event.target.classList.contains(
                    "plus"
                )
            ) {

                snackCart[id] =
                    (snackCart[id] || 0) + 1;

            }


            /* ==================================================
                        MINUS
            ================================================== */

            else if (
                event.target.classList.contains(
                    "minus"
                )
            ) {

                snackCart[id] =
                    (snackCart[id] || 0) - 1;


                if (
                    snackCart[id] <= 0
                ) {

                    delete snackCart[id];

                }

            }


            renderSnacks();

            updateBillSummary();

        }
    );

}


/* ==========================================================
                CATEGORY BUTTONS
========================================================== */

snackCategoryButtons.forEach(
    function (button) {

        button.addEventListener(
            "click",
            function () {


                snackCategoryButtons.forEach(
                    function (btn) {

                        btn.classList.remove(
                            "active"
                        );

                    }
                );


                this.classList.add(
                    "active"
                );


                selectedSnackCategory =
                    this.dataset.category;


                renderSnacks();

            }
        );

    }
);


/* ==========================================================
                    VIEW ALL
========================================================== */

if (viewAllSnacksButton) {

    viewAllSnacksButton.addEventListener(
        "click",
        function (event) {

            event.preventDefault();


            showAllSnacks =
                !showAllSnacks;


            renderSnacks();

        }
    );

}


/* ==========================================================
                CALCULATE SNACK TOTAL
========================================================== */

function calculateSnackTotal() {

    let total = 0;


    snacks.forEach(
        function (snack) {

            const quantity =
                snackCart[snack.id] || 0;


            total +=
                Number(snack.price) *
                quantity;

        }
    );


    return total;

}

/* ==========================================================
                CONVENIENCE FEE
========================================================== */

function calculateConvenienceFee(
    ticketAmount
) {

    if (ticketAmount <= 300) {

        return 25;

    }


    if (ticketAmount <= 500) {

        return 35;

    }


    if (ticketAmount <= 1000) {

        return 45;

    }


    return 60;

}









/* ----------------------------------------------------------
                INITIALIZE CUSTOMER
---------------------------------------------------------- */

if (!booking.customer) {

    booking.customer = {};

}


customerFields.forEach(function (field) {

    if (
        booking.customer[field.key] === undefined
    ) {

        booking.customer[field.key] = "";

    }

});


/* ----------------------------------------------------------
                RENDER CUSTOMER FORM
---------------------------------------------------------- */

function renderCustomerForm() {

    const container =
        document.getElementById(
            "customerForm"
        );


    if (!container) {

        console.log(
            "customerForm not found"
        );

        return;

    }


    let html =
        `<div class="row">`;


    customerFields.forEach(function (field) {

        html += `

            <div class="col-md-${field.col} mb-3">

                <label
                    for="${field.id}"
                    class="form-label"
                >
                    ${field.label}
                </label>


                <input

                    type="${field.type}"

                    id="${field.id}"

                    class="form-control"

                    placeholder="${field.placeholder}"

                    value="${booking.customer[field.key] || ""}"

                    autocomplete="off"

                >

            </div>

        `;

    });


    html += `
        </div>
    `;


    container.innerHTML =
        html;


    attachCustomerEvents();

}


/* ----------------------------------------------------------
                AUTO SAVE INPUT
---------------------------------------------------------- */

function attachCustomerEvents() {

    customerFields.forEach(function (field) {

        const input =
            document.getElementById(
                field.id
            );


        if (!input) {
            return;
        }


        input.addEventListener(
            "input",
            function () {

                booking.customer[field.key] =
                    this.value.trim();


                localStorage.setItem(
                    "booking",
                    JSON.stringify(booking)
                );

            }
        );

    });

}


/* ----------------------------------------------------------
                VALIDATION
---------------------------------------------------------- */

function validateCustomerDetails() {

    /* ------------------------------------
                    NAME
    ------------------------------------ */

    const name =
        booking.customer.name.trim();


    if (name.length < 3) {

        alert(
            "Please enter a valid name."
        );

        document
            .getElementById("customerName")
            ?.focus();

        return false;

    }


    /* ------------------------------------
                    EMAIL
    ------------------------------------ */

    const email =
        booking.customer.email.trim();


    const emailPattern =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


    if (!emailPattern.test(email)) {

        alert(
            "Please enter a valid email address."
        );

        document
            .getElementById("customerEmail")
            ?.focus();

        return false;

    }


    /* ------------------------------------
                    PHONE
    ------------------------------------ */

    const phone =
        booking.customer.phone.trim();


    /*
       Indian 10 digit mobile number
       Starting from 6,7,8,9
    */

    const phonePattern =
        /^[6-9]\d{9}$/;


    if (!phonePattern.test(phone)) {

        alert(
            "Please enter a valid 10 digit mobile number."
        );

        document
            .getElementById("customerPhone")
            ?.focus();

        return false;

    }


    /* ------------------------------------
                    CITY
    ------------------------------------ */

    const city =
        booking.customer.city.trim();


    if (city.length < 2) {

        alert(
            "Please enter your city."
        );

        document
            .getElementById("customerCity")
            ?.focus();

        return false;

    }


    return true;

}


/* ==========================================================
                    SUBMIT BUTTON
========================================================== */

const submitBtn =
    document.getElementById(
        "submitBtn"
    );


if (submitBtn) {

    submitBtn.addEventListener(
        "click",
        function () {


            /* ==========================================
                    GET LATEST INPUT VALUES
            ========================================== */

            customerFields.forEach(
                function (field) {

                    const input =
                        document.getElementById(
                            field.id
                        );


                    if (input) {

                        booking.customer[field.key] =
                            input.value.trim();

                    }

                }
            );


            /* ==========================================
                    VALIDATE
            ========================================== */

            if (
                !validateCustomerDetails()
            ) {

                return;

            }


            /* ==========================================
                    SAVE FINAL CUSTOMER DETAILS
            ========================================== */

            localStorage.setItem(
                "booking",
                JSON.stringify(booking)
            );


            console.log(
                "Customer Details Saved"
            );

            console.log(
                booking.customer
            );


            /* ==========================================
                    SUCCESS
            ========================================== */

            alert(
                "Customer details saved successfully!"
            );

        }
    );

}


/* ==========================================================
                    PAGE LOAD
========================================================== */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        renderCustomerForm();

    }
);



/* ==========================================================
   PAYMENT METHOD SYSTEM
   Simple Corporate-Level Logic
========================================================== */


/* ==========================================================
   BOOKING
========================================================== */

let paymentBooking =
    JSON.parse(
        localStorage.getItem("booking")
    ) || {};


/* ==========================================================
   PAYMENT STATE
========================================================== */

let selectedPaymentMethod = "";

let selectedUpiApp = "";

let selectedBank = "";

let allBanksVisible = false;


/* ==========================================================
   DOM ELEMENTS
========================================================== */

const paymentRadios =
    document.querySelectorAll(
        'input[name="payment"]'
    );


const upiButtons =
    document.querySelectorAll(
        ".upi-btn"
    );


const bankItems =
    document.querySelectorAll(
        ".bank-item"
    );


const upiSection =
    document.getElementById(
        "upiSection"
    );


const cardSection =
    document.getElementById(
        "cardSection"
    );


const netBankingSection =
    document.getElementById(
        "netBankingSection"
    );


const bankSearch =
    document.getElementById(
        "bankSearch"
    );


const viewAllBanks =
    document.getElementById(
        "viewAllBanks"
    );


const payNowBtn =
    document.getElementById(
        "payNowBtn"
    );


const paymentError =
    document.getElementById(
        "paymentError"
    );


const paymentSuccess =
    document.getElementById(
        "paymentSuccess"
    );


const selectedBankMessage =
    document.getElementById(
        "selectedBankMessage"
    );


/* ==========================================================
   UPI ELEMENTS
========================================================== */

const upiId =
    document.getElementById(
        "upiId"
    );


const upiError =
    document.getElementById(
        "upiError"
    );


/* ==========================================================
   CARD ELEMENTS
========================================================== */

const cardNumber =
    document.getElementById(
        "cardNumber"
    );


const cardHolder =
    document.getElementById(
        "cardHolder"
    );


const cardExpiry =
    document.getElementById(
        "cardExpiry"
    );


const cardCvv =
    document.getElementById(
        "cardCvv"
    );


/* ==========================================================
   PAYMENT OBJECT
========================================================== */

paymentBooking.payment =
    paymentBooking.payment || {};


/* ==========================================================
   SELECT PAYMENT
========================================================== */

function selectPayment(method) {

    /*
        Save selected method
    */

    selectedPaymentMethod =
        method;


    /*
        Clear old messages
    */

    clearPaymentMessages();


    /*
        Select correct radio
    */

    paymentRadios.forEach(
        function (radio) {

            radio.checked =
                radio.value === method;

        }
    );


    /*
        Close ALL sections first
    */

    closeAllPaymentSections();


    /*
        Open only selected section
    */

    if (
        method === "upi"
    ) {

        if (upiSection) {

            upiSection.style.display =
                "block";

        }

    }


    if (
        method === "card"
    ) {

        if (cardSection) {

            cardSection.style.display =
                "block";

        }

    }


    if (
        method === "netbanking"
    ) {

        if (netBankingSection) {

            netBankingSection.style.display =
                "block";

        }

    }


    /*
        Save payment method
    */

    savePaymentMethod();


    console.log(
        "Selected Payment:",
        selectedPaymentMethod
    );
}


/* ==========================================================
   CLOSE ALL PAYMENT SECTIONS
========================================================== */

function closeAllPaymentSections() {

    if (upiSection) {

        upiSection.style.display =
            "none";

    }


    if (cardSection) {

        cardSection.style.display =
            "none";

    }


    if (netBankingSection) {

        netBankingSection.style.display =
            "none";

    }

}


/* ==========================================================
   PAYMENT RADIO CHANGE
========================================================== */

paymentRadios.forEach(
    function (radio) {

        radio.addEventListener(
            "change",
            function () {

                selectPayment(
                    this.value
                );

            }
        );

    }
);


/* ==========================================================
   UPI APP SELECTION
========================================================== */

upiButtons.forEach(
    function (button) {

        button.addEventListener(
            "click",
            function () {

                /*
                    Remove active from all UPI buttons
                */

                upiButtons.forEach(
                    function (btn) {

                        btn.classList.remove(
                            "active"
                        );

                    }
                );


                /*
                    Add active
                */

                this.classList.add(
                    "active"
                );


                /*
                    Save selected UPI app
                */

                selectedUpiApp =
                    this.dataset.upi || "";


                /*
                    Automatically select UPI
                */

                selectPayment(
                    "upi"
                );


                /*
                    Clear errors
                */

                clearPaymentMessages();


                console.log(
                    "Selected UPI App:",
                    selectedUpiApp
                );

            }
        );

    }
);


/* ==========================================================
   UPI ID INPUT
========================================================== */

if (upiId) {

    upiId.addEventListener(
        "input",
        function () {

            if (upiError) {

                upiError.textContent =
                    "";

            }


            if (paymentError) {

                paymentError.textContent =
                    "";

            }

        }
    );

}


/* ==========================================================
   CARD NUMBER FORMAT
========================================================== */

if (cardNumber) {

    cardNumber.addEventListener(
        "input",
        function () {

            /*
                Remove letters/symbols
            */

            let value =
                this.value
                    .replace(/\D/g, "");


            /*
                Maximum 16 digits
            */

            value =
                value.substring(
                    0,
                    16
                );


            /*
                Add spaces every 4 digits
            */

            let formatted =
                value.match(
                    /.{1,4}/g
                );


            this.value =
                formatted
                    ? formatted.join(" ")
                    : "";

        }
    );

}


/* ==========================================================
   CARD HOLDER
========================================================== */

if (cardHolder) {

    cardHolder.addEventListener(
        "input",
        function () {

            this.value =
                this.value.replace(
                    /[^a-zA-Z\s]/g,
                    ""
                );

        }
    );

}


/* ==========================================================
   CARD EXPIRY
========================================================== */

if (cardExpiry) {

    cardExpiry.addEventListener(
        "input",
        function () {

            /*
                Only numbers
            */

            let value =
                this.value
                    .replace(/\D/g, "");


            /*
                Maximum 4 digits
            */

            value =
                value.substring(
                    0,
                    4
                );


            /*
                MM/YY
            */

            if (
                value.length > 2
            ) {

                value =
                    value.substring(
                        0,
                        2
                    )
                    + "/"
                    +
                    value.substring(
                        2
                    );

            }


            this.value =
                value;

        }
    );

}


/* ==========================================================
   CVV
========================================================== */

if (cardCvv) {

    cardCvv.addEventListener(
        "input",
        function () {

            this.value =
                this.value
                    .replace(/\D/g, "")
                    .substring(
                        0,
                        3
                    );

        }
    );

}


/* ==========================================================
   BANK SELECTION
========================================================== */

bankItems.forEach(
    function (bank) {

        bank.addEventListener(
            "click",
            function () {

                /*
                    Remove active from all banks
                */

                bankItems.forEach(
                    function (item) {

                        item.classList.remove(
                            "active"
                        );


                        const icon =
                            item.querySelector(
                                "i"
                            );


                        if (icon) {

                            icon.className =
                                "fa-solid fa-chevron-right";

                        }

                    }
                );


                /*
                    Add active to selected bank
                */

                this.classList.add(
                    "active"
                );


                /*
                    Change icon
                */

                const icon =
                    this.querySelector(
                        "i"
                    );


                if (icon) {

                    icon.className =
                        "fa-solid fa-check";

                }


                /*
                    Save bank
                */

                selectedBank =
                    this.dataset.bank || "";


                /*
                    Automatically select
                    Net Banking
                */

                selectPayment(
                    "netbanking"
                );


                /*
                    Show selected bank
                */

                if (
                    selectedBankMessage
                ) {

                    selectedBankMessage.textContent =
                        "Selected Bank: " +
                        selectedBank;

                }


                clearPaymentMessages();


                console.log(
                    "Selected Bank:",
                    selectedBank
                );

            }
        );

    }
);


/* ==========================================================
   BANK SEARCH
========================================================== */

if (bankSearch) {

    bankSearch.addEventListener(
        "input",
        function () {

            const searchValue =
                this.value
                    .trim()
                    .toLowerCase();


            bankItems.forEach(
                function (bank) {

                    const bankName =
                        (
                            bank.dataset.bank ||
                            ""
                        )
                            .toLowerCase();


                    if (
                        bankName.includes(
                            searchValue
                        )
                    ) {

                        bank.style.display =
                            "flex";

                    } else {

                        bank.style.display =
                            "none";

                    }

                }
            );

        }
    );

}


/* ==========================================================
   VIEW ALL BANKS
========================================================== */

if (viewAllBanks) {

    viewAllBanks.addEventListener(
        "click",
        function () {

            allBanksVisible =
                !allBanksVisible;


            bankItems.forEach(
                function (bank, index) {

                    /*
                        First 4 banks always visible
                    */

                    if (
                        index < 4
                    ) {

                        bank.style.display =
                            "flex";

                        return;

                    }


                    /*
                        Other banks
                    */

                    if (
                        allBanksVisible
                    ) {

                        bank.style.display =
                            "flex";

                    } else {

                        bank.style.display =
                            "none";

                    }

                }
            );


            /*
                Change button
            */

            if (
                allBanksVisible
            ) {

                this.innerHTML =
                    `
                    <span>
                        View Less Banks
                    </span>

                    <i class="fa-solid fa-angle-up"></i>
                    `;

            } else {

                this.innerHTML =
                    `
                    <span>
                        View All Banks
                    </span>

                    <i class="fa-solid fa-angle-right"></i>
                    `;

            }

        }
    );

}


/* ==========================================================
   VALIDATE UPI
========================================================== */

function validateUpi() {

    const value =
        upiId
            ? upiId.value.trim()
            : "";


    /*
        Empty UPI ID
    */

    if (
        value === ""
    ) {

        showPaymentError(
            "Please enter your UPI ID."
        );


        if (upiError) {

            upiError.textContent =
                "UPI ID is required.";

        }


        return false;

    }


    /*
        UPI format
    */

    const upiPattern =
        /^[a-zA-Z0-9._-]+@[a-zA-Z]{2,}$/;


    if (
        !upiPattern.test(
            value
        )
    ) {

        showPaymentError(
            "Please enter a valid UPI ID."
        );


        if (upiError) {

            upiError.textContent =
                "Example: username@upi";

        }


        return false;

    }


    return true;
}


/* ==========================================================
   VALIDATE CARD
========================================================== */

function validateCard() {

    const number =
        cardNumber
            ? cardNumber.value
                .replace(/\s/g, "")
            : "";


    const holder =
        cardHolder
            ? cardHolder.value.trim()
            : "";


    const expiry =
        cardExpiry
            ? cardExpiry.value.trim()
            : "";


    const cvv =
        cardCvv
            ? cardCvv.value.trim()
            : "";


    /*
        Card Number
    */

    if (
        !/^\d{16}$/.test(
            number
        )
    ) {

        showPaymentError(
            "Please enter a valid 16-digit card number."
        );

        return false;

    }


    /*
        Card Holder
    */

    if (
        holder.length < 3
    ) {

        showPaymentError(
            "Please enter card holder name."
        );

        return false;

    }


    /*
        Expiry
    */

    if (
        !/^\d{2}\/\d{2}$/.test(
            expiry
        )
    ) {

        showPaymentError(
            "Please enter expiry as MM/YY."
        );

        return false;

    }


    const expiryParts =
        expiry.split("/");


    const month =
        Number(
            expiryParts[0]
        );


    /*
        Invalid month
    */

    if (
        month < 1 ||
        month > 12
    ) {

        showPaymentError(
            "Invalid expiry month."
        );

        return false;

    }


    /*
        CVV
    */

    if (
        !/^\d{3}$/.test(
            cvv
        )
    ) {

        showPaymentError(
            "Please enter a valid 3-digit CVV."
        );

        return false;

    }


    return true;
}


/* ==========================================================
   VALIDATE NET BANKING
========================================================== */

function validateNetBanking() {

    if (
        selectedBank === ""
    ) {

        showPaymentError(
            "Please select your bank."
        );

        return false;

    }


    return true;
}


/* ==========================================================
   SAVE PAYMENT METHOD
========================================================== */

function savePaymentMethod() {

    paymentBooking =
        JSON.parse(
            localStorage.getItem("booking")
        ) || {};


    paymentBooking.payment =
        paymentBooking.payment || {};


    /*
        Save method
    */

    paymentBooking.payment.method =
        selectedPaymentMethod;


    /*
        Save UPI app
    */

    if (
        selectedPaymentMethod === "upi"
    ) {

        paymentBooking.payment.upiApp =
            selectedUpiApp;

    }


    /*
        Save bank
    */

    if (
        selectedPaymentMethod === "netbanking"
    ) {

        paymentBooking.payment.bank =
            selectedBank;

    }


    /*
        Save booking
    */

    localStorage.setItem(
        "booking",
        JSON.stringify(
            paymentBooking
        )
    );

}


/* ==========================================================
   VALIDATE PAYMENT
========================================================== */

function validatePayment() {

    clearPaymentMessages();


    /*
        Get selected radio
        if state is empty
    */

    if (
        selectedPaymentMethod === ""
    ) {

        const checked =
            document.querySelector(
                'input[name="payment"]:checked'
            );


        if (checked) {

            selectedPaymentMethod =
                checked.value;

        }

    }


    /*
    
        No payment method
    */

    if (
        selectedPaymentMethod === ""
    ) {

        showPaymentError(
            "Please select a payment method."
        );

        return false;

    }


    /*
        UPI
    */

    if (
        selectedPaymentMethod ===
        "upi"
    ) {

        return validateUpi();

    }


    /*
        CARD
    */

    if (
        selectedPaymentMethod ===
        "card"
    ) {

        return validateCard();

    }


    /*
        NET BANKING
    */

    if (
        selectedPaymentMethod ===
        "netbanking"
    ) {

        return validateNetBanking();

    }


    return false;
}


/* ==========================================================
   SUCCESS POPUP
========================================================== */

const successPopup =
    document.getElementById("successPopup");

const viewTicketBtn =
    document.getElementById("viewTicketBtn");

const homeBtn =
    document.getElementById("homeBtn");


/* ==========================================================
   SHOW SUCCESS POPUP
========================================================== */

function showSuccessPopup() {

    const booking =
        JSON.parse(
            localStorage.getItem("booking")
        ) || {};

    if (!successPopup) {
        console.error("❌ successPopup not found!");
        return;
    }


    /* ======================================================
       BOOKING ID
    ====================================================== */

    const bookingId =
        booking.bookingId ||
        booking.id ||
        "CG" + Date.now().toString().slice(-8);


    /* Save generated booking ID */

    booking.bookingId =
        bookingId;


    /* ======================================================
       MOVIE
    ====================================================== */

    let movieTitle = "-";

    if (
        booking.movie &&
        booking.movie.title
    ) {

        movieTitle =
            booking.movie.title;

    }

    else {

        const selectedMovie =
            localStorage.getItem(
                "selectedMovie"
            );

        if (
            selectedMovie &&
            typeof movies !== "undefined" &&
            movies[selectedMovie]
        ) {

            movieTitle =
                movies[selectedMovie].title;

        }

    }


    /* ======================================================
       THEATRE
    ====================================================== */

    const selectedTheatre =
        JSON.parse(
            localStorage.getItem(
                "selectedTheatre"
            )
        ) || {};


    const theatre =
        booking.theatre?.name ||
        selectedTheatre.name ||
        "-";


    /* ======================================================
       SHOW DATE + TIME
    ====================================================== */

    const selectedDate =
        JSON.parse(
            localStorage.getItem(
                "selectedDate"
            )
        ) || {};


    let dateText = "-";


    if (booking.date) {

        if (
            typeof booking.date === "object"
        ) {

            dateText =
                `${booking.date.day}, ` +
                `${booking.date.date} ` +
                `${booking.date.month} ` +
                `${booking.date.year}`;

        }

        else {

            dateText =
                booking.date;

        }

    }

    else if (selectedDate.date) {

        dateText =
            `${selectedDate.day}, ` +
            `${selectedDate.date} ` +
            `${selectedDate.month} ` +
            `${selectedDate.year}`;

    }


    const showTime =
        booking.show?.time ||
        selectedTheatre.time ||
        "-";


    const showText =
        dateText !== "-"
            ? `${dateText} • ${showTime}`
            : showTime;


    /* ======================================================
       SEATS
    ====================================================== */

    const seats =
        Array.isArray(booking.seats)
            ? booking.seats
            : [];


    const seatText =
        seats
            .map(function (seat) {

                return typeof seat === "object"
                    ? seat.name
                    : seat;

            })
            .filter(Boolean)
            .join(", ") || "-";


    /* ======================================================
       FINAL AMOUNT PAID
    ====================================================== */

    let grandTotal = 0;


    /*
       First calculate the latest checkout total
    */

    if (
        typeof window.updateBillSummary === "function"
    ) {

        const totals =
            window.updateBillSummary();

        if (totals) {

            grandTotal =
                Number(
                    totals.grandTotal || 0
                );

        }

    }


    /*
       Fallback from localStorage
    */

    if (
        grandTotal <= 0
    ) {

        const latestBooking =
            JSON.parse(
                localStorage.getItem("booking")
            ) || {};

        grandTotal =
            Number(
                latestBooking.payment?.grandTotal ||
                latestBooking.finalTotal ||
                latestBooking.total ||
                0
            );

    }

    /* ======================================================
       PUT DATA INTO POPUP
    ====================================================== */

    const bookingIdElement =
        document.getElementById(
            "successBookingId"
        );

    const movieElement =
        document.getElementById(
            "successMovie"
        );

    const theatreElement =
        document.getElementById(
            "successTheatre"
        );

    const showElement =
        document.getElementById(
            "successShow"
        );

    const seatsElement =
        document.getElementById(
            "successSeats"
        );

    const amountElement =
        document.getElementById(
            "successAmount"
        );


    if (bookingIdElement) {

        bookingIdElement.textContent =
            bookingId;

    }


    if (movieElement) {

        movieElement.textContent =
            movieTitle;

    }


    if (theatreElement) {

        theatreElement.textContent =
            theatre;

    }


    if (showElement) {

        showElement.textContent =
            showText;

    }


    if (seatsElement) {

        seatsElement.textContent =
            seatText;

    }


    if (amountElement) {

        amountElement.textContent =
            `₹${grandTotal.toFixed(2)}`;

    }


    /* ======================================================
       SAVE BOOKING ID
    ====================================================== */

    localStorage.setItem(
        "booking",
        JSON.stringify(booking)
    );


    /* ======================================================
       OPEN POPUP
    ====================================================== */

    successPopup.classList.add("show");

    document.body.style.overflow =
        "hidden";


    console.log(
        "✅ SUCCESS POPUP OPENED"
    );

}


/* ==========================================================
   VIEW TICKET
========================================================== */

if (viewTicketBtn) {

    viewTicketBtn.addEventListener(
        "click",
        function () {

            /*
                If you have ticket page,
                change this path.
            */

            window.location.href =
                "ticket.html";

        }
    );

}


/* ==========================================================
   HOME
========================================================== */

if (homeBtn) {

    homeBtn.addEventListener(
        "click",
        function () {

            window.location.href =
                "index.html";

        }
    );

}


/* ==========================================================
   PAY NOW
========================================================== */

if (payNowBtn) {

    payNowBtn.addEventListener(
        "click",
        function () {

            clearPaymentMessages();


            const valid =
                validatePayment();


            if (!valid) {

                return;

            }


            savePaymentMethod();


            paymentBooking =
                JSON.parse(
                    localStorage.getItem("booking")
                ) || {};


            paymentBooking.payment =
                paymentBooking.payment || {};

            paymentBooking.payment.status =
                "success";


            paymentBooking.payment.paidAt =
                new Date().toISOString();

            localStorage.setItem(
                "booking",
                JSON.stringify(
                    paymentBooking
                )
            );


            if (paymentSuccess) {

                paymentSuccess.textContent =
                    "Payment completed successfully.";

            }


            /* ======================================================
               SHOW SUCCESS POPUP
            ====================================================== */

            setTimeout(function () {

                showSuccessPopup();

            }, 300);


            console.log(
                "✅ Payment completed successfully:",
                paymentBooking
            );

        }
    );

}


/* ==========================================================
   SHOW PAYMENT ERROR
========================================================== */

function showPaymentError(
    message
) {

    if (
        paymentError
    ) {
        paymentError.textContent =
            message;

    }

}


/* ==========================================================
   CLEAR PAYMENT MESSAGES
========================================================== */

function clearPaymentMessages() {

    if (
        paymentError
    ) {

        paymentError.textContent =
            "";

    }


    if (
        paymentSuccess
    ) {

        paymentSuccess.textContent =
            "";

    }


    if (
        upiError
    ) {

        upiError.textContent =
            "";

    }

}


/* ==========================================================
   INITIAL BANK DISPLAY
========================================================== */

function initializeBanks() {

    bankItems.forEach(
        function (bank, index) {

            /*
                First 4 banks visible
            */

            if (
                index < 4
            ) {

                bank.style.display =
                    "flex";

            } else {

                bank.style.display =
                    "none";

            }

        }
    );


    /*
        Reset View All button
    */

    allBanksVisible =
        false;


    if (
        viewAllBanks
    ) {

        viewAllBanks.innerHTML =
            `
            <span>
                View All Banks
            </span>

            <i class="fa-solid fa-angle-right"></i>
            `;

    }

}


/* ==========================================================
   INITIAL PAYMENT STATE
========================================================== */

function initializePayment() {

    /*
        IMPORTANT:
        All sections CLOSED initially
    */

    closeAllPaymentSections();


    /*
        No payment method selected
    */

    selectedPaymentMethod =
        "";


    selectedUpiApp =
        "";


    selectedBank =
        "";


    /*
        Uncheck all radios
    */

    paymentRadios.forEach(
        function (radio) {

            radio.checked =
                false;

        }
    );


    /*
        Remove active UPI
    */

    upiButtons.forEach(
        function (button) {

            button.classList.remove(
                "active"
            );

        }
    );


    /*
        Remove active bank
    */

    bankItems.forEach(
        function (bank) {

            bank.classList.remove(
                "active"
            );


            const icon =
                bank.querySelector(
                    "i"
                );


            if (icon) {

                icon.className =
                    "fa-solid fa-chevron-right";

            }

        }
    );




    if (
        selectedBankMessage
    ) {

        selectedBankMessage.textContent =
            "";

    }


    /*
        Clear messages
    */

    clearPaymentMessages();

}


/* ==========================================================
   PAGE INITIALIZATION
========================================================== */

initializePayment();

initializeBanks();


console.log(
    "Payment system loaded."
);

console.log(
    "All payment sections are initially closed."
);


/* ==========================================================
   CINEGO FINAL CHECKOUT TOTAL SYNC
   ========================================================== */

(function () {

    console.log("🔥 FINAL CHECKOUT SYNC LOADED");


    /* ======================================================
       GET BOOKING
    ====================================================== */

    function finalGetBooking() {

        try {

            return JSON.parse(
                localStorage.getItem("booking")
            ) || {};

        } catch (error) {

            console.error(
                "Booking JSON error:",
                error
            );

            return {};

        }

    }


    /* ======================================================
       GET BASE TICKET SUBTOTAL
    ====================================================== */

    function finalGetBaseTicketSubtotal() {

        const booking =
            finalGetBooking();


        let subtotal = 0;


        /* -----------------------------------------------
           1. booking.subtotal
        ----------------------------------------------- */

        if (
            booking.subtotal !== undefined &&
            booking.subtotal !== null
        ) {

            subtotal =
                Number(
                    String(
                        booking.subtotal
                    ).replace(
                        /[^\d.]/g,
                        ""
                    )
                );

        }


        /* -----------------------------------------------
           2. booking.total
        ----------------------------------------------- */

        if (
            (!Number.isFinite(subtotal) ||
                subtotal <= 0) &&
            booking.total !== undefined &&
            booking.total !== null
        ) {

            subtotal =
                Number(
                    String(
                        booking.total
                    ).replace(
                        /[^\d.]/g,
                        ""
                    )
                );

        }


        if (
            !Number.isFinite(subtotal) ||
            subtotal < 0
        ) {

            subtotal = 0;

        }


        return subtotal;

    }

    /* ======================================================
                     GET DISCOUNT
    ====================================================== */

    function finalGetDiscount() {

        const booking =
            finalGetBooking();


        if (
            !booking.coupon ||
            !booking.coupon.code
        ) {

            return 0;

        }


        const discount =
            Number(
                booking.coupon.discountAmount || 0
            );


        if (
            !Number.isFinite(discount) ||
            discount < 0
        ) {

            return 0;

        }


        return discount;

    }

    /* ======================================================
       GET SNACK TOTAL
    ====================================================== */

    function finalGetSnackTotal() {

        let total = 0;


        if (
            typeof snacks === "undefined" ||
            !Array.isArray(snacks)
        ) {

            return 0;

        }


        if (
            typeof snackCart === "undefined" ||
            !snackCart
        ) {

            return 0;

        }


        snacks.forEach(
            function (snack) {

                const quantity =
                    Number(
                        snackCart[snack.id] || 0
                    );


                if (quantity > 0) {

                    total +=
                        Number(
                            snack.price
                        ) *
                        quantity;

                }

            }
        );


        return total;

    }


    /* ======================================================
       CONVENIENCE FEE
    ====================================================== */

    function finalGetConvenienceFee(
        ticketAfterDiscount
    ) {

        if (
            ticketAfterDiscount <= 300
        ) {

            return 25;

        }


        if (
            ticketAfterDiscount <= 500
        ) {

            return 35;

        }


        if (
            ticketAfterDiscount <= 1000
        ) {

            return 45;

        }


        return 60;

    }


    /* ======================================================
       CALCULATE EVERYTHING
    ====================================================== */

    function finalCalculateTotals() {

        const booking =
            finalGetBooking();


        /* -----------------------------------------------
           BASE TICKET
        ----------------------------------------------- */

        const baseTicket =
            finalGetBaseTicketSubtotal();


        /* -----------------------------------------------
           DISCOUNT
        ----------------------------------------------- */

        const discount =
            Math.min(
                finalGetDiscount(),
                baseTicket
            );


        /* -----------------------------------------------
           FINAL TICKET
        ----------------------------------------------- */

        const finalTicket =
            Math.max(
                baseTicket - discount,
                0
            );


        /* -----------------------------------------------
           SNACKS
        ----------------------------------------------- */

        const snackTotal =
            finalGetSnackTotal();


        /* -----------------------------------------------
           FEE
        ----------------------------------------------- */

        const convenienceFee =
            finalGetConvenienceFee(
                finalTicket
            );


        /* -----------------------------------------------
           GRAND TOTAL
        ----------------------------------------------- */

        const grandTotal =
            finalTicket +
            snackTotal +
            convenienceFee;


        return {

            baseTicket:
                baseTicket,

            discount:
                discount,

            finalTicket:
                finalTicket,

            snackTotal:
                snackTotal,

            convenienceFee:
                convenienceFee,

            grandTotal:
                grandTotal

        };

    }


    /* ======================================================
       UPDATE BILL SUMMARY
    ====================================================== */

    window.updateBillSummary =
        function () {

            const booking =
                finalGetBooking();


            const totals =
                finalCalculateTotals();


            console.log(
                "===================================="
            );

            console.log(
                "🔥 FINAL TOTAL CALCULATION"
            );

            console.log(
                "Base Ticket:",
                totals.baseTicket
            );

            console.log(
                "Discount:",
                totals.discount
            );

            console.log(
                "Final Ticket:",
                totals.finalTicket
            );

            console.log(
                "Snacks:",
                totals.snackTotal
            );

            console.log(
                "Convenience:",
                totals.convenienceFee
            );

            console.log(
                "Grand Total:",
                totals.grandTotal
            );

            console.log(
                "===================================="
            );


            /* =================================================
               BILL TICKET TOTAL
            ================================================= */

            const billTicket =
                document.getElementById(
                    "billTicketTotal"
                );


            if (billTicket) {

                if (
                    totals.discount > 0
                ) {

                    billTicket.innerHTML = `

                        <del class="old-price">
                            ₹${totals.baseTicket.toFixed(2)}
                        </del>

                        <br>

                        <span class="final-price">
                            ₹${totals.finalTicket.toFixed(2)}
                        </span>

                    `;

                }

                else {

                    billTicket.innerHTML = `

                        <span class="final-price">
                            ₹${totals.baseTicket.toFixed(2)}
                        </span>

                    `;

                }

            }


            /* =================================================
               DISCOUNT
            ================================================= */

            const discountElement =
                document.getElementById(
                    "discountTotal"
                );


            if (discountElement) {

                discountElement.textContent =
                    `-₹${totals.discount.toFixed(2)}`;

            }


            /* =================================================
               SNACK
            ================================================= */

            const snackElement =
                document.getElementById(
                    "snackTotal"
                );


            if (snackElement) {

                snackElement.textContent =
                    `₹${totals.snackTotal.toFixed(2)}`;

            }


            /* =================================================
               CONVENIENCE FEE
            ================================================= */

            const feeElement =
                document.getElementById(
                    "convenienceFee"
                );


            if (feeElement) {

                feeElement.textContent =
                    `₹${totals.convenienceFee.toFixed(2)}`;

            }


            /* =================================================
               GRAND TOTAL
            ================================================= */

            const grandElement =
                document.getElementById(
                    "grandTotal"
                );


            if (grandElement) {

                grandElement.textContent =
                    `₹${totals.grandTotal.toFixed(2)}`;

            }


            /* =================================================
               TOP PAYABLE
            ================================================= */

            const payable =
                document.getElementById(
                    "payableAmount"
                );


            if (payable) {

                payable.textContent =
                    `₹${totals.grandTotal.toFixed(2)}`;

            }


            /* =================================================
               SNACK COUNT
            ================================================= */
            const snackCount = document.getElementById("snackCount");

            let count = 0;

            for (let id in snackCart) {
                count += snackCart[id];
            }

            snackCount.textContent = `${count} Items`;

            /* =================================================
               REWARD POINTS
            ================================================= */

            const rewardPoints =
                document.getElementById(
                    "rewardPoints"
                );


            const rewardBar =
                document.getElementById(
                    "rewardBar"
                );


            const rewardText =
                document.getElementById(
                    "rewardText"
                );


            const reward =
                Math.floor(
                    totals.grandTotal / 10
                );


            const progress =
                Math.min(
                    (reward / 500) * 100,
                    100
                );


            if (rewardPoints) {

                rewardPoints.textContent =
                    `${reward} pts`;

            }


            if (rewardBar) {

                rewardBar.style.width =
                    `${progress}%`;

            }


            if (rewardText) {

                rewardText.textContent =
                    `${Math.round(progress)}% to Next Reward`;

            }


            /* =================================================
               SAVE PAYMENT
            ================================================= */

            booking.payment =
                booking.payment || {};


            booking.payment.ticketTotal =
                totals.finalTicket;


            booking.payment.snackTotal =
                totals.snackTotal;


            booking.payment.convenienceFee =
                totals.convenienceFee;


            booking.payment.grandTotal =
                totals.grandTotal;


            booking.discount =
                totals.discount;


            booking.finalTicketPrice =
                totals.finalTicket;


            /* =================================================
               SAVE SNACKS
            ================================================= */

            booking.snacks = [];


            if (
                typeof snacks !== "undefined" &&
                Array.isArray(snacks) &&
                typeof snackCart !== "undefined"
            ) {

                Object.keys(
                    snackCart
                ).forEach(
                    function (id) {

                        const quantity =
                            Number(
                                snackCart[id] || 0
                            );


                        if (quantity <= 0) {

                            return;

                        }


                        const snack =
                            snacks.find(
                                function (item) {

                                    return String(
                                        item.id
                                    ) === String(id);

                                }
                            );


                        if (!snack) {

                            return;

                        }


                        booking.snacks.push({

                            id:
                                snack.id,

                            name:
                                snack.name,

                            price:
                                Number(
                                    snack.price
                                ),

                            quantity:
                                quantity,

                            total:
                                Number(
                                    snack.price
                                ) * quantity

                        });

                    }
                );

            }


            /* =================================================
               SAVE LOCAL STORAGE
            ================================================= */

            localStorage.setItem(
                "booking",
                JSON.stringify(
                    booking
                )
            );


            return totals;

        };


    /* ======================================================
       UPDATE BOOKING SUMMARY
    ====================================================== */

    window.loadBookingSummary =
        function () {

            const booking =
                finalGetBooking();


            /* -----------------------------------------------
               MOVIE
            ----------------------------------------------- */

            const summaryMovie =
                document.getElementById(
                    "summaryMovie"
                );


            if (summaryMovie) {

                let movieTitle = "-";


                if (
                    booking.movie &&
                    booking.movie.title
                ) {

                    movieTitle =
                        booking.movie.title;

                }

                else {

                    const selectedMovie =
                        localStorage.getItem(
                            "selectedMovie"
                        );


                    if (
                        selectedMovie &&
                        typeof movies !== "undefined" &&
                        movies[selectedMovie]
                    ) {

                        movieTitle =
                            movies[
                                selectedMovie
                            ].title;

                    }

                }


                summaryMovie.textContent =
                    movieTitle;

            }


            /* -----------------------------------------------
               THEATRE
            ----------------------------------------------- */

            const summaryTheatre =
                document.getElementById(
                    "summaryTheatre"
                );


            if (summaryTheatre) {

                const selectedTheatre =
                    JSON.parse(
                        localStorage.getItem(
                            "selectedTheatre"
                        )
                    );


                summaryTheatre.textContent =
                    booking.theatre?.name ||
                    selectedTheatre?.name ||
                    "-";

            }


            /* -----------------------------------------------
               SHOW
            ----------------------------------------------- */

            const summaryShow =
                document.getElementById(
                    "summaryShow"
                );


            if (summaryShow) {

                const selectedDate =
                    JSON.parse(
                        localStorage.getItem(
                            "selectedDate"
                        )
                    );


                const selectedTheatre =
                    JSON.parse(
                        localStorage.getItem(
                            "selectedTheatre"
                        )
                    );


                let dateText = "-";


                if (
                    booking.date
                ) {

                    if (
                        typeof booking.date ===
                        "object"
                    ) {

                        dateText =
                            `${booking.date.day}, ` +
                            `${booking.date.date} ` +
                            `${booking.date.month} ` +
                            `${booking.date.year}`;

                    }

                    else {

                        dateText =
                            booking.date;

                    }

                }

                else if (
                    selectedDate
                ) {

                    dateText =
                        `${selectedDate.day}, ` +
                        `${selectedDate.date} ` +
                        `${selectedDate.month} ` +
                        `${selectedDate.year}`;

                }


                const time =
                    booking.show?.time ||
                    selectedTheatre?.time ||
                    "-";


                if (
                    dateText !== "-" &&
                    time !== "-"
                ) {

                    summaryShow.textContent =
                        `${dateText} • ${time}`;

                }

                else if (
                    dateText !== "-"
                ) {

                    summaryShow.textContent =
                        dateText;

                }

                else {

                    summaryShow.textContent =
                        time;

                }

            }


            /* -----------------------------------------------
               SEATS
            ----------------------------------------------- */

            const summarySeats =
                document.getElementById(
                    "summarySeats"
                );


            if (summarySeats) {

                const seats =
                    Array.isArray(
                        booking.seats
                    )
                        ? booking.seats
                        : [];


                summarySeats.textContent =
                    seats
                        .map(
                            function (seat) {

                                return (
                                    typeof seat ===
                                    "object"
                                )
                                    ? seat.name
                                    : seat;

                            }
                        )
                        .filter(Boolean)
                        .join(", ") ||
                    "-";

            }


            /* -----------------------------------------------
               CALCULATE TOTAL FIRST
            ----------------------------------------------- */

            const totals =
                window.updateBillSummary();


            /* -----------------------------------------------
               TOP PAYABLE
            ----------------------------------------------- */

            const payable =
                document.getElementById(
                    "payableAmount"
                );


            if (payable) {

                payable.textContent =
                    `₹${totals.grandTotal.toFixed(2)}`;

            }


            console.log(
                "🔥 BOOKING SUMMARY TOTAL:",
                totals.grandTotal
            );

        };


    /* ======================================================
       FORCE FINAL UPDATE AFTER PAGE LOAD
    ====================================================== */

    document.addEventListener(
        "DOMContentLoaded",
        function () {

            console.log(
                "🔥 FINAL CHECKOUT DOM READY"
            );


            setTimeout(
                function () {

                    if (
                        typeof restoreSnackCart ===
                        "function"
                    ) {

                        restoreSnackCart();

                    }


                    if (
                        typeof renderSnacks ===
                        "function"
                    ) {

                        renderSnacks();

                    }


                    window.updateBillSummary();

                    window.loadBookingSummary();

                },
                100
            );

        }
    );


})();


