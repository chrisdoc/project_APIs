import { moviesFromTMDB } from "./utils_tmdb.js";
import { moviesFromRAPID } from "./utils_rapid.js";
import { API_Key_Openweather } from "./utils_weather.js";

window.addEventListener("load", main());

async function main() {
   try {
      renderMovies(await moviesFromTMDB("discover_mode"));
   } catch (error) {
      console.log(error);
   }
}

async function getMovies(searchTerm) {
   const movieList = tmdbSelected
      ? await moviesFromTMDB(searchTerm)
      : await moviesFromRAPID(searchTerm);
   return movieList;
}

const submitButton = document.getElementById("submit-button");
const searchMovieInput = document.getElementById("search-movie-input");

submitButton.addEventListener("click", async (e) => {
   e.preventDefault();
   renderMovies(await getMovies(searchMovieInput.value));
});

async function renderMovies(movieList) {
   const mainSection = document.getElementById("main");
   console.log("movieList to Render: ", movieList);
   if (movieList.length > 0) {
      mainSection.innerHTML = ``;
      movieList.forEach((element) => {
         const movieDiv = document.createElement("div");
         movieDiv.classList.add("movie");

         movieDiv.innerHTML = `
         <img src=${element.moviePoster} alt=${element.movieTitle} />
         <div class="movie-info">
            <h2>${element.movieTitle}</h2>
            <span>${element.movieRating}</span>
         </div>
         <article data-overview="${element.movieOverview}"></article>
         <article data-year="${element.movieDate}"></article>
         `;

         movieDiv.addEventListener("click", (e) => {
            modalFormMovieDetails.style.display = "block";
            renderModalForm(e);
         });
         mainSection.appendChild(movieDiv);
      });
   } else {
      console.log("empty movie list: please input a movie title!");
   }
}

let tmdbSelected = true;
const radioButtons = document.querySelectorAll('input[name="radio-api"]');
for (const radioButton of radioButtons) {
   radioButton.addEventListener("change", changeAPI);
}

async function changeAPI(e) {
   // console.log("changeAPI ", e.target.value);
   tmdbSelected = this.value === "tmdb";
   renderMovies(await getMovies(searchMovieInput.value));
}

// renderMovies("TMDB", discoverUrlTMDB, "");
// getWeather();
// countryList = getRestCountries();

// const API_Key_TMDB = "?api_key=" + api_keys[0].API_Key_TMDB;
// const optionsTMDB = {
//    method: "GET",
//    headers: {
//       accept: "application/json",
//       Authorization: api_keys[0].TMDB_Bearer,
//    },
// };
// const baseUrlTMDB = `https://api.themoviedb.org/3/`;
// const discoverTMDB = `discover/movie?`;
// const discoverUrlTMDB = baseUrlTMDB + discoverTMDB + API_Key_TMDB;
// const baseImgUrlTMDB = "https://image.tmdb.org/t/p/w500";
// const searchUrlTMDB = `${baseUrlTMDB}search/movie${API_Key_TMDB}&query=`;

// const API_Key_RAPID = api_keys[1].API_Key_RAPID;
// const optionsRAPID = {
//    method: "GET",
//    headers: {
//       "X-RapidAPI-Key": API_Key_RAPID,
//       "X-RapidAPI-Host": "online-movie-database.p.rapidapi.com",
//    },
// };
// const baseUrlRAPID = `https://online-movie-database.p.rapidapi.com/auto-complete?q=`;

// const radioButtons = document.querySelectorAll('input[name="radio-api"]');
// for (const radioButton of radioButtons) {
//    radioButton.addEventListener("change", changeAPI);
// }

// function changeAPI(e) {
//    if (this.checked) {
//       const selectedAPI = this.value;
//       const searchItem = searchMovieInput.value
//          ? searchMovieInput.value
//          : "alone";

//       if (selectedAPI === "tmdb") {
//          renderMovies("TMDB", searchUrlTMDB, searchItem);
//       } else if (selectedAPI === "rapid")
//          renderMovies("Rapid", baseUrlRAPID, searchItem);
//    }
// }

