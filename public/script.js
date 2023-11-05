
const searchInput = document.getElementById('styled-input');
const searchInput1 = document.getElementById('styled-input1');
const styledBtn = document.getElementById('styled-button');
const styledBtn1 = document.getElementById('styled-button1');
const weatherIcon = document.querySelector('.weather-icon');
const card = document.getElementById('hidden');
const errorElement = document.querySelector(".error");
const weatherElement = document.querySelector(".weather");

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

styledBtn1.addEventListener('click', function (e) {
    e.preventDefault();
    // Hide the card and weather information at the beginning of a new search
    card.style.display = 'none';
    weatherElement.style.display = "none";
    errorElement.style.display = "none";
    if (!searchInput.value.trim()) {
        showError("Please enter a City.");
        console.log('here:', test)
        return;
    }
    localWeather(searchInput.value);
    searchInput.value = '';
});

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

        updateWeatherIcon(data.weather[0].main);
        updateWeatherDetails(data);
        
        // Only display the card if data is successfully retrieved
        card.style.display = 'flex';
        weatherElement.style.display = "contents";

    } catch (error) {
        console.error("Error fetching weather:", error);
        showError(error.message);
    }
}

function updateWeatherIcon(weatherCondition) {
    const iconMap = {
        "Clouds": './images/clouds.png',
        "Clear": 'images/clear.png',
        "Rain": 'images/rain.png',
        "Drizzle": 'images/drizzle.png',
        "Mist": 'images/mist.png'
    };

    weatherIcon.src = iconMap[weatherCondition] || ''; // Default icon if the weather condition is not listed
}

function updateWeatherDetails(data) {
    if (data && data.main) {
        document.querySelector(".city").textContent = data.name;
        document.querySelector(".temp").textContent = `${Math.round(data.main.temp)}°C`;
        document.querySelector(".humidity").textContent = `${data.main.humidity}%`;
        document.querySelector(".wind").textContent = `${Math.round(data.wind.speed)} km/h`;
    }
}

function showError(message) {
    errorElement.textContent = message;
    errorElement.style.display = "block";
    // Hide the weather information and the card when there is an error
    weatherElement.style.display = "none";
    card.style.display = "none";
}
