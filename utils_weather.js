import { api_keys } from "./api_keys.js";

export const API_Key_Openweather = api_keys[2].API_Key_OpenWeather;

/* -------------------------------------------------------- */
/* ---------------- Weather Info Section ------------------ */
/* -------------------------------------------------------- */
const locationTimezone = document.querySelector("#location-timezone");
const temperatureDegree = document.querySelector("#temperature-degree");
// const temperatureDegreeSpan = document.querySelector(
//    ".temperature-degree span"
// );
const temperatureDescription = document.querySelector(
   "#temperature-description"
);
const currentWeatherIcon = document.querySelector("#current-weather-icon");
const flagIcon = document.querySelector("#flag-icon");

const defaultCoordinates = {
   lat: 52.377956,
   long: 4.89707,
};

setInterval(() => {
   console.log("Refreshing weather...");
   getWeatherData();
}, 200000);

const getCountyFlags = async () => {
   const response = await fetch(
      "https://countriesnow.space/api/v0.1/countries/flag/images"
   );
   const { data } = await response.json();
   return data;
};

let countryList = [];
(async function main() {
   countryList = await getCountyFlags();
})();

export function getWeatherData() {
   if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
         const long = position.coords.longitude || defaultCoordinates.long;
         const lat = position.coords.latitude || defaultCoordinates.lat;

         const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${API_Key_Openweather}&units=metric`;

         fetch(url)
            .then((data) => {
               return data.json();
            })
            .then((response) => {
               renderWeatherData(response);
            })
            .catch((err) => {
               console.log("Error: ", err);
            });
      });
   }
}

function renderWeatherData(data) {
   console.log("rendering new weather data");
   const { main, name, weather, sys } = data;
   locationTimezone.innerHTML = `${name}`;
   temperatureDegree.innerHTML = Math.round(main.temp);
   temperatureDescription.innerHTML = weather[0].description;
   currentWeatherIcon.src = `https://openweathermap.org/img/wn/${weather[0].icon}@2x.png`;
   flagIcon.src = matchFlag(sys.country);
}

const matchFlag = (countryAbbreviation) => {
   for (let i = 0; i < countryList.length; i++) {
      if (countryAbbreviation.toUpperCase() === countryList[i].iso2)
         return countryList[i].flag;
   }
   return "https://flagcdn.com/w320/nl.png";
};

const refreshWeatherIcon = document.getElementById("refresh-weather-icon");
refreshWeatherIcon.addEventListener("click", getWeatherData);

/* ----------------------------------------------------------- */
/*                  Weather Table Section                      */
/* ----------------------------------------------------------- */
const infoWeatherIconTable = document.getElementById("info-weather-icon-table");
infoWeatherIconTable.addEventListener("click", getWeather5days);

const containerFooterBody = document.getElementById("container-footer-body");
const containerFooterBodyTable = document.getElementById(
   "container-footer-body-table"
);

const tableWeatherDetails = document.getElementById("table-weather-details");

const closeWeatherDetailsTable = document.getElementById(
   "close-weather-details-table"
);

closeWeatherDetailsTable.addEventListener("click", () => {
   containerFooterBodyTable.style.display = "none";
   containerFooterBody.style.display = "none";
});

const radio12hours = document.getElementById("radio-12hours");