// async function searchMovies(apiInterface, url, searchTerm) {
//    let tempResults = {};
//    try {
//       if (apiInterface === "TMDB") {
//          const response = await fetch(url + searchTerm, optionsTMDB);
//          const { results } = await response.json();
//          tempResults = results.map((item) => {
//             const tempItem = {};
//             tempItem.movieTitle = item.title;
//             tempItem.moviePoster = item.poster_path
//                ? baseImgUrlTMDB + item.poster_path
//                : "./default_movie_poster.jpg";
//             tempItem.movieOverview = item.overview;
//             tempItem.movieRating = item.vote_average;
//             tempItem.movieDate = item.release_date;
//             return tempItem;
//          });
//       } else {
//          const response = await fetch(baseUrlRAPID + searchTerm, optionsRAPID);
//          const { d } = await response.json();
//          tempResults = d.map((item) => {
//             const tempItem = {};
//             tempItem.movieTitle = item.l;
//             tempItem.moviePoster = item.i.imageUrl;
//             tempItem.movieOverview = item.s;
//             tempItem.movieRating = item.rank;
//             tempItem.movieDate = item.y;
//             return tempItem;
//          });
//       }
//       return tempResults;
//    } catch (error) {
//       console.log(error.message);
//    }
// }

// async function renderMovies(apiInterface, url, searchTerm) {
//    const listMovies = await searchMovies(apiInterface, url, searchTerm);

//    if (listMovies.length > 0) {
//       mainSection.innerHTML = ``;
//       listMovies.forEach((element) => {
//          const movieDiv = document.createElement("div");
//          movieDiv.classList.add("movie");

//          movieDiv.innerHTML = `
//          <img src=${element.moviePoster} alt=${element.movieTitle} />
//          <div class="movie-info">
//             <h2>${element.movieTitle}</h2>
//             <span>${element.movieRating}</span>
//          </div>
//          <article data-overview="${element.movieOverview}"></article>
//          <article data-year="${element.movieDate}"></article>
//          `;

//          movieDiv.addEventListener("click", (e) => {
//             modalFormMovieDetails.style.display = "block";
//             renderModalForm(e);
//          });
//          mainSection.appendChild(movieDiv);
//       });
//    }
// }

/* -------------------------------------------------------- */
/* ---------------- Weather Info Section ------------------ */
/* -------------------------------------------------------- */

let countryList = [];
const getRestCountries = async () => {
   const response = await fetch("https://restcountries.com/v3.1/all");

   const json = await response.json();
   // console.log(json);
   return json;
};

const locationTimezone = document.querySelector(".location-timezone");
const temperatureDegree = document.querySelector(".temperature-degree");
const temperatureDegreeSpan = document.querySelector(
   ".temperature-degree span"
);
const temperatureDescription = document.querySelector(
   ".temperature-description"
);
const weatherIcon = document.querySelector("#weather-icon");
const flagIcon = document.querySelector("#flag-icon");
const refreshWeatherIcon = document.getElementById("refresh-weather-icon");
const infoWeatherIconTable = document.getElementById("info-weather-icon-table");

const containerFooterStickyFooter = document.getElementById("container-footer");
const containerWeatherDetails = document.getElementById(
   "container-weather-details"
);
const containerWeatherDetailsTable = document.getElementById(
   "container-weather-details-table"
);

const tableWeatherDetails = document.getElementById("table-weather-details");

const closeWeatherDetailsTable = document.getElementById(
   "close-weather-details-table"
);

const radio12hours = document.getElementById("radio-12hours");

refreshWeatherIcon.addEventListener("click", getWeather);
infoWeatherIconTable.addEventListener("click", getWeather5days);
closeWeatherDetailsTable.addEventListener("click", () => {
   containerWeatherDetailsTable.style.display = "none";
   containerWeatherDetails.style.display = "none";
});

function getWeather() {
   let long;
   let lat;
   // const API_Key_Openweather = api_keys[3].API_Key_OpenWeather;

   let srcWeatherIcon = "https://openweathermap.org/img/wn/10d@2x.png";

   if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
         long = position.coords.longitude;
         lat = position.coords.latitude;

         const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${API_Key_Openweather}&units=metric`;

         const currentWeather = fetch(url)
            .then((data) => {
               return data.json();
            })
            .then((response) => {
               console.log(response);
               const { main, name, weather, sys } = response;
               locationTimezone.innerHTML = `(${name} / ${sys.country})`;
               temperatureDegree.innerHTML = Math.round(main.temp);
               temperatureDescription.innerHTML = weather[0].description;
               weatherIcon.src = `https://openweathermap.org/img/wn/${weather[0].icon}@2x.png`;
               flagIcon.src = matchFlag(sys.country);
            })
            .catch((err) => {
               console.log("Error: ", err);
            });
      });
   }
}

