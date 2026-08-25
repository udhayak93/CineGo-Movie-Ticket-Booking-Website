
/* ==========================================================
                    OFFERS SECTION
========================================================== */

document.addEventListener("DOMContentLoaded", () => {


    /* ==========================================================
                        DOM ELEMENTS
    ========================================================== */

    const offersGrid =
        document.getElementById("offersGrid");

    const viewMoreBtn =
        document.getElementById("offersViewBtn");

    const filterButtons =
        document.querySelectorAll(".filter-btn");


    /* ==========================================================
                        SETTINGS
    ========================================================== */

    let showAllOffers = false;

    const initialOfferCount = 6;


    /* ==========================================================
                        CHECK ELEMENTS
    ========================================================== */

    if (!offersGrid) {

        console.error(
            "❌ offersGrid not found!"
        );

        return;
    }


    if (!viewMoreBtn) {

        console.error(
            "❌ offersViewBtn not found!"
        );

        return;
    }


    /* ==========================================================
                    RENDER OFFERS
    ========================================================== */

    function renderOffers(category = "all") {


        /* ------------------------------------------------------
                        FILTER OFFERS
        ------------------------------------------------------ */

        const filteredOffers =
            category === "all"
                ? offers
                : offers.filter(
                    (offer) =>
                        offer.category === category
                );


        /* ------------------------------------------------------
                        SHOW OFFERS
        ------------------------------------------------------ */

        const visibleOffers =
            showAllOffers
                ? filteredOffers
                : filteredOffers.slice(
                    0,
                    initialOfferCount
                );


        /* ------------------------------------------------------
                        EMPTY STATE
        ------------------------------------------------------ */

        if (filteredOffers.length === 0) {

            offersGrid.innerHTML = `

                <div class="offers-empty">

                    <div class="empty-icon">
                        <i class="fa-solid fa-ticket"></i>
                    </div>

                    <h3>
                        No Offers Available
                    </h3>

                    <p>
                        There are currently no offers
                        available in this category.
                    </p>

                </div>

            `;

        }


        /* ------------------------------------------------------
                        RENDER OFFER CARDS
        ------------------------------------------------------ */

        else {

            offersGrid.innerHTML =
                visibleOffers
                    .map((offer) => {

                        return `

                            <div
                                class="offer-card"
                            >

                                <!-- ======================
                                    OFFER TOP
                                ======================= -->

                                <div
                                    class="offer-top"
                                >

                                    <div
                                        class="offer-icon"
                                    >

                                        <i
                                            class="fa-solid ${offer.icon}"
                                        ></i>

                                    </div>


                                    <span
                                        class="offer-discount"
                                    >
                                        ${offer.discount}
                                    </span>

                                </div>


                                <!-- ======================
                                    OFFER TITLE
                                ======================= -->

                                <h3>
                                    ${offer.title}
                                </h3>


                                <!-- ======================
                                    DESCRIPTION
                                ======================= -->

                                <p>
                                    ${offer.description}
                                </p>


                                <!-- ======================
                                    OFFER CODE
                                ======================= -->

                                <div
                                    class="offer-code"
                                >

                                    <span>
                                        ${offer.code}
                                    </span>


                                    <button
                                        type="button"
                                        class="copy-btn"
                                        data-code="${offer.code}"
                                    >

                                        <i
                                            class="fa-regular fa-copy"
                                        ></i>

                                        Copy

                                    </button>

                                </div>


                                <!-- ======================
                                    OFFER BOTTOM
                                ======================= -->

                                <div
                                    class="offer-bottom"
                                >

                                    <span
                                        class="offer-validity"
                                    >

                                        <i
                                            class="fa-regular fa-clock"
                                        ></i>

                                        ${offer.validity}

                                    </span>


                                    <a
                                        href="index.html"
                                        class="book-offer"
                                    >

                                        Book Now

                                        <i
                                            class="fa-solid fa-arrow-right"
                                        ></i>

                                    </a>

                                </div>

                            </div>

                        `;

                    })
                    .join("");

        }


        /* ======================================================
                    VIEW MORE / VIEW LESS
        ====================================================== */


        /*
            If total offers are 6 or less,
            hide button.
        */

        if (
            filteredOffers.length <=
            initialOfferCount
        ) {

            viewMoreBtn.style.display =
                "none";

        }


        /*
            If total offers are more than 6,
            show button.
        */

        else {

            viewMoreBtn.style.display =
                "inline-flex";


            /* --------------------------------------------------
                        VIEW LESS
            -------------------------------------------------- */

            if (showAllOffers) {

                viewMoreBtn.innerHTML = `

                    <span>
                        View Less
                    </span>

                    <i
                        class="fa-solid fa-chevron-up"
                    ></i>

                `;

            }


            /* --------------------------------------------------
                        VIEW MORE
            -------------------------------------------------- */

            else {

                viewMoreBtn.innerHTML = `

                    <span>
                        View More
                    </span>

                    <i
                        class="fa-solid fa-chevron-down"
                    ></i>

                `;

            }

        }

    }


    /* ==========================================================
                VIEW MORE / VIEW LESS BUTTON
    ========================================================== */

    viewMoreBtn.addEventListener(
        "click",
        (event) => {

            event.preventDefault();


            /*
                Toggle View More / View Less
            */

            showAllOffers =
                !showAllOffers;


            /*
                Find active filter
            */

            const activeButton =
                document.querySelector(
                    ".filter-btn.active"
                );


            const category =
                activeButton
                    ? activeButton.dataset.filter
                    : "all";


            /*
                Render again
            */

            renderOffers(category);


            /*
                When View Less is clicked,
                scroll to offers section.
            */

            if (!showAllOffers) {

                const offersSection =
                    document.getElementById(
                        "offersSection"
                    );


                if (offersSection) {

                    offersSection.scrollIntoView({
                        behavior: "smooth",
                        block: "start"
                    });

                }

            }

        }
    );


    /* ==========================================================
                        FILTER BUTTONS
    ========================================================== */

    filterButtons.forEach(
        (button) => {

            button.addEventListener(
                "click",
                () => {


                    /* ------------------------------------------
                        REMOVE ACTIVE CLASS
                    ------------------------------------------ */

                    filterButtons.forEach(
                        (btn) => {

                            btn.classList.remove(
                                "active"
                            );

                        }
                    );


                    /* ------------------------------------------
                        ADD ACTIVE CLASS
                    ------------------------------------------ */

                    button.classList.add(
                        "active"
                    );


                    /* ------------------------------------------
                        RESET VIEW MORE
                    ------------------------------------------ */

                    showAllOffers =
                        false;


                    /* ------------------------------------------
                        GET CATEGORY
                    ------------------------------------------ */

                    const category =
                        button.dataset.filter;


                    /* ------------------------------------------
                        RENDER CATEGORY
                    ------------------------------------------ */

                    renderOffers(
                        category
                    );

                }
            );

        }
    );


    /* ==========================================================
                            COPY COUPON
    ========================================================== */

    offersGrid.addEventListener("click", (event) => {

        const copyButton =
            event.target.closest(".copy-btn");

        if (!copyButton) {
            return;
        }


        /* Already copied → do nothing */

        if (copyButton.classList.contains("copied")) {
            return;
        }


        /* Get coupon code */

        const code =
            copyButton.dataset.code;


        /* Copy coupon */

        navigator.clipboard.writeText(code);
        copyButton.classList.add("copied");

        copyButton.innerHTML = `
    <i class="fa-solid fa-check"></i>
    Copied
`;
        // Redirect
        setTimeout(() => {
            window.location.href = "movies.html";
        }, 4200);


        /* ======================================================
                        DISABLE OTHER BUTTONS
        ====================================================== */

        const allCopyButtons =
            offersGrid.querySelectorAll(".copy-btn");


        allCopyButtons.forEach((button) => {

            if (button !== copyButton) {

                button.disabled = true;

                button.classList.add("disabled");

            }

        });


        /* ======================================================
                        COPIED BUTTON
        ====================================================== */

        copyButton.classList.add("copied");

        copyButton.innerHTML = `
        <i class="fa-solid fa-check"></i>
        Copied
    `;


        /* ======================================================
                            TOAST
        ====================================================== */

        const toast =
            document.getElementById("copyToast");


        if (toast) {

            toast.innerHTML = `
            <i class="fa-solid fa-circle-check"></i>
            Coupon code copied!
        `;

            toast.classList.add("show");


            setTimeout(() => {

                toast.classList.remove("show");

            }, 1500);

        }

    });
    /* ==========================================================
                    SCROLL TO OFFERS
    ========================================================== */

    window.scrollToOffers =
        function () {


            const offersSection =
                document.getElementById(
                    "offersSection"
                );


            if (offersSection) {

                offersSection.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });

            }

        };


    /* ==========================================================
                    INITIAL LOAD
    ========================================================== */

    renderOffers("all");


});