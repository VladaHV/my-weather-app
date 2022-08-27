function convertDate(date) {
  let month = date.getMonth() + 1;
  let data = date.getDate();
  if (month < 10) {
    month = "0" + month;
  }
  if (data < 10) {
    data = "0" + data;
  }
  let currentDate = `${data}.${month}.${date.getUTCFullYear()}`;
  return currentDate;
}

function convertDay(date) {
  let day = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let currentDay = `${day[date.getDay()]}`;
  return currentDay;
}

function convertDayShort(date) {
  let day = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  let currentDay = `${day[date.getDay()]}`;
  return currentDay;
}

function convertTime(date) {
  let minutes = date.getMinutes();
  let hours = date.getHours();
  if (minutes < 10) {
    minutes = "0" + minutes;
  }
  if (hours < 10) {
    hours = "0" + hours;
  }
  let currentTime = `${hours}:${minutes}`;
  return currentTime;
}

function switchButtonsDefault() {
  document.querySelector(`#fahrenheit`).classList.remove(`dis`);
  document.querySelector(`#fahrenheit`).classList.add(`btn-primary`);
  document.querySelector(`#cellcius`).classList.remove(`btn-primary`);
  document.querySelector(`#cellcius`).classList.add(`dis`);
}

function getC(event) {
  event.preventDefault();
  switchButtonsDefault();
  document.querySelector("#temp").innerHTML = `${tempCelGlobal}°C`;
  document.querySelector("#max-temp").innerHTML = `${tempCelMaxGlobal}°C`;
  document.querySelector("#min-temp").innerHTML = `${tempCelMinGlobal}°C`;
  tempForecast.max.forEach(function (max, index) {
    document.querySelector(`#max${index}`).innerHTML = `${max}°C`;
  });
  tempForecast.min.forEach(function (min, index) {
    document.querySelector(`#min${index}`).innerHTML = `${min}°C`;
  });
}

function convertation(c) {
  let f = c * (9 / 5) + 32;
  f = Math.round(f);
  return f;
}

function checkBtn() {
  let checkButton = document.querySelector(`button#fahrenheit`).classList;
  if (checkButton.contains("dis")) {
    convertCtoF();
  }
}

function convertCtoF() {
  let arrayTemp = [tempCelGlobal, tempCelMaxGlobal, tempCelMinGlobal];
  arrayTemp = arrayTemp.concat(tempForecast.max).concat(tempForecast.min);
  let arrayId = [`#temp`, `#max-temp`, `#min-temp`];
  let arrayIdForecastMax = [
    `#max0`,
    `#max1`,
    `#max2`,
    `#max3`,
    `#max4`,
    `#max5`,
  ];
  let arrayIdForexastMin = [
    `#min0`,
    `#min1`,
    `#min2`,
    `#min3`,
    `#min4`,
    `#min5`,
  ];
  arrayId = arrayId.concat(arrayIdForecastMax).concat(arrayIdForexastMin);
  arrayTemp.forEach(function (temp, index) {
    let t = convertation(temp);
    document.querySelector(arrayId[index]).innerHTML = `${t}°F`;
  });

  document.querySelector(`#fahrenheit`).classList.add(`dis`);
  document.querySelector(`#fahrenheit`).classList.remove(`btn-primary`);
  document.querySelector(`#cellcius`).classList.add(`btn-primary`);
  document.querySelector(`#cellcius`).classList.remove(`dis`);
}

//Onecall doest work!!!!!!!
function getForecast(coordinates) {
  let lat = coordinates.lat;
  let lon = coordinates.lon;
  let apiKey = `a43564c91a6c605aeb564c9ed02e3858`;
  // my apiKey =
  // 4607362530226bdeeb057b9cf8e4a1d1
  // cc51a9af04c66250e3d2034bcced18b7

  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?`;
  //let apiUrl = `https://api.openweathermap.org/data/2.5/forecast?`;

  let units = `metric`;
  let fullUrl = `${apiUrl}lat=${lat}&lon=${lon}&appid=${apiKey}&units=${units}`;
  axios.get(fullUrl).then(weatherForecast);
}
function weatherForecast(response) {
  let forecast = response.data.daily;
  let forecastElement = document.querySelector(`#future-weather`);
  let forecastHTML = `<div class="row text-center mx-1 lh-sm">`;

  forecast.forEach(function (forecastDay, index) {
    if (index < 6) {
      let timeStamp = forecastDay.dt * 1000;
      let date = new Date(timeStamp);
      forecastHTML =
        forecastHTML +
        `<div class="col-2">
            <div class="card p-1 style">
                <div class="date">${convertDate(date)}</div>
                <div class="day">${convertDayShort(date)}</div>
                <div class="maxTemp" id="max${index}">${Math.round(
          forecastDay.temp.max
        )}°C</div>
                <img 
					src="https://openweathermap.org/img/wn/${forecastDay.weather[0].icon}@2x.png"
					alt="${forecastDay.weather[0].description}"
					class="m-auto"
					width=64>
                <div class="minTemp" id="min${index}">${Math.round(
          forecastDay.temp.min
        )}°C</div>
            </div>
        </div>
		`;
      tempForecast.max[index] = Math.round(forecastDay.temp.max);
      tempForecast.min[index] = Math.round(forecastDay.temp.min);
    }
  });
  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;
  checkBtn();
}

