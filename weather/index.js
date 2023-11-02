const express = require("express");
const router = express.Router();
let fetch;


import('node-fetch').then(module => {
    fetch = module.default;
});

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

router.get("/", (req, res) => {
  res.json({ success: "Hello Weather" });
});

router.get("/:searchtext", async (req, res) => {
  const searchtext = req.params.searchtext;
  const data = await fetchWeather(searchtext);
  if(data.error) {
    return res.status(400).json({ error: data.error });
}
  res.json(data);
});

router.post("/", async (req, res) => {
  const searchtext = req.body.searchtext;
  const data = await fetchWeather(searchtext);
  res.json(data);
});

module.exports = router;
