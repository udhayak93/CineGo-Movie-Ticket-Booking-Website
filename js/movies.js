// ==========================
// Trailer
// ==========================

function openTrailer(movieKey) {
    const movie = movies[movieKey];

    if (!movie || !movie.trailer) {
        alert("Trailer not available.");
        return;
    }

    window.open(movie.trailer, "_blank");
}

// ==========================
// Book Now
// ==========================

function bookNow(movieKey) {
    localStorage.setItem("selectedMovie", movieKey);
    window.location.href = "bookings.html";
}


const nowShowingSection = document.getElementById("nowShowingSection");
const upcomingSection = document.getElementById("upcomingSection");
const nowShowingContainer = document.getElementById("nowShowingContainer");
const upcomingContainer = document.getElementById("upcomingContainer");
const viewAllNowShowing = document.getElementById("viewAllNowShowing");
const upcomingViewMoreBtn = document.getElementById("upcomingViewMoreBtn");
const emptyState = document.getElementById("emptyState");
const searchInput = document.getElementById("searchInput");

let nowShowingExpanded = false;
let upcomingExpanded = false;

// ==========================
// Filters
// ==========================

let selectedGenre = "All";
let selectedLanguage = "All";
let selectedStatus = "All";

const genreButtons = document.querySelectorAll(".genre-btn");
const statusButtons = document.querySelectorAll(".status-btn");

const languageFilters = document.querySelectorAll(
    "#languageFilterDesktop, #languageFilterMobile"
);

const clearButtons = document.querySelectorAll(
    "#clearFiltersDesktop, #clearFiltersMobile"
);

// ---------- Genre ----------

genreButtons.forEach(btn => {

    btn.onclick = function () {

        selectedGenre = this.dataset.genre;

        document
            .querySelectorAll(".genre-btn")
            .forEach(button => {

                button.classList.toggle(
                    "active",
                    button.dataset.genre === selectedGenre
                );

            });

        applyFilters();

    };

});

// ---------- Status ----------

statusButtons.forEach(btn => {

    btn.onclick = function () {

        selectedStatus = this.dataset.status;

        document
            .querySelectorAll(".status-btn")
            .forEach(button => {

                button.classList.toggle(
                    "active",
                    button.dataset.status === selectedStatus
                );

            });

        applyFilters();

    };

});
// ---------- Language ----------

languageFilters.forEach(filter => {

    filter.onchange = function () {

        selectedLanguage = this.value;

        languageFilters.forEach(f => {

            f.value = selectedLanguage;

        });

        applyFilters();

    };

});

// ---------- Clear ----------

clearButtons.forEach(btn => {

    btn.onclick = function () {

        selectedGenre = "All";
        selectedStatus = "All";
        selectedLanguage = "All";

        languageFilters.forEach(f => {

            f.value = "All";

        });

        document
            .querySelectorAll(".genre-btn")
            .forEach(btn => {

                btn.classList.toggle(
                    "active",
                    btn.dataset.genre === "All"
                );

            });

        document
            .querySelectorAll(".status-btn")
            .forEach(btn => {

                btn.classList.toggle(
                    "active",
                    btn.dataset.status === "All"
                );

            });

        applyFilters();

    };

});
// ==========================
// Apply Filters
// ==========================

function applyFilters() {
    const searchText = searchInput.value.trim().toLowerCase();
    const filteredMovies = Object.entries(movies).filter(([key, movie]) => {

        const genreMatch =
            selectedGenre === "All" ||
            movie.genres.some(g => g.trim() === selectedGenre);


        const languageMatch =
            selectedLanguage === "All" ||
            (
                Array.isArray(movie.language)
                    ? movie.language.includes(selectedLanguage)
                    : movie.language === selectedLanguage
            );

        const statusMatch =
            selectedStatus === "All" ||
            movie.status === selectedStatus;

        const titleMatch =
            movie.title.toLowerCase().includes(searchText);

        const genreSearch =
            movie.genres.some(g =>
                g.toLowerCase().includes(searchText)
            );

        const languageSearch =
            (
                Array.isArray(movie.language)
                    ? movie.language
                    : [movie.language]
            ).some(lang =>
                lang.toLowerCase().includes(searchText)
            );

        const theatreSearch =
            Object.keys(movie.theatreTimings || {}).some(language =>
                Object.keys(movie.theatreTimings[language]).some(theatre =>
                    theatre.toLowerCase().includes(searchText)
                )
            );

        const searchMatch =
            searchText === "" ||
            titleMatch ||
            genreSearch ||
            languageSearch ||
            theatreSearch;

        return genreMatch && languageMatch && statusMatch && searchMatch;

    });

    const nowShowingMovies = filteredMovies.filter(([k, m]) =>
        m.status === "Now Showing"
    );

    const upcomingMovies = filteredMovies.filter(([k, m]) =>
        m.status === "Coming Soon"
    );
    if (nowShowingSection) {
        nowShowingSection.style.display =
            nowShowingMovies.length ? "block" : "none";
    }

    if (upcomingSection) {
        upcomingSection.style.display =
            upcomingMovies.length ? "block" : "none";
    }


    toggleMovies(
        nowShowingContainer,
        nowShowingMovies,
        viewAllNowShowing
    );

    toggleMovies(
        upcomingContainer,
        upcomingMovies,
        upcomingViewMoreBtn
    );

    if (
        nowShowingMovies.length === 0 &&
        upcomingMovies.length === 0
    ) {

        emptyState.classList.remove("d-none");

    } else {

        emptyState.classList.add("d-none");

    }

}

