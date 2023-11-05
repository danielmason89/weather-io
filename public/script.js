const searchInput = document.getElementById('styled-input');
// const searchInput1 = document.getElementById('styled-input1');
const styledBtn = document.getElementById('styled-button');
// const styledBtn1 = document.getElementById('styled-button1');
const weatherIcon = document.querySelector('.weather-icon');
const card = document.getElementById('hidden');
const errorElement = document.querySelector(".error");
const weatherElement = document.querySelector(".weather");
const timeEl = document.getElementById('time');
const dateEl = document.getElementById('date');
const currentWeatherItemsEl = document.getElementById('current-weather-items');
const timezone = document.getElementById('time-zone');
const countryEl = document.getElementById('country');
const weatherForecastEl = document.getElementById('weather-forecast');
const currentTempEl = document.getElementById('current-temp');



styledBtn.addEventListener('click', function (e) {
    e.preventDefault();
    // Hide the card and weather information at the beginning of a new search
    card.style.display = 'none';
    weatherElement.style.display = "none";
    errorElement.style.display = "none";

    if (!searchInput.value.trim()) {
        showError("Please enter a City.");
        return;
    }
    localWeather(searchInput.value);
    searchInput.value = '';
});

// styledBtn1.addEventListener('click', function (e) {
//     e.preventDefault();
//     // Hide the card and weather information at the beginning of a new search
//     card.style.display = 'none';
//     weatherElement.style.display = "none";
//     errorElement.style.display = "none";
//     if (!searchInput.value.trim()) {
//         showError("Please enter a City.");
//         console.log('here:', test)
//         return;
//     }
//     localWeather(searchInput.value);
//     searchInput.value = '';
// });

async function localWeather(city) {
    try {
        const response = await fetch(`http://127.0.0.1:3000/weather/${city}`);
        if (!response.ok) {
            throw new Error(response.status === 404 || response.status === 400 ? "Invalid Entry - Please enter a valid City." : "Something went wrong. Please try again later.");
        }

        const data = await response.json();
        
        // Handle the edge case where the response JSON could be malformed
        if (data.error) {
            throw new Error(data.error);
        }

        await updateWeatherIcon(data.weather[0].main);
        await updateWeatherDetails(data);
        
        // Only display the card if data is successfully retrieved
        card.style.display = 'flex';
        weatherElement.style.display = "contents";

    } catch (error) {
        console.error("Error fetching weather:", error);
        showError(error.message);
    }
}

async function updateWeatherIcon(weatherCondition) {
    const iconMap = {
        "Clouds": './images/clouds.png',
        "Clear": 'images/clear.png',
        "Rain": 'images/rain.png',
        "Drizzle": 'images/drizzle.png',
        "Mist": 'images/mist.png'
    };

    weatherIcon.src = iconMap[weatherCondition] || ''; // Default icon if the weather condition is not listed
}

async function updateWeatherDetails(data) {
    if (data && data.main) {
        document.querySelector(".city").textContent = data.name;
        document.querySelector(".temp").textContent = `${Math.round(data.main.temp)}°C`;
        document.querySelector(".humidity").textContent = `${data.main.humidity}%`;
        document.querySelector(".wind").textContent = `${Math.round(data.wind.speed)} km/h`;
    }
}

async function showError(message) {
    errorElement.textContent = message;
    errorElement.style.display = "block";
    // Hide the weather information and the card when there is an error
    weatherElement.style.display = "none";
    card.style.display = "none";
}

const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];


setInterval(() => {
    const time = new Date();
    const month = time.getMonth();
    const date = time.getDate();
    const day = time.getDay();
    const hour = time.getHours();
    const hoursIn12HrFormat = hour >= 13 ? hour %12: hour 
    const minutes = time.getMinutes();
    const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
    const ampm = hour >= 12 ? 'PM' : 'AM';

    timeEl.innerHTML = hoursIn12HrFormat + ':' + formattedMinutes + '' + `<span id="am-pm">${ampm}</span>`;
    dateEl.innerHTML = days[day] + ', ' + date + ' ' + months[month];
}, 1000);

getWeatherData()
function getWeatherData() {
    navigator.geolocation.getCurrentPosition((success) => {
        console.log(success);

        let { latitude, longitude } = success.coords;

        fetch(`https://api.openweathermap.org/data/3.0/onecall?lat=${latitude}&lon=${longitude}&exclude=hourly,minutely&units=metric&appid=e1c81757117c40089df71c8c3a5495d2`).then(res => res.json()).then(data => {
            console.log(data)
            showWeatherData(data);
        })
    })
}

function formatTime(unixTimestamp) {
    const date = new Date(unixTimestamp * 1000);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
}

function showWeatherData(data) {
    let { humidity, pressure, sunrise, sunset, wind_speed } = data.current;
    
    currentWeatherItemsEl.innerHTML =
    `<div class="weather-item">
    <div>Humidity</div>
    <div>${humidity}%</div>
    </div>
    <div class="weather-item">
        <div>Pressure</div>
        <div>${pressure}</div>
    </div>
    <div class="weather-item">
        <div>Wind Speed</div>
        <div>${wind_speed}km/h</div>
    </div>
    <div class="weather-item">
        <div>Sunrise</div>
        <div>${formatTime(sunrise)}</div>
    </div>
    <div class="weather-item">
        <div>Sunset</div>
        <div>${formatTime(sunset)}</div>
    </div>`;
};

