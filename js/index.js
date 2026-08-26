// ==========================
// Containers
// ==========================

const nowShowingSection = document.getElementById("now-showing");
const upcomingSection = document.getElementById("upcomingSection");

const nowShowingContainer = document.getElementById("nowShowingCards");
const upcomingContainer = document.getElementById("upcomingCards");

const viewAllNowShowing = document.getElementById("nowViewMoreBtn");
const upcomingViewMoreBtn = document.getElementById("upcomingViewMoreBtn");

const emptyState = document.getElementById("emptyState");

const searchInput = document.getElementById("searchInput");

const genreBtn = document.getElementById("genreBtn");
const languageBtn = document.getElementById("languageBtn");
const formatBtn = document.getElementById("formatBtn");
const dateBtn = document.getElementById("dateBtn");

const genreItems = document.querySelectorAll(".genre-item");
const languageItems = document.querySelectorAll(".language-item");
const formatItems = document.querySelectorAll(".format-item");
const dateItems = document.querySelectorAll(".date-item");

const trendingBtn = document.getElementById("trendingBtn");
const topRatedBtn = document.getElementById("topRatedBtn");
const nowShowingBtn = document.getElementById("nowShowingBtn");
const comingSoonBtn = document.getElementById("comingSoonBtn");

// ==========================
// Variables
// ==========================

let selectedGenre = "All";
let selectedLanguage = "All";
let selectedStatus = "All";
let selectedFormat = "All";
let selectedDate = "All";

let searchText = "";
let currentSort = "default";

let nowExpanded = false;
let upcomingExpanded = false;

// ==========================
// Helpers
// ==========================

function getStorageArray(key) {
    return JSON.parse(localStorage.getItem(key)) || [];
}


/*==================================================
                    TRAILERS
==================================================*/

const trailers = {
  janaNayagan:
    "https://www.youtube.com/embed/fJaAYcERf3Y?autoplay=1&mute=0&controls=1&rel=0&playsinline=1",

  anbeDiana:
    "https://www.youtube.com/embed/gcXw7BMSfIQ?autoplay=1&mute=0&controls=1&rel=0&playsinline=1",

  odyssey:
    "https://www.youtube.com/embed/JLEDwlSZcAI?autoplay=1&mute=0&controls=1&rel=0&playsinline=1",

  furious:
    "https://www.youtube-nocookie.com/embed/Avky8dVaqAI?autoplay=1&mute=0&controls=1&rel=0&playsinline=1",

  spiderManBrandNew:
    "https://www.youtube.com/embed/uZAwsh-unZ8?autoplay=1&mute=0&controls=1&rel=0&playsinline=1"
};

/*==================================================
                    PLAY TRAILER
==================================================*/

function playTrailer(button, movieKey) {
  const item = button.closest(".carousel-item");

  if (!item) return;

  const image = item.querySelector(".bannerImage");
  const frame = item.querySelector(".trailerFrame");
  const close = item.querySelector(".close-trailer");

  if (!frame) return;
      const carousel = item.closest(".carousel");

    if (carousel) {
        const carouselBtn = bootstrap.Carousel.getInstance(carousel);

        if (carouselBtn) {
            carouselBtn.pause();
        }
    }

  if (image) image.style.display = "none";

  frame.src = trailers[movieKey];
  frame.style.display = "block";

  if (close) close.style.display = "flex";
}

/*==================================================
                    CLOSE TRAILER
==================================================*/

function closeTrailer(button) {
  const item = button.closest(".carousel-item");

  if (!item) return;

  const image = item.querySelector(".bannerImage");
  const frame = item.querySelector(".trailerFrame");

  frame.src = "";
  frame.style.display = "none";

  if (image) image.style.display = "block";

  button.style.display = "none";
}

// ==========================
// Badge
// ==========================

