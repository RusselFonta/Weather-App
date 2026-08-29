// Initialization of variables
const input = document.querySelector('.search-city');
const searchBtn = document.querySelector('.search-btn');
const apiKey = 'ca773f218b34e0fb832b3c84dd037899';
const temperature = document.querySelector('.temperature');
const humidity = document.querySelector('.humidity');
const wind = document.querySelector('.wind-speed');
const ultraviolet = document.querySelector('.uv-light');
const weatherDescription = document.querySelector('.weather-descript');
const icons = document.querySelector('.weather-icon');
const actualLocation = document.querySelector('.location-name');
const errorDisplay = document.querySelector('.error-part');
const weatherInfo = document.querySelector('.weather-box');
const actualTime = document.querySelector('.actual-date');
const foreCard = document.querySelectorAll('.first-day');
const conditions = document.querySelector('.enviromental-condition');

// Function to persist refreshing
const saveInformation = (city) => {
  if (city) localStorage.setItem('LastSearchCity', city);
};

// Change background image based on the time
function changeBackground(time) {
  if (time >= 6 && time < 12) {
    document.body.dataset.time = 'morning';
  } else if (time >= 12 && time < 18) {
    document.body.dataset.time = 'afternoon';
  } else if (time >= 18 && time < 23) {
    document.body.dataset.time = 'evening';
  } else {
    document.body.dataset.time = 'night';
  }
}

// Display information on weather risk based on humidity and temperature
function environmentalRange(temps, hums) {
  if (temps > 35 && hums > 60) {
    conditions.innerHTML = `
      <h6>Very Hot & Sticky</h6>
      <p><strong>Effect: </strong>Painful muscle cramps, heat stroke, and tiredness</p>
      <p><strong>Solution: </strong>Drink a lot of water and wet your skin with a damp towel</p>
    `;
  } else if (temps > 35 && hums < 30) {
    conditions.innerHTML = `
      <h6>Very Hot & Dry</h6>
      <p><strong>Effect: </strong>Fast dehydration, headaches, and fainting</p>
      <p><strong>Solution: </strong>Drink water before you feel thirsty</p>
    `;
  } else if (temps > 26 && temps <= 34 && hums > 70) {
    conditions.innerHTML = `
      <h6>Warm & Sticky</h6>
      <p><strong>Effect: </strong>Hard to cool down</p>
      <p><strong>Solution: </strong>Use fans and wear light clothes</p>
    `;
  } else if (temps >= 25 && temps <= 35 && hums > 30) {
    conditions.innerHTML = `
      <h6>Warm & Muggy</h6>
      <p><strong>Effect: </strong>Hard to breathe, can trigger bad asthma attacks and allergies</p>
      <p><strong>Solution: </strong>Rest and do not work too hard (avoid running or sports)</p>
    `;
  } else if (temps >= 20 && temps <= 25 && hums >= 30 && hums <= 50) {
    conditions.innerHTML = `
      <h6>Perfect Comfort</h6>
      <p><strong>Effect: </strong>Best condition for the body</p>
      <p><strong>Solution: </strong>Stay active (walk, exercise, and spend time outside)</p>
    `;
  } else if (temps >= 10 && temps <= 19 && hums > 30) {
    conditions.innerHTML = `
      <h6>Cool & Damp</h6>
      <p><strong>Effect: </strong>Joint aches and allergies</p>
      <p><strong>Solution: </strong>Keep warm and air out rooms briefly</p>
    `;
  } else if (temps >= 10 && temps <= 19 && hums < 30) {
    conditions.innerHTML = `
      <h6>Cool & Dry</h6>
      <p><strong>Effect: </strong>Dry skin and static shocks</p>
      <p><strong>Solution: </strong>Moisturize your skin and drink water</p>
    `;
  } else if (temps < 0 && hums >= 80) {
    conditions.innerHTML = `
      <h6>Freezing & Wet</h6>
      <p><strong>Effect: </strong>Frostbite and hypothermia</p>
      <p><strong>Solution: </strong>Wear many layers of warm clothes</p>
    `;
  } else if (temps < 0 && hums < 80) {
    conditions.innerHTML = `
      <h6>Freezing & Dry</h6>
      <p><strong>Effect: </strong>Chapped skin and increased illness risk</p>
      <p><strong>Solution: </strong>Use lip balm and stay covered</p>
    `;
  } else {
    conditions.innerHTML = `
      <h6>Moderate Weather</h6>
      <p><strong>Effect: </strong>Normal weather conditions</p>
      <p><strong>Solution: </strong>Dress appropriately for the temperature</p>
    `;
  }
}

