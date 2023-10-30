const searchInput = document.getElementById('styled-input');
const styledBtn = document.getElementById('styled-button');
const weatherIcon = document.querySelector('.weather-icon');
const card = document.getElementById('.card');


styledBtn.addEventListener('click', function (e) {
    e.preventDefault();
    checkWeather(searchInput.value);
    searchInput.value = '';
});

async function checkWeather(city) {
    try {
        const response = await fetch(`http://127.0.0.1:3000/weather/${city}`);
        if (response.status == 404) {
            // document.querySelector(".error").style.display = "block";
            document.querySelector(".weather").style.display = "none";
        } else {

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

            // document.querySelector(".error").style.display = "none";
            const card = document.querySelector("#hidden");
                if(card.style.display === 'none' || card.style.display === '') {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
        }
        const data = await response.json();
        console.log(data)
        if (data && data.main) {
            document.querySelector(".city").innerHTML = data.name;
            document.querySelector(".temp").innerHTML = Math.round(data.main.temp) + "°c";
            document.querySelector(".humidity").innerHTML = `${data.main.humidity}` + "%";
            document.querySelector(".wind").innerHTML = Math.round(data.wind.speed) + "km/h";
        }

    } catch { (error) => {
        console.error("Error fetching weather:", error);
        alert("Failed to fetch weather. Please try again.");
    }
    }
}