function getBadgeClass(type) {
  switch (type) {
    case "anticipated":
      return "movie-badge anticipated";

    case "family":
      return "movie-badge family";

    case "thriller":
      return "movie-badge thriller";

    case "action":
      return "movie-badge action";

    case "sports":
      return "movie-badge sports";

    case "romance":
      return "movie-badge romance";

    case "drama":
      return "movie-badge drama";

    case "comedy":
      return "movie-badge comedy";

    case "trending":
      return "movie-badge trending";

    case "scifi":
      return "movie-badge scifi";

    case "spy":
      return "movie-badge spy";

    case "fantasy":
      return "movie-badge fantasy";

    case "horror":
      return "movie-badge horror";

    case "interest":
      return "movie-interest";

    case "dark":
      return "movie-notify dark";

    default:
      return "movie-badge";
  }
}

// ==========================
// Render Movie Section
// ==========================

function renderSection(container, movieList, expanded = false) {

    if (!container) return;

    // ==========================
    // Responsive Limit
    // ==========================

    let limit;

    if (window.innerWidth >= 1200) {
        limit = 4;
    } else if (window.innerWidth >= 768) {
        limit = 3;
    } else {
        limit = 2;
    }

    // ==========================
    // Movies To Display
    // ==========================

    const list = expanded
        ? movieList
        : movieList.slice(0, limit);

    // ==========================
    // Build HTML
    // ==========================

    let html = "";

    const notifiedMovies =
        getStorageArray("notifiedMovies");

    list.forEach(([movieKey, movie]) => {

        const isUpcoming =
            movie.status === "Coming Soon";

        const isNotifyButton =
            movie.button?.type === "notify";

        const isNotified =
            isNotifyButton &&
            notifiedMovies.includes(movieKey);

        const contentClass =
            isUpcoming
                ? "movie-content upcoming"
                : "movie-content showing";

        // ==========================
        // Badge / Rating
        // ==========================

        let badgeHTML = "";

        if (isUpcoming && movie.badge) {

            badgeHTML = `
                <span
                    id="notifyBadge-${movieKey}"
                    class="${getBadgeClass(movie.badge.type)} ${isNotified ? "active" : ""}"
                >
                    ${
                        movie.badge.icon
                            ? `<i class="${movie.badge.icon}"></i>`
                            : ""
                    }

                    ${movie.badge.text || ""}
                </span>
            `;

        } else {

            badgeHTML = `
                <span class="movie-rating">
                    ⭐ ${movie.rating || "N/A"}
                </span>
            `;
        }

        let buttonHTML = "";

        if (isUpcoming) {

            buttonHTML =
                renderUpcomingButton(
                    movie,
                    movieKey
                );

        } else {

            buttonHTML = `
                <button
                    type="button"
                    class="${movie.button?.class || "btn btn-danger w-100"}"
                    onclick="bookNow('${movieKey}')"
                >
                    ${movie.button?.text || "Book Tickets"}
                </button>
            `;
        }

        // ==========================
        // Movie Card
        // ==========================

        html += `
            <div class="movie-card">

                <div class="movie-poster">

                    <img
                        src="${movie.poster || ""}"
                        alt="${movie.title || "Movie"}"
                        loading="lazy"
                    >

                    ${badgeHTML}

                </div>


                <div class="${contentClass}">

                    <h5>
                        ${movie.title || "Untitled"}
                    </h5>

                    <p>
                        ${
                            Array.isArray(movie.genres)
                                ? movie.genres.join(" • ")
                                : movie.genres || ""
                        }
                    </p>

                    ${buttonHTML}

                </div>

            </div>
        `;
    });

    // ==========================
    // Insert HTML
    // ==========================

    container.innerHTML = html;
}
// ==========================
// Upcoming Button
// ==========================

function renderUpcomingButton(movie, movieKey) {

    // No button configuration
    if (!movie.button) {

        return `
            <button
                type="button"
                class="btn btn-secondary w-100"
                disabled
            >
                Coming Soon
            </button>
        `;
    }


    // ==========================
    // Notify Button
    // ==========================

    if (movie.button.type === "notify") {

        const notifiedMovies =
            getStorageArray("notifiedMovies");

        const isNotified =
            notifiedMovies.includes(movieKey);


        return `
            <button
                type="button"
                id="notifyBtn-${movieKey}"
                class="${
                    isNotified
                        ? "btn btn-danger w-100"
                        : movie.button.class || "btn btn-outline-danger w-100"
                }"
                onclick="toggleNotify('${movieKey}', this)"
            >
                ${
                    isNotified
                        ? "Notified"
                        : movie.button.text || "Notify Me"
                }
            </button>
        `;
    }


    // ==========================
    // Normal Upcoming Button
    // ==========================

    return `
        <button
            type="button"
            class="${movie.button.class || "btn btn-secondary w-100"}"
            ${movie.button.disabled ? "disabled" : ""}
        >

            ${
                movie.button.icon
                    ? `<i class="${movie.button.icon}"></i>`
                    : ""
            }

            ${movie.button.text || "Coming Soon"}

        </button>
    `;
}



