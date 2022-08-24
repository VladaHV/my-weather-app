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
//click Buttons
function getC(event) {
  event.preventDefault();
  let city = document.querySelector("#city").innerHTML;
}

function convertation(c) {
  let f = c * (9 / 5) + 32;
  f = Math.round(f);
  return f;
}

function convertCtoF() {
  let arrayTemp = [tempCelGlobal, tempCelMaxGlobal, tempCelMinGlobal];
  let arrayId = [`#temp`, `#max-temp`, `#min-temp`];
  for (let i = 0; i < arrayTemp.length; i++) {
    let t = convertation(arrayTemp[i]);
    document.querySelector(arrayId[i]).innerHTML = `${t}°F`;
  }
  /*	let temp = parseInt(document.querySelector("#temp").innerHTML, 10);
	let tempMax = parseInt(document.querySelector("#max-temp").innerHTML, 10);
	let tempMin = parseInt(document.querySelector("#min-temp").innerHTML, 10);
	tempMax = convertation(tempMax);
	tempMin = convertation(tempMin);
	document.querySelector("#max-temp").innerHTML = `${tempMax}°F`;
	document.querySelector("#min-temp").innerHTML = `${tempMin}°F`;*/
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
  let desc = response.data.weather[0].description;
  let timeStamp = response.data.dt * 1000;
  let date = new Date(timeStamp);
  let currentDate = document.querySelector("#date");
  let curentDay = document.querySelector("#day");
  let currentTime = document.querySelector("#time");
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
  document.querySelector("#temp").innerHTML = `${temp}°C`;
  document.querySelector("#max-temp").innerHTML = `${tempMax}°C`;
  document.querySelector("#min-temp").innerHTML = `${tempMin}°C`;
  document.querySelector("#hum").innerHTML = humidity;
  document.querySelector("#wind-speed").innerHTML = wind;
  document.querySelector("#description").innerHTML = desc;
}

/*function showWeatherF(response) {
	let temp = Math.round(response.data.main.temp);
	let tempMin = Math.round(response.data.main.temp_min);
	let tempMax = Math.round(response.data.main.temp_max);
	//let iconWeatherId = response.data.weather[0].icon;
	document.querySelector("#temp").innerHTML = `${temp}°F`;
	document.querySelector("#max-temp").innerHTML = `${tempMax}°F`;
	document.querySelector("#min-temp").innerHTML = `${tempMin}°F`;
}
function getWeatherF() {
	let apiKey = `d2f29325392e89bb7db342ef1733f9b4`;
	let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=`;
	let units = `imperial`;
	let cityF = document.querySelector(`#city`).innerHTML.trim();
	let fullUrl = `${apiUrl}${cityF}&appid=${apiKey}&units=${units}`;
	axios.get(fullUrl).then(showWeatherF);
}*/

//get weather on Openweathermap
function getWeatherC(city) {
  let apiKey = `d2f29325392e89bb7db342ef1733f9b4`;
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=`;
  let units = `metric`;
  let fullUrl = `${apiUrl}${city}&appid=${apiKey}&units=${units}`;
  axios.get(fullUrl).then(showWeatherC);
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

//global variables
let tempCelGlobal = null;
let tempCelMaxGlobal = null;
let tempCelMinGlobal = null;

let buttonC = document.querySelector("#cellcius");
buttonC.addEventListener("click", getC);

let buttonF = document.querySelector("#fahrenheit");
buttonF.addEventListener("click", convertCtoF);

let searchForm = document.querySelector("#search-form");
searchForm.addEventListener("submit", searchCity);

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

let geoButtonClick = document.querySelector("#geo-button");
geoButtonClick.addEventListener("click", getPosition);

//load the page with info in current geo position
//getPosition();

getWeatherC(`Kryvyi Rih`);
