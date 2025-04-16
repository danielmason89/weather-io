import dotenv from "dotenv";
import express from "express";

dotenv.config();
const router = express.Router();

async function fetchWeather(searchtext) {
  // Construct the URL with the search text and API key from environment variables
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${searchtext}&appid=${process.env.WEATHER_API_KEY}&units=metric`;
  try {
    // Fetch the weather data
    const weatherStream = await fetch(url);
    // Parse the JSON response
    const weatherJson = await weatherStream.json();
    // If the API response contains a code other than 200, throw an error
    if (weatherJson.cod && weatherJson.cod !== 200) {
      throw new Error(weatherJson.message);
    }
    // Return the parsed weather data
    return weatherJson;
  } catch (err) {
    // Log and return any errors encountered during the fetch operation
    console.error(err);
    return { error: err.message };
  }
};

// Define a GET route for the base /weather path to respond with a success message
router.get("/", (req, res) => {
  res.json({ success: "Hello Weather" });
});

// Define a GET route with a dynamic segment to fetch weather by city name
router.get("/:searchtext", async (req, res) => {
  // Retrieve the search text from the route parameters
  const searchtext = req.params.searchtext;
  // Fetch weather data using the provided city name
  const data = await fetchWeather(searchtext);
  // Check if the fetch operation returned an error and respond accordingly
  if (data.error) {
    // If the error message includes 'not found', send a 404 response
    if (data.error.includes("not found")) {
      res.status(404).json({ error: "City not found" });
    } else {
      // For other errors, send a 400 response
      res.status(400).json({ error: data.error });
    }
  } else {
    // If there is no error, send the weather data as a JSON response
    res.json(data);
  }
});

router.post("/", async (req, res) => {
  const searchtext = req.body.searchtext;
  const data = await fetchWeather(searchtext);
  // Check if the fetch operation returned an error and respond accordingly
  if (data.error) {
    // If the error message includes 'not found', send a 404 response
    if (data.error.includes("not found")) {
      res.status(404).json({ error: "City not found" });
    } else {
      // For other errors, send a 400 response
      res.status(400).json({ error: data.error });
    }
    // If there is no error, send the weather data as a JSON response
  } else {
    res.json(data);
  }
});

// Export the router for use in the main server file
export default router;
