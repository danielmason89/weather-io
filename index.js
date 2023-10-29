require("dotenv").config();
const express = require("express");
const rateLimit = require("express-rate-limit");
const cors = require("cors");
const app = express();
const port = 3000;

const weather = require("./weather");

app.use(express.json());
const whitelist = ['http://127.0.0.1', 'http://127.0.0.1:5500', 'https://danielmason89.github.io/daniel-mason-project-submission-for-intro-to-development/']
const corsOptions = {
    origin: (origin, callback) => {
        if (!origin || whitelist.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error ("Not allowes by CORS"))
        }
    },
    optionsSuccessStatus: 200
}
app.use(cors(corsOptions));

const limiter = rateLimit({
    windowMs: 1000,
    max: 1
});
app.use(limiter);

app.get("/", (req, res) => res.json({ success: "Hello World" }));

app.use("/weather", weather);

app.listen(port, () => console.log(`App listening on port ${port}`));

// const apiKey = function fetchWeather() {
//   let city = document.getElementById("city").value;

//   // This is a mock API endpoint. Replace this with your actual Weather API endpoint.
//   let apiUrl = `https://api.weather.com/v3/weather/conditions/current?city=${city}`;

//   // Fetch the weather data
//   fetch(apiUrl)
//     .then((response) => response.json())
//     .then((data) => {
//       // Assuming the API returns data in this format. Adjust according to your actual API response.
//       document.getElementById("cityName").textContent = city;
//       document.getElementById("temperature").textContent = data.temperature;
//       document.getElementById("condition").textContent = data.condition;

//       // Show the result
//       document.getElementById("weatherResult").style.display = "block";
//     })
//     .catch((error) => {
//       console.error("Error fetching weather:", error);
//       alert("Failed to fetch weather. Please try again.");
//     });
// };
