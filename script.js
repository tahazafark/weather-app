// OpenWeatherMap API key and endpoint
const apiKey = 'cf2516d999f0c2df4723c0fa194d9798';
const apiEndpoint = 'https://api.openweathermap.org/data/2.5/weather';

// Elements
const cityInput = document.getElementById('city-input');
const searchBtn = document.getElementById('search-button');
const toggleBtn = document.getElementById('toggle-unit');
const errorMsg = document.getElementById('error-message');

let currentTempCelsius = null;
let isCelsius = true;

// Event Listeners
searchBtn.addEventListener('click', () => {
  const city = cityInput.value.trim();
  if (city) {
    getWeather(city);
  } else {
    alert('Please enter a city name.');
  }
});

toggleBtn.addEventListener('click', toggleTemperatureUnit);

// Fetch weather data
async function getWeather(city) {
  try {
    hideErrorMessage();
    const response = await fetch(`${apiEndpoint}?q=${city}&appid=${apiKey}&units=metric`);
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Unable to fetch weather data');
    }
    const data = await response.json();
    displayWeather(data);
  } catch (error) {
    errorMsg.textContent = `Error: ${error.message}`;
    errorMsg.classList.remove('d-none');
    console.error(error);
  }
}

// Display weather data
function displayWeather(data) {
  currentTempCelsius = data.main.temp;
  updateTemperature();

  const cityName = document.getElementById('city-name');
  const description = document.getElementById('description');
  const humidity = document.getElementById('humidity');
  const windSpeed = document.getElementById('wind-speed');
  const weatherIcon = document.getElementById('weather-icon');

  cityName.textContent = data.name;
  description.textContent = data.weather[0].description;
  humidity.textContent = `Humidity: ${data.main.humidity}%`;
  windSpeed.textContent = `Wind Speed: ${data.wind.speed} m/s`;
  weatherIcon.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}.png`;
  weatherIcon.alt = data.weather[0].description;
}

function updateTemperature() {
  const temp = document.getElementById('temp');
  if (isCelsius) {
    temp.textContent = `${currentTempCelsius}°C`;
  } else {
    const tempFahrenheit = (currentTempCelsius * 9) / 5 + 32;
    temp.textContent = `${tempFahrenheit.toFixed(1)}°F`;
  }
}

function toggleTemperatureUnit() {
  isCelsius = !isCelsius;
  updateTemperature();
}

function hideErrorMessage() {
  errorMsg.textContent = '';
  errorMsg.classList.add('d-none');
}