async function getWeatherInfo() {
  const city = input.value;
  if (city === '') {
    console.log('ERROR: Enter a city');
    return;
  }

  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
  const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`;

  try {
    // Fetching both forecast and weather data simultaneously
    const [data, forecastData] = await Promise.all([
      fetch(apiUrl),
      fetch(forecastUrl),
    ]);

    // Throw an error if an error occurred during the status
    if (!data.ok || !forecastData.ok) {
      throw new Error(`Response status: ${data.status}`);
    }

    // Extracting the JSON form of both responses simultaneously
    const [response, foreResponse] = await Promise.all([
      data.json(),
      forecastData.json(),
    ]);

    saveInformation(response.name);

    console.log(foreResponse);

    const apiTemperature = response.main.temp;
    const apiHumidity = response.main.humidity;
    const apiWind = response.wind.speed;
    const apiDescription = response.weather[0].description;
    const weatherIcon = response.weather[0].icon;

    // Display the icon found in the weather array
    icons.src = `https://openweathermap.org/img/wn/${weatherIcon}@2x.png`;
    icons.style.display = 'block';

    const operate = Math.round(apiTemperature - 273.15);
    console.log(apiDescription);

    temperature.textContent = `${operate} °C`;
    wind.textContent = `${apiWind} m/s`;
    humidity.textContent = `${apiHumidity} %`;
    actualLocation.textContent = response.name;
    weatherDescription.textContent = apiDescription;

    weatherInfo.style.display = 'block';
    errorDisplay.style.display = 'none';

    const localTime = (response.dt + response.timezone) * 1000;
    const targetDate = new Date(localTime);

    function dateFormat(date = targetDate) {
      const days = [
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
      ];
      const month = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
      ];

      // Display the information of the 5 next days
      const today = new Date().toISOString();
      const splitting = today.split('T');
      console.log(
        `this is the date in ISO format ${today} splitted into ${splitting}`
      );
      const fiveDayForecast = foreResponse.list.filter((item) => {
        const midnight = item.dt_txt.includes('12:00:00');
        return midnight;
      });

      // Using the forEach method to display the result in a specific tag based on the index
      foreCard.forEach((card, index) => {
        const dayInfo = fiveDayForecast[index];
        console.log(dayInfo);
        if (dayInfo) {
          const forecastDate =
            (dayInfo.dt + foreResponse.city.timezone) * 1000;
          const targetForecastDate = new Date(forecastDate);
          const tempCelsius = Math.round(dayInfo.main.temp - 273.15);
          const forecastIcon = dayInfo.weather[0].icon;
          const castHum = dayInfo.main.humidity;
          const desc = dayInfo.weather[0].description;

          card.innerHTML = `
            <h4>${days[targetForecastDate.getDay()]}</h4>
            <p class='forecast-weather-descript'>${desc}</p>
            <img src='https://openweathermap.org/img/wn/${forecastIcon}@2x.png' alt='${desc}' title='${desc}'>
            <p class='forecast-temp'>${tempCelsius}°C</p>
            <p class='forecast-hum'>${castHum}%</p>
          `;
          card.style.display = 'block';
        } else {
          card.style.display = 'none';
        }
      });

      const day = date.getDate();
      const hour = String(date.getHours()).padStart(2, '0');
      const minute = String(date.getMinutes()).padStart(2, '0');
      return `${days[date.getDay()]} ${date.getDate()} ${month[date.getMonth()]} ${date.getFullYear()} ${hour}:${minute}`;
    }

    actualTime.textContent = dateFormat();
    const currentHour = targetDate.getUTCHours();

    changeBackground(currentHour);
    environmentalRange(operate, apiHumidity);

    const currentMinute = targetDate.getUTCMinutes();
    const currentDate = targetDate.getDate();
    const currentMonth = targetDate.getUTCMonth();
    const currentYear = targetDate.getFullYear();
    console.log(currentMinute);
    console.log(
      'this is the date',
      currentDate,
      currentMonth,
      currentYear,
      currentHour,
      currentMinute
    );
  } catch (error) {
    console.error(error.message);
    errorDisplay.style.display = 'block';
    weatherInfo.style.display = 'none';
  }
}

searchBtn.addEventListener('click', getWeatherInfo);
input.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') getWeatherInfo();
});

window.addEventListener('DOMContentLoaded', () => {
  const saveCity = localStorage.getItem('LastSearchCity');
  if (saveCity) {
    input.value = saveCity;
    getWeatherInfo();
  }
});