// ==========================
// Notify
// ==========================

function toggleNotify(movieKey, button) {
  let notifiedMovies = getStorageArray("notifiedMovies");

  if (notifiedMovies.includes(movieKey)) {
    notifiedMovies = notifiedMovies.filter((id) => id !== movieKey);

    button.classList.remove("btn-danger");
    button.classList.add("btn-outline-danger");
    button.innerHTML = "Notify Me";
  } else {
    notifiedMovies.push(movieKey);

    button.classList.remove("btn-outline-danger");
    button.classList.add("btn-danger");
    button.innerHTML = "Notified";
  }

  localStorage.setItem("notifiedMovies", JSON.stringify(notifiedMovies));

  const badge = document.getElementById(`notifyBadge-${movieKey}`);
  if (badge) {
    badge.classList.toggle("active");
  }
}

// ==========================
// Apply Filters
// ==========================

function applyFilters() {

    let filtered = Object.entries(movies).filter(
        ([movieKey, movie]) => {

            // ==========================
            // Genre
            // ==========================

            const genreMatch =
                selectedGenre === "All" ||
                movie.genres?.includes(selectedGenre);


            // ==========================
            // Language
            // ==========================

            const languageMatch =
                selectedLanguage === "All" ||
                (
                    Array.isArray(movie.language)
                        ? movie.language.includes(selectedLanguage)
                        : movie.language === selectedLanguage
                );


            // ==========================
            // Status
            // ==========================

            const statusMatch =
                selectedStatus === "All" ||
                movie.status === selectedStatus;


            // ==========================
            // Search
            // ==========================

            const searchMatch =
                searchText === "" ||
                (movie.title || "")
                    .toLowerCase()
                    .includes(searchText);


            return (
                genreMatch &&
                languageMatch &&
                statusMatch &&
                searchMatch
            );
        }
    );


    // ==========================
    // Format Filter
    // ==========================

    if (selectedFormat !== "All") {

        filtered = filtered.filter(
            ([, movie]) =>
                movie.formats?.includes(selectedFormat)
        );
    }


    // ==========================
    // Date Filter
    // ==========================

    if (selectedDate !== "All") {

        const allowedDates =
            dateGroups[selectedDate] || [];

        filtered = filtered.filter(
            ([, movie]) =>
                allowedDates.includes(
                    movie.releaseCategory
                )
        );
    }


    // ==========================
    // Sorting
    // ==========================

    if (currentSort === "trending") {

        filtered.sort(
            (a, b) =>
                (b[1].bookings || 0) -
                (a[1].bookings || 0)
        );

    } else if (currentSort === "top") {

        filtered.sort(
            (a, b) =>
                parseFloat(b[1].rating || 0) -
                parseFloat(a[1].rating || 0)
        );
    }


    // ==========================
    // Separate Sections
    // ==========================

    const nowShowing =
        filtered.filter(
            ([, movie]) =>
                movie.status === "Now Showing"
        );


    const upcoming =
        filtered.filter(
            ([, movie]) =>
                movie.status === "Coming Soon"
        );


    // ==========================
    // Render
    // ==========================

    renderSection(
        nowShowingContainer,
        nowShowing,
        nowExpanded
    );


    renderSection(
        upcomingContainer,
        upcoming,
        upcomingExpanded
    );


    // ==========================
    // Section Visibility
    // ==========================

    if (nowShowingSection) {

        nowShowingSection.style.display =
            nowShowing.length > 0
                ? "block"
                : "none";
    }


    if (upcomingSection) {

        upcomingSection.style.display =
            upcoming.length > 0
                ? "block"
                : "none";
    }


    // ==========================
    // Empty State
    // ==========================

    if (emptyState) {

        emptyState.classList.toggle(
            "d-none",
            nowShowing.length > 0 ||
            upcoming.length > 0
        );
    }
}



