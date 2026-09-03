// Initialization of variables
const input = document.querySelector(".search-city");
const searchBtn = document.querySelector(".search-btn");
const apiKey = "ca773f218b34e0fb832b3c84dd037899";
const temperature = document.querySelector(".temperature");
const humidity = document.querySelector(".humidity");
const wind = document.querySelector(".wind-speed");
const SunSet = document.querySelector(".sunset");
const weatherDescription = document.querySelector(".weather-descript");
const icons = document.querySelector(".weather-icon");
const actualLocation = document.querySelector(".location-name");
const errorDisplay = document.querySelector(".error-part");
const weatherInfo = document.querySelector(".weather-box");
const actualTime = document.querySelector(".actual-date");
const foreCard = document.querySelectorAll(".first-day");
const conditions = document.querySelector(".enviromental-condition");
let apiTemperature = 0;
let isCelsius = true

// Function to persist refreshing
const saveInformation = (city) => {
  if (city) localStorage.setItem("LastSearchCity", city);
};

// Change background image based on the time
function changeBackground(time) {
  if (time >= 6 && time < 12) {
    document.body.dataset.time = "morning";
  } else if (time >= 12 && time < 18) {
    document.body.dataset.time = "afternoon";
  } else if (time >= 18 && time < 23) {
    document.body.dataset.time = "evening";
  } else {
    document.body.dataset.time = "night";
  }
}

// Display information on weather risk based on humidity and temperature
function environmentalRange(temps, hums) {
  let title = "";
  let Effect = "";
  let Solution = "";
  if (temps > 35 && hums > 60) {
    title = "Very Hot & Sticky";
    Effect = "Painful muscle cramps, heat stroke, and tiredness";
    Solution = "Drink a lot of water and wet your skin with a damp towel";
  } else if (temps > 35 && hums < 30) {
    title = "Very Hot & Dry";
    Effect = "Fast dehydration, headaches, and fainting";
    Solution = "Drink water before you feel thirsty";
  } else if (temps > 26 && temps <= 34 && hums > 70) {
    title = "Warm & Sticky";
    Effect = "Hard to cool down";
    Solution = "Use fans and wear light clothes";
  } else if (temps >= 25 && temps <= 35 && hums > 30) {
    title = "Warm & Muggy";
    Effect = "Hard to breathe, can trigger bad asthma attacks and allergies";
    Solution = "Rest and do not work too hard (avoid running or sports)";
  } else if (temps >= 20 && temps <= 25 && hums >= 30 && hums <= 50) {
    title = "Perfect Comfort";
    Effect = "Best condition for the body";
    Solution = "Stay active (walk, exercise, and spend time outside)";
  } else if (temps >= 0 && temps < 10 && hums >= 80) {
    title = "Cold & Saturated";
    Effect = "Increased risk of indoor mold, damp bones, and heavy shivering";
    Solution = "Turn on indoor heating and use a dehumidifier";
  } else if (temps >= 10 && temps <= 19 && hums > 30) {
    title = "Cool & Damp";
    Effect = "Joint aches and allergies";
    Solution = "Keep warm and air out rooms briefly";
  } else if (temps >= 10 && temps <= 19 && hums < 30) {
    title = "Cool & Dry";
    Effect = "Dry skin and static shocks";
    Solution = "Moisturize your skin and drink water";
  } else if (temps < 0 && hums >= 80) {
    title = "Freezing & Wet";
    Effect = "Frostbite and hypothermia";
    Solution = "Wear many layers of warm clothes";
  } else if (temps < 0 && hums < 80) {
    title = "Freezing & Dry";
    Effect = "Chapped skin and increased illness risk";
    Solution = "Use lip balm and stay covered";
  } else {
    title = "Moderate Weather";
    Effect = "Normal weather conditions";
    Solution = "Dress appropriately for the temperature";
  }

  conditions.innerHTML = `
      <h6>${title}</h6>
      <p><strong>Effect: </strong>${Effect}</p>
      <p><strong>Solution: </strong>${Solution}</p>
    `;
}


    const TemperatureConversion = () => {
      if(isCelsius){
        temperature.textContent = `${Math.round(apiTemperature)} °C`
        
      }else{
        const toFahrenheit = ( apiTemperature* 1.8) + 32
        temperature.textContent = `${Math.round(toFahrenheit)} °F`
      }
    }

    temperature.addEventListener('click',() =>{
      isCelsius = !isCelsius
      TemperatureConversion()
    })