function drawWeatherDetailsTable(data) {
   containerFooterBody.style.display = "block";
   containerFooterBodyTable.style.display = "block";

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
   for (const radioButton of radioButtonsWeatherDetails) {
      radioButton.checked = false;
   }
   radio12hours.checked = true;

   if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
         const long = position.coords.longitude;
         const lat = position.coords.latitude;

         const urlFiveDays = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${long}&appid=${API_Key_Openweather}&units=metric`;

         const currentWeather = fetch(urlFiveDays)
            .then((data) => {
               return data.json();
            })
            .then((response) => {
               weatherList = response.list;
               // console.log("weatherList: ", weatherList);
               drawWeatherDetailsTable(weatherList.slice(0, 5));
            });
      });
   }
}

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

/* ----------------------------------------------------------- */
/*                  Weather Graph Section                      */
/* ----------------------------------------------------------- */
const infoWeatherIconGraph = document.getElementById("info-weather-icon-graph");
infoWeatherIconGraph.addEventListener("click", getWeather5daysGraph);

const containerFooterBodyGraph = document.getElementById(
   "container-footer-body-graph"
);

const closeWeatherDetailsGraph = document.getElementById(
   "close-weather-details-graph"
);

closeWeatherDetailsGraph.addEventListener("click", () => {
   containerFooterBodyGraph.style.display = "none";
   containerFooterBody.style.display = "none";
});

let myChart = null;
function drawWeatherDetailsGraph(data) {
   containerFooterBodyGraph.style.display = "flex";
   containerFooterBody.style.display = "block";

   const ctx = document.getElementById("canvas-weather-details");

   if (myChart != null) myChart.destroy();

   console.log("data: ", data);

   let labelsHours = [];
   let dataHeat = [];
   data.forEach((element) => {
      const getHoursFromDate = new Date(element.dt_txt).getHours();
      const getMinutesFromDate = new Date(element.dt_txt).getMinutes();
      const convertHours =
         getHoursFromDate < 10 ? "0" + getHoursFromDate : getHoursFromDate;
      const convertMinutes =
         getMinutesFromDate < 10
            ? "0" + getMinutesFromDate
            : getMinutesFromDate;
      // tempColHour.innerText = convertHours + ":" + convertMinutes;
      labelsHours.push(convertHours + ":" + convertMinutes);

      const tempHeatValue = Math.round(element.main.temp);
      // const convertHeat =
      //    tempHeatValue > 9 ? tempHeatValue : "0" + tempHeatValue;
      dataHeat.push(tempHeatValue);
   });

   console.log("labelsHours: ", labelsHours);
   console.log("dataHeat: ", dataHeat);

   myChart = new Chart(ctx, {
      type: "bar",
      data: {
         // labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
         labels: labelsHours,
         datasets: [
            {
               label: "5 Days Forecast",
               // data: [12, 19, 3, 5, 2, 3],
               data: dataHeat,
               // borderWidth: 50,
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

let weatherListGraph = [];
function getWeather5daysGraph() {
   // console.log("uuuuuuuuuuuuu");
   if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
         const long = position.coords.longitude;
         const lat = position.coords.latitude;

         // console.log("long", long);
         // console.log("lat", lat);

         const urlFiveDays = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${long}&appid=${API_Key_Openweather}&units=metric`;

         // console.log("urlFiveDays", urlFiveDays);

         const currentWeather = fetch(urlFiveDays)
            .then((data) => {
               return data.json();
            })
            .then((response) => {
               weatherListGraph = response.list;
               // console.log("response: ", response.list);
               // console.log("weatherList: ", weatherList);
               drawWeatherDetailsGraph(weatherListGraph);
            });
      });
   }
}

// function getWeather() {
//    let long;
//    let lat;

//    let srcWeatherIcon = "https://openweathermap.org/img/wn/10d@2x.png";

//    if (navigator.geolocation) {
//       navigator.geolocation.getCurrentPosition((position) => {
//          long = position.coords.longitude;
//          lat = position.coords.latitude;

//          const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${API_Key_Openweather}&units=metric`;

//          const currentWeather = fetch(url)
//             .then((data) => {
//                return data.json();
//             })
//             .then((response) => {
//                console.log(response);
//                const { main, name, weather, sys } = response;
//                locationTimezone.innerHTML = `(${name} / ${sys.country})`;
//                temperatureDegree.innerHTML = Math.round(main.temp);
//                temperatureDescription.innerHTML = weather[0].description;
//                currentWeatherIcon.src = `https://openweathermap.org/img/wn/${weather[0].icon}@2x.png`;
//                flagIcon.src = matchFlag(sys.country);
//             })
//             .catch((err) => {
//                console.log("Error: ", err);
//             });
//       });
//    }
// }
