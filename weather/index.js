import fetch from 'node-fetch';
import dotenv from "dotenv";
import express from 'express';
dotenv.config();

const router = express.Router();

const fetchWeather = async (searchtext) => {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${searchtext}&appid=${process.env.WEATHER_API_KEY}&units=metric`;
  try {
    const weatherStream = await fetch(url);
    const weatherJson = await weatherStream.json();
    if(weatherJson.cod && weatherJson.cod !== 200) {
      throw new Error(weatherJson.message);
  }
    return weatherJson;
  } catch (err) {
    console.error(err);
    return { error: err.message };
  }
};

// const fetch5dayForecast = async (searchtext) => {
//   const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${searchtext}&appid=${process.env.WEATHER_API_KEY}&units=metric`;
//   try {
//     const weatherStream = await fetch(forecastUrl)
//     console.log('weatherStream:', weatherStream)
//     const weatherJson = await weatherStream.json();
//     if (weatherJson.cod && weatherJson.cod !== 200) {
//       throw new Error(weatherJson.message);
//     }
//     if (!weatherJson.list || !Array.isArray(weatherJson.list)) {
//       // Handle the situation where 'list' is not as expected
//       console.error('Expected "list" to be an array, but it was:', weatherJson.list);
//       return { error: 'Data format error' };
//     }
//   weatherJson.list.forEach(forecast => {
//     const time = forecast.dt_txt;
//     const temperature = forecast.main.temp;
//     const weatherDescription = forecast.weather[0].description;

//     console.log(`Time: ${time}, Temperature: ${temperature}°C, Weather: ${weatherDescription}`);
//   });
//   } catch (err) {
//     console.error(err);
//     return { error: err.message };
//   }
// }

// Example call to the function
// fetch5dayForecast('Ottawa').then((data) => {
//   if (data.error) {
//     console.error('Failed to fetch the weather:', data.error);
//   } else {
//     console.log('Weather data:', data);
//   }
// });

router.get("/", (req, res) => {
  res.json({ success: "Hello Weather" });
});

router.get("/:searchtext", async (req, res) => {
  const searchtext = req.params.searchtext;
  const data = await fetchWeather(searchtext);
  if (data.error) {
    if (data.error.includes('not found')) {
      res.status(404).json({ error: 'City not found' });
    } else {
      res.status(400).json({ error: data.error });
    }
  } else {
    res.json(data);
  }
});


// router.get("/:searchtext", async (req, res) => {
//   const searchtext = req.params.searchtext;
//   const data = await fetch5dayForecast(searchtext);
//   if (data.error) {
//     if (data.error.includes('not found')) {
//       res.status(404).json({ error: 'City not found' });
//     } else {
//       res.status(400).json({ error: data.error });
//     }
//   } else {
//     res.json(data);
//   }
// });

router.post("/", async (req, res) => {
  const searchtext = req.body.searchtext;
  const data = await fetchWeather(searchtext);
  if (data.error) {
    if (data.error.includes('not found')) {
      res.status(404).json({ error: 'City not found' });
    } else {
      res.status(400).json({ error: data.error });
    }
  } else {
    res.json(data);
  }
});

export default router;