async function getWeatherInfo() {
  const city = input.value;
  if (city === "") {
    alert("ERROR: enter a name city to search");
    return;
  }

  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&lang=en&appid=${apiKey}`;
  const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`;

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

    console.log(response);
    saveInformation(response.name);

    //Displaying the sunset time
    const sunsetTime = response.sys.sunset * 1000;
    const sunsetDate = new Date(sunsetTime);
    const sunsetMoment = `${String(sunsetDate.getUTCHours()).padStart(2, "0")} : ${String(sunsetDate.getUTCMinutes()).padStart(2, "0")}`;
    console.log(sunsetMoment);

     apiTemperature = response.main.temp;
    temperature.textContent = `${Math.round(apiTemperature)} °C`

    TemperatureConversion()

    const apiHumidity = response.main.humidity;
    const apiWind = response.wind.speed;
    const apiDescription = response.weather[0].description;
    const apisunset = response.sys.sunset;
    const weatherIcon = response.weather[0].icon;

    // Display the icon found in the weather array
    icons.src = `https://openweathermap.org/img/wn/${weatherIcon}@2x.png`;
    icons.style.display = "block";
    
    wind.textContent = `${apiWind} m/s`;
    humidity.textContent = `${apiHumidity} %`;
    actualLocation.textContent = `${response.name} ${response.sys.country}`;
    SunSet.textContent = sunsetMoment;
    weatherDescription.textContent = apiDescription;

    weatherInfo.style.display = "block";
    errorDisplay.style.display = "none";

    const localTime = (response.dt + response.timezone) * 1000;
    const targetDate = new Date(localTime);

    function dateFormat(date = targetDate) {
      const days = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ];
      const month = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];

      // Display the information of the 5 next days
      const fiveDayForecast = foreResponse.list.filter((item) => {
        const midnight = item.dt_txt.includes("12:00:00");
        return midnight;
      });

      // Using the forEach method to display the result in a specific tag based on the index
      foreCard.forEach((card, index) => {
        const dayInfo = fiveDayForecast[index];
        if (dayInfo) {
          const forecastDate = (dayInfo.dt + foreResponse.city.timezone) * 1000;
          const targetForecastDate = new Date(forecastDate);
          const tempCelsius = Math.round(dayInfo.main.temp);
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
          card.style.display = "block";
        } else {
          card.style.display = "none";
        }
      });

      const day = date.getDate();
      const hour = String(date.getUTCHours()).padStart(2, "0");
      const minute = String(date.getUTCMinutes()).padStart(2, "0");
      return `${days[date.getDay()]} ${date.getDate()} ${month[date.getMonth()]} ${date.getFullYear()} ${hour}:${minute}`;
    }

    actualTime.textContent = dateFormat();
    const currentHour = targetDate.getUTCHours();

    changeBackground(currentHour);
    environmentalRange(apiTemperature, apiHumidity);

    const currentMinute = targetDate.getUTCMinutes();
    const currentDate = targetDate.getDate();
    const currentMonth = targetDate.getUTCMonth();
    const currentYear = targetDate.getFullYear();
  } catch (error) {
    console.log(error.message);
    alert(error.message);
    errorDisplay.style.display = "block";
    weatherInfo.style.display = "none";
  }
}

searchBtn.addEventListener("click", getWeatherInfo);
input.addEventListener("keypress", (e) => {
  if (e.key === "Enter") getWeatherInfo();
});

window.addEventListener("DOMContentLoaded", () => {
  const saveCity = localStorage.getItem("LastSearchCity");
  if (saveCity) {
    input.value = saveCity;
    getWeatherInfo();
  }
});