function drawWeatherDetailsTable(data) {
   containerWeatherDetails.style.display = "block";
   containerWeatherDetailsTable.style.display = "block";

   tableWeatherDetails.innerHTML = "";
   const tempRowHour = document.createElement("tr");
   const tempRowHeat = document.createElement("tr");
   const tempRowDesc = document.createElement("tr");
   const tempRowWind = document.createElement("tr");
   const tempRowIcon = document.createElement("tr");

   data.forEach((element, index) => {
      const tempColHour = document.createElement("td");
      tempColHour.classList.add("format-cell-hour");

      const tempColHeat = document.createElement("td");
      const tempColIcon = document.createElement("td");
      const tempColDesc = document.createElement("td");
      const tempColWind = document.createElement("td");

      if (index === 0) {
         tempColHour.textContent = "Hour";
         tempColHeat.textContent = "Heat";
         tempColDesc.textContent = "Desc.";
         tempColWind.textContent = "Wind";
         tempColIcon.textContent = "Icon";

         tempColHeat.classList.add("format-cell");
         tempColIcon.classList.add("format-cell");
         tempColDesc.classList.add("format-cell");
         tempColWind.classList.add("format-cell");

         tempRowHour.appendChild(tempColHour);
         tempRowHeat.appendChild(tempColHeat);
         tempRowDesc.appendChild(tempColDesc);
         tempRowWind.appendChild(tempColWind);
         tempRowIcon.appendChild(tempColIcon);
      } else {
         const getHoursFromDate = new Date(element.dt_txt).getHours();
         const getMinutesFromDate = new Date(element.dt_txt).getMinutes();
         const convertHours =
            getHoursFromDate < 10 ? "0" + getHoursFromDate : getHoursFromDate;
         const convertMinutes =
            getMinutesFromDate < 10
               ? "0" + getMinutesFromDate
               : getMinutesFromDate;
         tempColHour.innerText = convertHours + ":" + convertMinutes;
         tempRowHour.appendChild(tempColHour);
         const tempHeatValue = Math.round(element.main.temp);
         const convertHeat =
            tempHeatValue > 9 ? tempHeatValue : "0" + tempHeatValue;
         tempColHeat.innerHTML = convertHeat + "<sup>o</sup>C";
         tempRowHeat.appendChild(tempColHeat);

         tempColIcon.innerHTML = `<img src="https://openweathermap.org/img/wn/${element.weather[0].icon}@2x.png" alt="icon">`;
         tempRowIcon.appendChild(tempColIcon);

         tempColDesc.innerText = element.weather[0].description;
         tempRowDesc.appendChild(tempColDesc);

         tempColWind.innerText = element.wind.speed;
         tempRowWind.appendChild(tempColWind);
      }
   });
   tableWeatherDetails.appendChild(tempRowHour);
   tableWeatherDetails.appendChild(tempRowHeat);
   tableWeatherDetails.appendChild(tempRowDesc);
   tableWeatherDetails.appendChild(tempRowWind);
   tableWeatherDetails.appendChild(tempRowIcon);
}