// ==========================
// Toggle Movies
// ==========================

function toggleMovies(container, movieList, button) {

    if (!container) return;

    function render() {
        container.innerHTML = "";
        const limit = window.innerWidth >= 992 ? 3 : 4;
        const showAll =
            container.id === "nowShowingContainer"
                ? nowShowingExpanded
                : upcomingExpanded;

        const list = showAll
            ? movieList
            : movieList.slice(0, limit);
        list.forEach(([movieKey, movie]) => {

            const isUpcoming = movie.status === "Coming Soon";
            const notifiedMovies = JSON.parse(localStorage.getItem("notifiedMovies")) || [];

const isNotifyButton =  movie.button.type === "notify";

const isNotified = isNotifyButton && notifiedMovies.includes(movieKey);
            container.innerHTML += `

<div class="movie-card">

    <div class="movie-poster">
        <img src="${movie.poster}" alt="${movie.title}">

        ${isUpcoming && movie.badge
                    ? `<span id="notifyBadge-${movieKey}" class="${getBadgeClass(movie.badge.type)} ${isNotified ? "active" : ""}" ${movie.badge.type === "dark"
                        ? `onclick="toggleNotify('${movieKey}', document.getElementById('notifyBtn-${movieKey}'))"`
                        : ""}
        >
                    ${movie.badge.type === "dark"
                        ? `<i class="fa-${JSON.parse(localStorage.getItem("notifiedMovies") || "[]").includes(movieKey)
                            ? "solid"
                            : "regular"
                        } fa-bell"></i>`
                        : `<i class="${movie.badge.icon}"></i>`
                    }
                    ${movie.badge.text}
                </span>`
                    : `<span class="movie-rating">
                    ⭐ ${movie.rating}
                </span>`
                }

    </div>

    <div class="movie-content ${isUpcoming ? "edit" : ""}">

        <h5>${movie.title}</h5>

        <p>${movie.genres.join(" • ")}</p>

        ${isUpcoming
                    ? renderUpcomingButton(movie, movieKey)
                    : `<button class="btn btn-danger w-100"
                        onclick="bookNow('${movieKey}')">
                        Book Tickets
                   </button>`
                }

    </div>

</div>
`;

        });

        if (searchInput) {
            searchInput.addEventListener("input", applyFilters);
        }

        if (button) {

            button.style.display =
                movieList.length > limit ? "inline-block" : "none";

            button.textContent =
                showAll ? "View Less" : "View All";
        }
    }

    if (button) {

        button.onclick = function (e) {

            e.preventDefault();

            if (container.id === "nowShowingContainer") {
                nowShowingExpanded = !nowShowingExpanded;
            } else {
                upcomingExpanded = !upcomingExpanded;
            }

            render();
        };
    }

    render();
}
document.addEventListener("DOMContentLoaded", () => {
    applyFilters();
});
searchInput.addEventListener("input", applyFilters);
window.addEventListener("resize", () => {
    applyFilters();
});

// ==========================
// Badge Class
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
// Upcoming Button
// ==========================

function renderUpcomingButton(movie, movieKey) {

    if (!movie.button) {
        return `
            <button class="btn btn-secondary w-100" disabled>
                Coming Soon
            </button>
        `;
    }
    if (movie.button.type === "notify") {

        const notifiedMovies =
            JSON.parse(localStorage.getItem("notifiedMovies")) || [];

        const isNotified = notifiedMovies.includes(movieKey);

        return `
            <button
                id="notifyBtn-${movieKey}"
                class="${isNotified ? "btn btn-danger w-100" : movie.button.class}"
                onclick="toggleNotify('${movieKey}', this)">
                ${isNotified ? "Notified" : movie.button.text}
            </button>
        `;
    }
    return `
        <button
            class="${movie.button.class}"
            ${movie.button.disabled ? "disabled" : ""}>
            ${movie.button.icon ? `<i class="${movie.button.icon}"></i>` : ""}
            ${movie.button.text}
        </button>
    `;
}


function toggleNotify(movieKey, button) {

    const movie = movies[movieKey];

    if (movie.button.type === "release") {
        return;
    }

    const badge = document.getElementById(`notifyBadge-${movieKey}`);

    let notifiedMovies =
        JSON.parse(localStorage.getItem("notifiedMovies")) || [];

    if (notifiedMovies.includes(movieKey)) {

        notifiedMovies = notifiedMovies.filter(
            movie => movie !== movieKey
        );

        button.classList.remove("btn-danger");
        button.classList.add("btn-outline-danger");
        button.innerHTML = `Notify Me`;

    } else {

        notifiedMovies.push(movieKey);

        button.classList.remove("btn-outline-danger");
        button.classList.add("btn-danger");
        button.innerHTML = `Notified`;

    }

    localStorage.setItem(
        "notifiedMovies",
        JSON.stringify(notifiedMovies)
    );

    applyFilters();
}
