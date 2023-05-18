import { api_keys } from "./api_keys.js";

export const API_Key_Openweather = api_keys[2].API_Key_OpenWeather;

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
const weatherIcon = document.querySelector("#current-weather-icon");
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
