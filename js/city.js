const cityBtn = document.getElementById("cityBtn");
const cityMenu = document.getElementById("cityMenu");
const citySearch = document.getElementById("citySearch");
const selectedCity = document.getElementById("selectedCity");

const cityItems = document.querySelectorAll(".city-item");

// Load Saved City
const savedCity = localStorage.getItem("cinegoCity") || "Chennai";

selectedCity.textContent = savedCity;

setActive(savedCity);

// Toggle
cityBtn.onclick = (e)=>{

    e.stopPropagation();

    cityMenu.classList.toggle("active");

    cityBtn.classList.toggle("active");

    citySearch.focus();

};

// Outside Click
document.onclick=()=>{

    cityMenu.classList.remove("active");

    cityBtn.classList.remove("active");

};

// Prevent Close
cityMenu.onclick=(e)=>{

    e.stopPropagation();

};

// Search
citySearch.onkeyup=()=>{

    const value=citySearch.value.toLowerCase();

    cityItems.forEach(item=>{

        item.style.display=item.dataset.city
        .toLowerCase()
        .includes(value)
        ?"flex":"none";

    });

};

// Select City
cityItems.forEach(item=>{

    item.onclick=()=>{

        const city=item.dataset.city;

        localStorage.setItem("cinegoCity",city);

        selectedCity.textContent=city;

        setActive(city);

        cityMenu.classList.remove("active");

        cityBtn.classList.remove("active");

        citySearch.value="";

        cityItems.forEach(i=>i.style.display="flex");

        // Future:
        // loadMovies(city);
        // loadTheatres(city);

    };

});

// Active
function setActive(city){

    cityItems.forEach(item=>{

        item.classList.remove("active");

        if(item.dataset.city===city){

            item.classList.add("active");

        }

    });

}