// ==========================
// Update Filter Button
// ==========================

function updateFilterButton(button, icon, value, defaultText) {

    if (!button) return;

    button.innerHTML = `
        <i class="${icon}"></i>
        ${value === "All" ? defaultText : value}
    `;
}

// ==========================
// Search
// ==========================

if (searchInput) {
  searchInput.addEventListener("input", function () {
    searchText = this.value.trim().toLowerCase();

    applyFilters();
  });
}

// ==========================
// Genre
// ==========================

genreItems.forEach((item) => {
  item.onclick = function (e) {
    e.preventDefault();

    selectedGenre = this.textContent.trim();

    if (selectedGenre === "Genres") {
      selectedGenre = "All";
    }

updateFilterButton(genreBtn , "fa-solid fa-film", selectedGenre, "Genres");
    applyFilters();
  };
});

// ==========================
// Language
// ==========================

languageItems.forEach((item) => {
  item.onclick = function (e) {
    e.preventDefault();

    selectedLanguage = this.textContent.trim();

    if (selectedLanguage === "Languages") {
      selectedLanguage = "All";
    }

updateFilterButton( languageBtn, "fa-solid fa-language", selectedLanguage, "Languages" );

    applyFilters();
  };
});


// ===============================
// Format Filter
// ===============================

formatItems.forEach((item) => {
    item.addEventListener("click", (e) => {
        e.preventDefault();

        // Remove active class
        formatItems.forEach((i) => i.classList.remove("active"));

        // Add active class
        item.classList.add("active");

        // Get selected format
        selectedFormat = item.dataset.format;

        // Update button text
      updateFilterButton(formatBtn, "fa-solid fa-video",selectedFormat, "Format");

        // Apply all filters
        applyFilters();
    });
});
// ==========================
// Date
// ==========================

const dateGroups = {

    "Today": [
        "Today"
    ],

    "Tomorrow": [
        "Today",
        "Tomorrow"
    ],

    "Weekend": [
        "Today",
        "Tomorrow",
        "Weekend"
    ],

    "Next Week": [
        "Today",
        "Tomorrow",
        "Weekend",
        "Next Week"
    ],

    "This Month": [
        "Weekend",
        "Next Week",
        "This Month"
    ],

    "Next Month": [
        "Next Week",
        "This Month",
        "Next Month"
    ]

};

dateItems.forEach((item) => {

    item.addEventListener("click", (e) => {

        e.preventDefault();

        selectedDate = item.dataset.date || item.textContent.trim();


      updateFilterButton( dateBtn, "fa-solid fa-calendar-days", selectedDate, "Date");

        applyFilters();

    });

});

// ==========================
// Quick Filter Active State
// ==========================

function updateQuickFilterActive(type) {

    // Remove active from all quick filter buttons
    [
        trendingBtn,
        topRatedBtn,
        nowShowingBtn,
        comingSoonBtn
    ].forEach((btn) => {

        if (btn) {
            btn.classList.remove("active");
        }

    });

    // Add active only to selected button
    let activeButton = null;

    switch (type) {

        case "trending":
            activeButton = trendingBtn;
            break;

        case "top":
            activeButton = topRatedBtn;
            break;

        case "now":
            activeButton = nowShowingBtn;
            break;

        case "coming":
            activeButton = comingSoonBtn;
            break;
    }

    if (activeButton) {
        activeButton.classList.add("active");
    }
}


// ==========================
// Quick Filter
// ==========================

