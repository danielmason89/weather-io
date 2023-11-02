const searchInput = document.getElementById('styled-input');
const styledBtn = document.getElementById('styled-button');
const weatherIcon = document.querySelector('.weather-icon');
const card = document.getElementById('hidden');


styledBtn.addEventListener('click', function (e) {
    e.preventDefault();
    if (!searchInput.value.trim()) {
        showError("Please enter a city name.");
        return;
    }
    checkWeather(searchInput.value);
    searchInput.value = '';
    checkWeather()
});

async function checkWeather(city) {
    try {
        const response = await fetch(`http://127.0.0.1:3000/weather/${city}`);
        if (!response.ok) {
            if (response.status === 404 || response.status === 400) {
                showError("Invalid Entry - Please enter a city name.");
            } else if (response.status === '') {
                showError("Something went wrong. Please try again later.");
            }
        } else {
            document.querySelector(".error").style.display = "none";
            const data = await response.json();
            console.log(data);
            if (data.weather[0].main == "Clouds") {
                weatherIcon.src = './images/clouds.png'
            } else if (data.weather[0].main == "Clear") {
                weatherIcon.src = 'images/clear.png'
            } else if (data.weather[0].main == "Rain") {
                weatherIcon.src = 'images/rain.png'
            } else if (data.weather[0].main == "Drizzle") {
                weatherIcon.src = 'images/drizzle.png'
            } else if (data.weather[0].main == "Mist") {
                weatherIcon.src = 'images/mist.png'
            }
            document.querySelector(".error").style.display = "none";
            const card = document.querySelector("#hidden");
            if (card.style.display === 'none' || card.style.display === '') {
                card.style.display = 'flex';
            } else {
                card.style.display = 'none';
            }
            document.querySelector(".weather").style.display = "block";
            console.log(data)
            if (data && data.main) {
                document.querySelector(".city").innerHTML = data.name;
                document.querySelector(".temp").innerHTML = Math.round(data.main.temp) + "°c";
                document.querySelector(".humidity").innerHTML = `${data.main.humidity}` + "%";
                document.querySelector(".wind").innerHTML = Math.round(data.wind.speed) + "km/h";
            }
        }
    } catch (error) {
        console.error("Error fetching weather:", error);
        const card = document.querySelector("#hidden");
        card.style.display = "none";
        card.setAttribute('hidden', true);
        showError("Failed to fetch weather. Please try again.");
    }
    }

function showError(message) {
    document.querySelector(".error p").textContent = message;
    document.querySelector(".error").style.display = "block";
    // document.querySelector(".weather").style.display = "none";
}