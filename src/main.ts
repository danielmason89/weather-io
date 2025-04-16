type WeatherCondition = "Clouds" | "Clear" | "Rain" | "Drizzle" | "Mist";

interface WeatherApiResponse {
  name: string;
  weather: [{ main: WeatherCondition; icon: string }];
  main: { temp: number; humidity: number };
  wind: { speed: number };
}

function byId<T extends HTMLElement>(id: string): T {
  const el = document.getElementById(id);
  if (!el) throw new Error(`${id} not found in DOM`);
  return el as T;
}

function qs<T extends Element>(sel: string): T {
  const el = document.querySelector(sel);
  if (!el) throw new Error(`Element "${sel}" not found in DOM`);
  return el as T;
}

const searchInput       = byId<HTMLInputElement>("styled-input");
const styledBtn         = byId<HTMLButtonElement>("styled-button");
const modalBg           = qs<HTMLDivElement>(".modal-bg");
const modalClose        = qs<HTMLButtonElement>(".modal-close");
const weatherIcon       = qs<HTMLImageElement>(".weather-icon");
const card              = byId<HTMLDivElement>("hidden");
const errorElement      = qs<HTMLDivElement>(".error");
const weatherElement    = qs<HTMLDivElement>(".weather");
const timeEl            = byId<HTMLSpanElement>("time");
const dateEl            = byId<HTMLSpanElement>("date");
const currentWeatherEl  = byId<HTMLDivElement>("current-weather-items");
const timezoneEl        = byId<HTMLDivElement>("time-zone");
const countryEl         = byId<HTMLDivElement>("country");
const forecastEl        = byId<HTMLDivElement>("weather-forecast");
const currentTempEl     = byId<HTMLDivElement>("current-temp");

const iconMap: Record<WeatherCondition, string> = {
  Clouds  : "/images/clouds.png",
  Clear   : "/images/clear.png",
  Rain    : "/images/rain.png",
  Drizzle : "/images/drizzle.png",
  Mist    : "/images/mist.png",
};

modalClose.addEventListener("click", () => modalBg.classList.remove("bg-active"));
function showModal(): void   { modalBg.classList.add("bg-active"); }
function hideModal(): void   { modalBg.classList.remove("bg-active"); }

byId<HTMLFormElement>("search-form").addEventListener("submit", async e => {
  e.preventDefault();

  clearDisplay();

  const city = searchInput.value.trim();
  searchInput.value = "";

  if (!city) {
    showError("Please enter a city.");
    return;
  }

  const data = await fetchWeather(city);
  if (data) {
    updateWeatherDetails(data);
    card.style.display    = "flex";
    weatherElement.style.display = "contents";
    showModal();
  }
});

function clearDisplay(): void {
  card.style.display        = "none";
  weatherElement.style.display = "none";
  errorElement.style.display   = "none";
}

async function fetchWeather(city: string): Promise<WeatherApiResponse | null> {
  try {
    const res = await fetch(`http://127.0.0.1:3000/weather/${encodeURIComponent(city)}`);
    if (!res.ok) {
      throw new Error(res.status === 404 || res.status === 400
        ? "Invalid entry – please enter a valid city."
        : "Something went wrong. Please try again later."
      );
    }

    const data: WeatherApiResponse = await res.json();
    updateWeatherIcon(data.weather[0].main);
    return data;
  } catch (err) {
    console.error(err);
    showError((err as Error).message);
    return null;
  }
}

function updateWeatherIcon(condition: WeatherCondition): void {
  weatherIcon.src = iconMap[condition] ?? "";
}

function updateWeatherDetails(data: WeatherApiResponse): void {
  qs<HTMLHeadingElement>(".city").textContent = data.name;
  qs<HTMLSpanElement>(".temp").textContent = `${Math.round(data.main.temp)}°C`;
  qs<HTMLSpanElement>(".humidity").textContent = `${data.main.humidity}%`;
  qs<HTMLSpanElement>(".wind").textContent = `${Math.round(data.wind.speed)} km/h`;
}

function showError(msg: string): void {
  errorElement.textContent   = msg;
  errorElement.style.display = "block";
  weatherElement.style.display = "none";
  card.style.display           = "none";
}

const days   = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"] as const;
const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sept","Oct","Nov","Dec"] as const;

setInterval(() => {
  const now = new Date();
  const hour12 = now.getHours() % 12 || 12;
  const mins   = now.getMinutes().toString().padStart(2,"0");
  const ampm   = now.getHours() >= 12 ? "PM" : "AM";

  timeEl.innerHTML = `${hour12}:${mins}<span id="am-pm">${ampm}</span>`;
  dateEl.textContent = `${days[now.getDay()]}, ${now.getDate()} ${months[now.getMonth()]}`;
}, 1_000);

getWeatherData();
function getWeatherData(): void {
  navigator.geolocation.getCurrentPosition(async ({ coords }) => {
    const { latitude, longitude } = coords;
    const res = await fetch(
      `https://api.openweathermap.org/data/3.0/onecall` +
      `?lat=${latitude}&lon=${longitude}&exclude=hourly,minutely` +
      `&units=metric&appid=e1c81757117c40089df71c8c3a5495d2`
    );
    showWeatherData(await res.json());
  });
}

function formatTime(unix: number): string {
  return new Date(unix * 1_000).toLocaleTimeString("en-US", {
    hour: "2-digit", minute: "2-digit", hour12: true,
  });
}

function showWeatherData(data: any): void {

  const { humidity, pressure, sunrise, sunset, wind_speed } = data.current;

  timezoneEl.textContent = data.timezone;
  countryEl.textContent  = `${data.lat} N ${data.lon} E`;

  currentWeatherEl.innerHTML = `
    <div class="weather-item"><div>Humidity</div><div>${humidity}%</div></div>
    <div class="weather-item"><div>Pressure</div><div>${pressure}</div></div>
    <div class="weather-item"><div>Wind Speed</div><div>${wind_speed} km/h</div></div>
    <div class="weather-item"><div>Sunrise</div><div>${formatTime(sunrise)}</div></div>
    <div class="weather-item"><div>Sunset</div><div>${formatTime(sunset)}</div></div>
  `;

  let forecastHtml = "";
  data.daily.forEach((day: any, idx: number) => {
    const tpl = `
      <div class="${idx === 0 ? "others" : "weather-forecast-item"}">
        <div class="day">${formatTime(day.dt)}</div>
        <img class="w-icon" src="http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" alt="icon">
        <div class="temp">Night ${day.temp.night}°C</div>
        <div class="temp">Day ${day.temp.day}°C</div>
      </div>
    `;
    idx === 0 ? (currentTempEl.innerHTML = tpl) : (forecastHtml += tpl);
  });

  forecastEl.innerHTML = forecastHtml;
}
