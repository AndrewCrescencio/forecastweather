const date = new Date();
const dayWeek = date.getDay();
const dayWeekArr = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
const dayMonth = date.getDate();
const month = date.getMonth();
const monthArr = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
const year = date.getFullYear();

const weather = {
  fetchWeather(query) {
    const API_KEY = import.meta.env.VITE_API_KEY;
    console.log(API_KEY);
    fetch(
      `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${query}&days=3&aqi=no&alerts=no`
    )
      .then((response) => {
        if (!response.ok) {
          alert("No weather found.");
          throw new Error("No weather found.");
        }
        return response.json();
      })
      .then((data) => {
        this.displayWeather(data);
      });
  },
  displayWeather(data) {
    // Getting data for current informations
    const city = data.location.name;
    //date - lembrar de pegar
    const current_icon = data.current.condition.icon;
    const current_temp = data.current.temp_c;
    // const current_description = data.current.condition.text;

    const current_mintemp = data.forecast.forecastday[0].day.mintemp_c;
    const current_maxtemp = data.forecast.forecastday[0].day.maxtemp_c;
    const current_cloud = data.current.cloud;
    const current_humidity = data.current.humidity;
    const current_wind = data.current.wind_kph;
    const current_rain = data.current.precip_mm;

    document.querySelector(
      ".current__date"
    ).innerText = `${dayWeekArr[dayWeek]}, ${dayMonth} ${monthArr[month]} ${year}`;
    document.querySelector(".current__city").innerText = city;
    document.querySelector(".current__icon").src = current_icon;
    document.querySelector(".current__icon").classList.remove("hidden");
    document.querySelector(".current__temp").innerText = current_temp + "°";
    document.querySelector(".current__mintemp").innerText = current_mintemp;
    document.querySelector(".current__maxtemp").innerText = current_maxtemp;
    document.querySelector(".current__cloud").innerText = current_cloud + "%";
    document.querySelector(".current__humidity").innerText =
      current_humidity + "%";
    document.querySelector(".current__wind").innerHTML = current_wind + "km/h";
    document.querySelector(".current__rain").innerHTML = current_rain + "mm";

    //by hour

    for (let i = 0; i <= 24; i++) {
      const hour_temp = data.forecast.forecastday[0].hour[i].temp_c;
      const hour_humidity = data.forecast.forecastday[0].hour[i].humidity;
      const hour_wind = data.forecast.forecastday[0].hour[i].wind_kph;
      const hour_rain = data.forecast.forecastday[0].hour[i].precip_mm;
      // const hour_chancerain =
      //   data.forecast.forecastday[0].hour[i].chance_of_rain;

      document.querySelector(".details__byhour").innerHTML += `
            <div class="details__byhour__container">
            <div class="row">
                <span class="details__byhour__hour" id="">${i}:00h</span>
            </div>
            <div class="row">
            <span>Temperature</span><span class="details__byhour__temp">${hour_temp}°c</span>
            </div>
            <div class="row">
            <span>Humidity</span><span class="details__byhour__humidity">${hour_humidity}%</span> 
            </div>
            <div class="row">
            <span>Wind</span><span class="details__byhour__wind">${hour_wind}km/h</span>
            </div>
            <div class="row">
            <span>Rain</span><span class="details__byhour__rain">${hour_rain}mm</span>
            </div>
            </div>
            `;
    }
  },
  search() {
    this.fetchWeather(document.getElementById("searchInput").value);
    document.getElementById("searchInput").value = "";
  },
};

// Search button event listener
document.getElementById("searchButton").addEventListener("click", function (e) {
  e.preventDefault();
  weather.search();
});

//initial button event listener
const initialBtn = document.querySelector("[data-initial]");
initialBtn.style.cursor = "pointer";
initialBtn.addEventListener("click", () => {
  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition((position) => {
      var lat = position.coords.latitude;
      var long = position.coords.longitude;
      let onloadQuery = `${lat},${long}`;
      weather.fetchWeather(onloadQuery);
    });
  } else {
    window.alert("geolocation NOT available");
  }
});
