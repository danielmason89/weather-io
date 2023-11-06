// Elements from the DOM are cached for use throughout the script.
const searchInput = document.getElementById("styled-input");
const styledBtn = document.getElementById("styled-button");
const modalBtn = document.querySelector(".modal-btn");
const modalBg = document.querySelector(".modal-bg");
const modalClose = document.querySelector(".modal-close");
const weatherIcon = document.querySelector(".weather-icon");
const card = document.getElementById("hidden");
const errorElement = document.querySelector(".error");
const weatherElement = document.querySelector(".weather");
const timeEl = document.getElementById("time");
const dateEl = document.getElementById("date");
const currentWeatherItemsEl = document.getElementById("current-weather-items");
const timezone = document.getElementById("time-zone");
const countryEl = document.getElementById("country");
const weatherForecastEl = document.getElementById("weather-forecast");
const currentTempEl = document.getElementById("current-temp");

// Event Listener for modal
modalClose.addEventListener("click", function () {
  modalBg.classList.remove("bg-active");
});

// Event listener for the search form submission.
document.getElementById("search-form").addEventListener("submit", function (e) {
  e.preventDefault(); // Prevent the default form submission

  // Hide the card and weather information at the beginning of a new search
  card.style.display = "none";
  weatherElement.style.display = "none";
  errorElement.style.display = "none";

  if (!searchInput.value.trim()) {
    showError("Please enter a City."); // Guard clause for empty input.
    return;
  }

  // Call the function that fetches weather data

  localWeather(searchInput.value)
    .then((data) => {
      if (data) {
        // If data fetch is successful and data is returned, update the modal with the data
        updateWeatherDetails(data);
        // Only display the card if data is successfully retrieved
        card.style.display = "flex";
        weatherElement.style.display = "contents";
        showModal(); // Show the modal with the new data
      }
    })
    .catch((error) => {
      // Handle errors, such as if the city cannot be found
      showError(error.message);
    });
  searchInput.value = ""; // Clear the input field after the search.
});

// Function to show the modal
function showModal() {
  modalBg.classList.add("bg-active");
  card.style.display = "block"; // Make sure the modal content is set to display
}

// Fetches weather data for the given city and updates the UI.
async function localWeather(city) {
  try {
    const response = await fetch(`http://127.0.0.1:3000/weather/${city}`);
    if (!response.ok) {
      throw new Error(
        response.status === 404 || response.status === 400
          ? "Invalid Entry - Please enter a valid City."
          : "Something went wrong. Please try again later."
      );
    }

    const data = await response.json();

    // Handle the edge case where the response JSON could be malformed
    if (data.error) {
      throw new Error(data.error);
    }

    updateWeatherIcon(data.weather[0].main);
    updateWeatherDetails(data);

    return data;
  } catch (error) {
    console.error("Error fetching weather:", error);
    showError(error.message);
    return null;
  }
}

// Updates the weather icon based on current weather conditions.
async function updateWeatherIcon(weatherCondition) {
  const iconMap = {
    Clouds: "./images/clouds.png",
    Clear: "images/clear.png",
    Rain: "images/rain.png",
    Drizzle: "images/drizzle.png",
    Mist: "images/mist.png",
  };

  weatherIcon.src = iconMap[weatherCondition] || ""; // Default icon if the weather condition is not listed
}

async function updateWeatherDetails(data) {
  // Guard clause for invalid data.
  if (data && data.main) {
    document.querySelector(".city").textContent = data.name;
    document.querySelector(".temp").textContent = `${Math.round(
      data.main.temp
    )}°C`;
    document.querySelector(".humidity").textContent = `${data.main.humidity}%`;
    document.querySelector(".wind").textContent = `${Math.round(
      data.wind.speed
    )} km/h`;
  }
}

// Displays an error message on the UI.
async function showError(message) {
  errorElement.textContent = message;
  errorElement.style.display = "block";
  // Hide the weather information and the card when there is an error
  weatherElement.style.display = "none";
  card.style.display = "none";
}

// Time and date updates are separated into their own arrays for clarity.
// Days and months arrays for displaying the date.
const days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sept",
  "Oct",
  "Nov",
  "Dec",
];

// Update the time and date every second.
setInterval(() => {
  const time = new Date();
  const month = time.getMonth();
  const date = time.getDate();
  const day = time.getDay();
  const hour = time.getHours();
  const hoursIn12HrFormat = hour >= 13 ? hour % 12 : hour;
  const minutes = time.getMinutes();
  const formattedMinutes = minutes < 10 ? "0" + minutes : minutes;
  const ampm = hour >= 12 ? "PM" : "AM";

  timeEl.innerHTML =
    hoursIn12HrFormat +
    ":" +
    formattedMinutes +
    "" +
    `<span id="am-pm">${ampm}</span>`;
  dateEl.innerHTML = days[day] + ", " + date + " " + months[month];
}, 1000);

getWeatherData();
function getWeatherData() {
  navigator.geolocation.getCurrentPosition((success) => {
    let { latitude, longitude } = success.coords;

    fetch(
      `https://api.openweathermap.org/data/3.0/onecall?lat=${latitude}&lon=${longitude}&exclude=hourly,minutely&units=metric&appid=e1c81757117c40089df71c8c3a5495d2`
    )
      .then((res) => res.json())
      .then((data) => {
        showWeatherData(data);
      });
  });
}

function formatTime(unixTimestamp) {
  const date = new Date(unixTimestamp * 1000);
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

function showWeatherData(data) {
  let { humidity, pressure, sunrise, sunset, wind_speed } = data.current;

  timezone.innerHTML = data.timezone;
  country.innerHTML = data.lat + "N " + data.lon + "E";

  currentWeatherItemsEl.innerHTML = `<div class="weather-item">
    <div>Humidity</div>
    <div>${humidity}%</div>
    </div>
    <div class="weather-item">
        <div>Pressure</div>
        <div>${pressure}</div>
    </div>
    <div class="weather-item">
        <div>Wind Speed</div>
        <div>${wind_speed} km/h</div>
    </div>
    <div class="weather-item">
        <div>Sunrise</div>
        <div>${formatTime(sunrise)}</div>
    </div>
    <div class="weather-item">
        <div>Sunset</div>
        <div>${formatTime(sunset)}</div>
    </div>`;

  let otherDayForecast = "";
  data.daily.forEach((day, idx) => {
    if (idx == 0) {
      currentTempEl.innerHTML = `
        <div class="others">
        <div class="day">${formatTime(day.dt)}</div>
        <div class="temp">Night ${day.temp.night}&#176; C</div>
        <div class="temp">Day ${day.temp.day}&#176; C</div>
      </div>
      <img
        src="http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png"
        alt="weather icon"
        class="w-icon"
      />
        `;
    } else {
      otherDayForecast += `
            <div class="weather-forecast-item">
            <div class="day">${formatTime(day.dt)}</div>
            <img src="http://openweathermap.org/img/wn/${
              day.weather[0].icon
            }@2x.png" alt="weather icon" class="w-icon">
            <div class="temp">Night | ${day.temp.night}&#176; C</div>
            <div class="temp">Day | ${day.temp.day}&#176; C</div>
            </div>
            `;
    }
  });

  weatherForecastEl.innerHTML = otherDayForecast;
}