function setQuickFilter(type) {

    // ==========================
    // TRENDING
    // ==========================

    if (type === "trending") {

        // Already active → Default
        if (currentSort === "trending") {

            currentSort = "default";
            selectedStatus = "All";

            updateQuickFilterActive(null);

        }

        // First click → Trending
        else {

            currentSort = "trending";
            selectedStatus = "All";

            updateQuickFilterActive("trending");
        }
    }


    // ==========================
    // TOP RATED
    // ==========================

    else if (type === "top") {

        // Already active → Default
        if (currentSort === "top") {

            currentSort = "default";
            selectedStatus = "All";

            updateQuickFilterActive(null);

        }

        // First click → Top Rated
        else {

            currentSort = "top";
            selectedStatus = "All";

            updateQuickFilterActive("top");
        }
    }


    // ==========================
    // NOW SHOWING
    // ==========================

    else if (type === "now") {

        // Already active → Default
        if (selectedStatus === "Now Showing") {

            selectedStatus = "All";
            currentSort = "default";

            updateQuickFilterActive(null);

        }

        // First click → Now Showing
        else {

            selectedStatus = "Now Showing";
            currentSort = "default";

            updateQuickFilterActive("now");
        }
    }


    // ==========================
    // COMING SOON
    // ==========================

    else if (type === "coming") {

        // Already active → Default
        if (selectedStatus === "Coming Soon") {

            selectedStatus = "All";
            currentSort = "default";

            updateQuickFilterActive(null);

        }

        // First click → Coming Soon
        else {

            selectedStatus = "Coming Soon";
            currentSort = "default";

            updateQuickFilterActive("coming");
        }
    }


    // ==========================
    // APPLY FILTER
    // ==========================

    applyFilters();
}

// ==========================
// Status
// ==========================

if (nowShowingBtn) {
    nowShowingBtn.onclick = () => setQuickFilter("now");
}

if (comingSoonBtn) {
    comingSoonBtn.onclick = () => setQuickFilter("coming");
}

// ==========================
// Sorting
// ==========================

if (trendingBtn) {
    trendingBtn.onclick = () => setQuickFilter("trending");
}

if (topRatedBtn) {
    topRatedBtn.onclick = () => setQuickFilter("top");
}


// ==========================
// View All
// ==========================

if (viewAllNowShowing) {
  viewAllNowShowing.onclick = function (e) {
    e.preventDefault();

    nowExpanded = !nowExpanded;

    this.textContent = nowExpanded ? "View Less" : "View All";

    applyFilters();
  };
}

if (upcomingViewMoreBtn) {
  upcomingViewMoreBtn.onclick = function (e) {
    e.preventDefault();

    upcomingExpanded = !upcomingExpanded;

    this.textContent = upcomingExpanded ? "View Less" : "View All";

    applyFilters();
  };
}

// ==========================
// Reset Filters
// ==========================

function resetMovieFilters() {
  selectedGenre = "All";
  selectedLanguage = "All";
  selectedStatus = "All";
  selectedFormat = "All";
  selectedDate = "All";
  currentSort = "default";
  searchText = "";

  if (searchInput) {
    searchInput.value = "";
  }

  if (genreBtn) {
    updateFilterButton( genreBtn, "fa-solid fa-film", "All", "Genres");
  }

  if (languageBtn) {
    updateFilterButton( languageBtn, "fa-solid fa-language", "All", "Languages");
  }

  if (formatBtn) {
    updateFilterButton( formatBtn, "fa-solid fa-video", "All", "Format");

  }

  if (dateBtn) {
    updateFilterButton( dateBtn, "fa-solid fa-calendar-days", "All", "Date");
  }

  applyFilters();
}

// ==========================
// Init
// ==========================



window.addEventListener("resize", () => {
  applyFilters();
});

// ==========================
// Book Tickets
// ==========================

window.bookNow = function (movieKey) {
  const movie = movies[movieKey];

  if (!movie) return;

  localStorage.setItem("selectedMovie", movieKey);

  if (Array.isArray(movie.language) && movie.language.length > 1) {
    openPopup(movieKey);
  } else {
    const lang = Array.isArray(movie.language)
      ? movie.language[0]
      : movie.language;

    localStorage.setItem("selectedLanguage", lang);

    window.location.href = "bookings.html";
  }
};

// ==========================
// Language Popup
// ==========================

const languageList = document.getElementById("languageList");

let selectedMovieKey = "";