//show weather from Openweathermap
function showWeatherC(response) {
  let temp = Math.round(response.data.main.temp);
  tempCelGlobal = temp;
  let tempMin = Math.round(response.data.main.temp_min);
  tempCelMinGlobal = tempMin;
  let tempMax = Math.round(response.data.main.temp_max);
  tempCelMaxGlobal = tempMax;
  let humidity = response.data.main.humidity;
  let wind = Math.round(response.data.wind.speed);
  let pressure = response.data.main.pressure;
  let desc = response.data.weather[0].description;
  let timeStamp = response.data.dt * 1000;
  let date = new Date(timeStamp);
  let currentDate = document.querySelector("#date");
  let curentDay = document.querySelector("#day");
  let currentTime = document.querySelector("#time");
  let sunrise = convertTime(new Date(response.data.sys.sunrise * 1000));
  let sunset = convertTime(new Date(response.data.sys.sunset * 1000));

  //refresh Date
  currentDate.innerHTML = convertDate(date);

  //refresh Day
  curentDay.innerHTML = convertDay(date);

  //refreshTime
  currentTime.innerHTML = convertTime(date);

  document.querySelector("#city").innerHTML = response.data.name;

  let iconWeatherId = response.data.weather[0].icon;
  document.getElementById(
    "weather-icon"
  ).src = `https://openweathermap.org/img/wn/${iconWeatherId}@2x.png`;
  document.getElementById("weather-icon").alt = `${desc}`;
  document.querySelector("#temp").innerHTML = `${temp}°C`;
  document.querySelector("#max-temp").innerHTML = `${tempMax}°C`;
  document.querySelector("#min-temp").innerHTML = `${tempMin}°C`;
  document.querySelector("#hum").innerHTML = humidity;
  document.querySelector("#wind-speed").innerHTML = wind;
  document.querySelector("#pressure").innerHTML = pressure;
  document.querySelector("#description").innerHTML = desc;
  document.querySelector("#sunrise").innerHTML = sunrise;
  document.querySelector("#sunset").innerHTML = sunset;
  checkBtn();
  getForecast(response.data.coord);
}

//get weather on Openweathermap
function getWeatherC(city) {
  let apiKey = `d2f29325392e89bb7db342ef1733f9b4`;
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=`;
  let units = `metric`;
  let fullUrl = `${apiUrl}${city}&appid=${apiKey}&units=${units}`;
  axios
    .get(fullUrl)
    .then(showWeatherC)
    .catch(function (error) {
      alert(
        `Sorry😢, but ${error.response.data.message} - ${city}! Try again😎!`
      );
    });
}

//change city
function searchCity(event) {
  event.preventDefault();
  let userCity = document.querySelector("#user-city");
  let city = userCity.value.trim();
  if (city) {
    document.querySelector("#user-city").value = "";
    getWeatherC(city);
  }
}

//search weather by current position
function getWeatherGeo(lat, lon) {
  let apiKey = `d2f29325392e89bb7db342ef1733f9b4`;
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?`;
  let units = `metric`;
  let fullUrl = `${apiUrl}lat=${lat}&lon=${lon}&appid=${apiKey}&units=${units}`;
  axios.get(fullUrl).then(showWeatherC);
}

//get current geo position
function currentPosition(position) {
  let lat = position.coords.latitude;
  let lon = position.coords.longitude;
  getWeatherGeo(lat, lon);
}

function getPosition() {
  navigator.geolocation.getCurrentPosition(currentPosition);
}

//global variables
let tempCelGlobal = null;
let tempCelMaxGlobal = null;
let tempCelMinGlobal = null;
let tempForecast = { max: [], min: [] };

let buttonC = document.querySelector("#cellcius");
buttonC.addEventListener("click", getC);

let buttonF = document.querySelector("#fahrenheit");
buttonF.addEventListener("click", convertCtoF);

let searchForm = document.querySelector("#search-form");
searchForm.addEventListener("submit", searchCity);

let geoButtonClick = document.querySelector("#geo-button");
geoButtonClick.addEventListener("click", getPosition);

//load the page with info in current geo position
//getPosition();

getWeatherC(`Kryvyi Rih`);