let weatherList = [];
function getWeather5days() {
   let long;
   let lat;
   const API_Key_Openweather = "8fa1f9321e28807ef94ed3e41e70023b";

   let srcWeatherIcon = "https://openweathermap.org/img/wn/10d@2x.png";

   for (const radioButton of radioButtonsWeatherDetails) {
      // console.log("radioButton: ", radioButton);
      radioButton.checked = false;
   }
   radio12hours.checked = true;

   if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
         long = position.coords.longitude;
         lat = position.coords.latitude;

         const urlFiveDays = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${long}&appid=${API_Key_Openweather}&units=metric`;

         const currentWeather = fetch(urlFiveDays)
            .then((data) => {
               return data.json();
            })
            .then((response) => {
               weatherList = response.list;
               drawWeatherDetailsTable(weatherList.slice(0, 5));
            });
      });
   }
}

const matchFlag = (countryAbbreviation) => {
   const tempCountryAbbreviation = countryAbbreviation.trim();

   for (let i = 0; i < countryList.length; i++)
      if (
         tempCountryAbbreviation.toUpperCase() == countryList[i].cca2 ||
         tempCountryAbbreviation == countryList[i].flags.png
      )
         return countryList[i].flags.png;
   return "https://flagcdn.com/w320/nl.png";
};

setInterval(() => {
   console.log("Refreshing weather...");
   getWeather();
}, 2000000);

const radioButtonsWeatherDetails = document.querySelectorAll(
   'input[name="radio-hours"]'
);
for (const radioButton of radioButtonsWeatherDetails) {
   radioButton.addEventListener("change", changeHours);
}

function changeHours(e) {
   if (this.checked) {
      const selectedHours = this.value;
      console.log("selectedHours: ", selectedHours);
      switch (selectedHours) {
         case "6 hours":
            drawWeatherDetailsTable(weatherList.slice(0, 3));
            break;
         case "12 hours":
            drawWeatherDetailsTable(weatherList.slice(0, 5));
            break;
         case "24 hours":
            drawWeatherDetailsTable(weatherList.slice(0, 8));
            break;
         default:
            drawWeatherDetailsTable(weatherList.slice(0, 8));
      }
   }
}

const closeWeatherDetailsGraph = document.getElementById(
   "close-weather-details-graph"
);

closeWeatherDetailsGraph.addEventListener("click", () => {
   containerWeatherDetailsGraph.style.display = "none";
   containerWeatherDetails.style.display = "none";
});

const infoWeatherIconGraph = document.getElementById("info-weather-icon-graph");
infoWeatherIconGraph.addEventListener("click", drawWeatherDetailsGraph);
const containerWeatherDetailsGraph = document.getElementById(
   "container-weather-details-graph"
);

function drawWeatherDetailsGraph(data) {
   containerWeatherDetailsGraph.style.display = "block";
   containerWeatherDetails.style.display = "block";

   const ctx = document.getElementById("canvas-weather-details");

   chartWeather = new Chart(ctx, {
      type: "bar",
      data: {
         labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
         datasets: [
            {
               label: "# of Votes",
               data: [12, 19, 3, 5, 2, 3],
               borderWidth: 1,
            },
         ],
      },
      options: {
         scales: {
            y: {
               beginAtZero: true,
            },
         },
      },
   });
}

/* -------------------------------------------------------- */
/* --------------------- Modal Section -------------------- */
/* -------------------------------------------------------- */
const modalFormMovieDetails = document.getElementById(
   "modal-form-movie-details"
);

const modalFormContent = document.getElementById("modal-form-content");

const spanCloseModalForm = document
   .getElementById("span-close-modal-form")
   .addEventListener(
      "click",
      () => (modalFormMovieDetails.style.display = "none")
   );

const buttonModalFormClose = document
   .getElementById("button-close-modal-form")
   .addEventListener(
      "click",
      () => (modalFormMovieDetails.style.display = "none")
   );

function renderModalForm(e) {
   modalFormContent.innerHTML = "";
   const parentNode = e.target.parentNode;
   console.log(parentNode);

   const movieImgSrc = parentNode.children[0].src;
   console.log("imgSrc: ", movieImgSrc);

   const movieTitle = parentNode.children[1].firstElementChild.innerHTML;
   console.log("movieTitle: ", movieTitle);

   const movieRating = parentNode.children[1].children[1].innerHTML;
   console.log("movieRating: ", movieRating);

   const movieOverview = parentNode.children[2].getAttribute("data-overview");
   console.log("movieOverview: ", movieOverview);

   const movieYear = parentNode.children[3].getAttribute("data-year");
   console.log("movieYear: ", movieYear);

   const fillModalForm = `
   <img src=${movieImgSrc} alt=${movieTitle}>
   <aside id="modal-form-aside">
      <h1 id="details-title">${movieTitle}</h1>
      <br><hr><br>
      <h3 id="details-rating">Rating: ${movieRating}</h3>
      <h3 id="details-year">Release Year: ${movieYear}</h3>
      <br><hr><br>
      <h2>Overview</h2>
      <p id="details-overview">${movieOverview}</p>
   </aside>`;
   modalFormContent.innerHTML = fillModalForm;
}