// ==========================
// Open Popup
// ==========================

window.openPopup = function (movieKey) {
  selectedMovieKey = movieKey;

  const movie = movies[movieKey];

  if (!movie || !languageList) return;

  languageList.innerHTML = "";

  movie.language.forEach((lang, index) => {
    languageList.innerHTML += `

<label class="language-card">

<input
type="radio"
name="movieLanguage"
value="${lang}"
${index === 0 ? "checked" : ""}>

<span>${lang}</span>

</label>

`;
  });

  document.getElementById("languagePopup").classList.add("active");
};

// ==========================
// Continue Booking
// ==========================

window.continueBooking = function () {
  const selected = document.querySelector(
    'input[name="movieLanguage"]:checked',
  );

  if (!selected) {
    alert("Select Language");
    return;
  }

  localStorage.setItem("selectedMovie", selectedMovieKey);

  localStorage.setItem("selectedLanguage", selected.value);

  closePopup();

  window.location.href = "bookings.html";
};

// ==========================
// Close Popup
// ==========================

window.closePopup = function () {
  const popup = document.getElementById("languagePopup");

  if (popup) {
    popup.classList.remove("active");
  }
};

// ==========================
// Close Popup on Outside Click
// ==========================

document.addEventListener("click", function (e) {
  const popup = document.getElementById("languagePopup");

  if (popup && popup.classList.contains("active") && e.target === popup) {
    closePopup();
  }
});




/*=========================================*
* RENDER OFFERS
*=========================================*/

const offerCards =
    document.getElementById("offerCards");

const offerViewMoreBtn =
    document.getElementById("offerViewMoreBtn");


/*=========================================*
* OFFER SETTINGS
*=========================================*/

const OFFER_LIMIT = 5;

let showAllOffers = false;


const offerColors = [
    "color-01",
    "color-02",
    "color-03",
    "color-04",
    "color-05",
    "color-06",
    "color-07",
    "color-08",
    "color-09",
    "color-10",
    "color-11",
    "color-12",
    "color-13",
    "color-14",
    "color-15"
];


/*=========================================*
* VIEW ALL / VIEW LESS
*=========================================*/

if (offerViewMoreBtn) {

    offerViewMoreBtn.addEventListener(
        "click",
        function (e) {

            e.preventDefault();

            showAllOffers = !showAllOffers;

            renderOffers();

        }
    );

}


/*=========================================*
* GET CURRENT USER CLAIMED OFFER
*=========================================*/

function getClaimedOffer(email) {

    if (!email) {
        return null;
    }

    for (const offer of offers) {

        const storageKey =
            `claimedOffer_${email}_${offer.code}`;

        if (localStorage.getItem(storageKey)) {

            return offer.code;

        }
    }

    return null;
}


/*=========================================*
* RENDER OFFERS
*=========================================*/

function renderOffers() {

    if (!offerCards) {
        return;
    }


    let html = "";


    /*=========================
    CURRENT USER
    =========================*/

    const email =
        localStorage.getItem("userEmail");


    const claimedOffer =
        getClaimedOffer(email);


    /*=========================
    VIEW MORE / LESS
    =========================*/

    const visibleOffers =
        showAllOffers
            ? offers
            : offers.slice(0, OFFER_LIMIT);


    /*=========================
    RENDER CARDS
    =========================*/

    visibleOffers.forEach((offer, index) => {

        const color =
            offerColors[index % offerColors.length];


        /*=========================
        DISCOUNT TEXT
        =========================*/

        const discountText =
            offer.type === "percentage"
                ? `${offer.discount}% OFF`
                : `₹${offer.discount} OFF`;


        /*=========================
        CLAIM STATUS
        =========================*/

        const isClaimed =
            claimedOffer === offer.code;


        const isDisabled =
            claimedOffer !== null &&
            !isClaimed;


        /*=========================
        BUTTON TEXT
        =========================*/

        let buttonText =
            "Claim Offer";


        if (isClaimed) {

            buttonText =
                "✔ Claimed";

        }
        else if (isDisabled) {

            buttonText =
                "Offer Unavailable";

        }


        /*=========================
        CARD HTML
        =========================*/

        html += `

            <div class="offer-card ${color}">

                <div class="offer-content">

                    <span class="offer-tag">
                        ${offer.title}
                    </span>


                    <p>
                        ${discountText}
                    </p>


                    <p>
                        ${offer.description}
                    </p>


                    <button
                        type="button"
                        class="claim-btn ${isClaimed ? "claimed" : ""}"
                        data-code="${offer.code}"
                        ${isClaimed || isDisabled ? "disabled" : ""}
                    >

                        ${buttonText}

                    </button>

                </div>


                <i class="${offer.icon}"></i>

            </div>

        `;

    });


    /*=========================
    INSERT CARDS
    =========================*/

    offerCards.innerHTML = html;


    /*=========================
    VIEW BUTTON
    =========================*/

    updateOfferViewButton();


    /*=========================
    CLAIM BUTTON EVENTS
    =========================*/

    initClaimButtons();

}


