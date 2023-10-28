function fetchWeather() {
    let city = document.getElementById('city').value;
    
    // This is a mock API endpoint. Replace this with your actual Weather API endpoint.
    let apiUrl = `https://api.weather.com/v3/weather/conditions/current?city=${city}`;

    // Fetch the weather data
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            // Assuming the API returns data in this format. Adjust according to your actual API response.
            document.getElementById('cityName').textContent = city;
            document.getElementById('temperature').textContent = data.temperature;
            document.getElementById('condition').textContent = data.condition;

            // Show the result
            document.getElementById('weatherResult').style.display = 'block';
        })
        .catch(error => {
            console.error('Error fetching weather:', error);
            alert('Failed to fetch weather. Please try again.');
        });
}