/*=========================================*
* VIEW BUTTON
*=========================================*/

function updateOfferViewButton() {

    if (!offerViewMoreBtn) {
        return;
    }


    /*=========================
    LESS THAN / EQUAL TO LIMIT
    =========================*/

    if (offers.length <= OFFER_LIMIT) {

        offerViewMoreBtn.style.display =
            "none";

        return;
    }


    /*=========================
    VIEW LESS
    =========================*/

    if (showAllOffers) {

        offerViewMoreBtn.style.display =
            "inline-block";

        offerViewMoreBtn.innerHTML = `
            View Less
            <i class="fa-solid fa-chevron-up"></i>
        `;

    }


    /*=========================
    VIEW ALL
    =========================*/

    else {

        offerViewMoreBtn.style.display =
            "inline-block";

        offerViewMoreBtn.innerHTML = `
            View All
            <i class="fa-solid fa-chevron-down"></i>
        `;

    }

}


/*=========================================*
* CLAIM OFFER BUTTONS
*=========================================*/

function initClaimButtons() {

    const buttons =
        document.querySelectorAll(".claim-btn");


    buttons.forEach((button) => {

        button.onclick = function () {


            /*=========================
            1. LOGIN CHECK
            =========================*/

            const isLoggedIn =
                localStorage.getItem("isLoggedIn");


            if (isLoggedIn !== "true") {

                alert(
                    "Please login to claim this offer."
                );

                return;
            }


            /*=========================
            2. GET USER EMAIL
            =========================*/

            const email =
                localStorage.getItem("userEmail");


            if (!email) {

                alert("Login required.");

                return;
            }


            /*=========================
            3. GET COUPON
            =========================*/

            const coupon =
                button.dataset.code;


            if (!coupon) {

                alert("Invalid offer.");

                return;
            }


            /*=========================
            4. CHECK EXISTING CLAIM
            =========================*/

            const claimedOffer =
                getClaimedOffer(email);


            if (claimedOffer) {

                alert(
                    "You can claim only one offer."
                );

                return;
            }


            /*=========================
            5. SAVE CLAIM
            =========================*/

            const storageKey =
                `claimedOffer_${email}_${coupon}`;


            localStorage.setItem(
                storageKey,
                coupon
            );


            /*=========================
            6. COPY COUPON
            =========================*/

            if (
                navigator.clipboard &&
                window.isSecureContext
            ) {

                navigator.clipboard
                    .writeText(coupon)
                    .catch(() => {

                        console.log(
                            "Coupon copy failed."
                        );

                    });

            }


            /*=========================
            7. SUCCESS
            =========================*/

            alert(
                `Coupon copied: ${coupon}`
            );


            /*=========================
            8. REFRESH OFFER CARDS
            =========================*/

            renderOffers();

        };

    });

}


/*=========================================*
* REFRESH AFTER LOGOUT
*=========================================*/

function refreshOffersAfterLogout() {

    renderOffers();

}


window.refreshOffersAfterLogout =
    refreshOffersAfterLogout;


/*=========================================*
* PAGE LOAD
*=========================================*/

document.addEventListener(
    "DOMContentLoaded",
    () => {

        applyFilters();

        renderOffers();

    }
);
