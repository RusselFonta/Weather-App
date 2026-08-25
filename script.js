// initialization of variable
const input = document.querySelector(".search-city");
const searchBtn = document.querySelector(".search-btn");
const Apikey = "ca773f218b34e0fb832b3c84dd037899";
const Tempeture = document.querySelector(".temperature");
const Humidity = document.querySelector(".humidity");
const wind = document.querySelector(".wind-speed");
const ultravoilet = document.querySelector(".uv-light");
const weather_description = document.querySelector(".weather-descript");
const Icons = document.querySelector(".weather_icon");
const actual_location = document.querySelector(".location-name");
const errorDisplay = document.querySelector(".error-part");
const weatherInfo = document.querySelector(".weather-box");
const actualTime = document.querySelector(".actual-date");
const foreCard = document.querySelectorAll(".first-day");
const conditions = document.querySelector(".enviromental-condition");
const body = document.body;


//change background image base on the time 
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
function enviromentalRange(Temps, Hums) {
  if (Temps > 35 && Hums > 60) {
    conditions.innerHTML = `
      <h6>Very Hot & Sticky</h6>
      <p><strong>Effect: </strong>Painful muscle cramps, heat stroke, and tiredness</p>
      <p><strong>Solution: </strong>Drink a lot of water and wet your skin with a damp towel</p>
    `;
  } else if (Temps > 35 && Hums < 30) {
    conditions.innerHTML = `
      <h6>Very Hot & Dry</h6>
      <p><strong>Effect: </strong>Fast dehydration, headaches, and fainting</p>
      <p><strong>Solution: </strong>Drink water before you feel thirsty</p>
    `;
  } else if (Temps > 26 && Temps <= 34 && Hums > 70) {
    conditions.innerHTML = `
      <h6>Warm & Sticky</h6>
      <p><strong>Effect: </strong>Hard to cool down</p>
      <p><strong>Solution: </strong>Use fans and wear light clothes</p>
    `;
  } else if (Temps >= 25 && Temps <= 35 && Hums > 30) {
    conditions.innerHTML = `
      <h6>Warm & Muggy</h6>
      <p><strong>Effect: </strong>Hard to breathe, can trigger bad asthma attacks and allergies</p>
      <p><strong>Solution: </strong>Rest and do not work too hard (avoid running or sports)</p>
    `;
  } else if (Temps >= 20 && Temps <= 25 && Hums >= 30 && Hums <= 50) {
    conditions.innerHTML = `
      <h6>Perfect Comfort</h6>
      <p><strong>Effect: </strong>Best condition for the body</p>
      <p><strong>Solution: </strong>Stay active (walk, exercise, and spend time outside)</p>
    `;
  } else if (Temps >= 10 && Temps <= 19 && Hums > 30) {
    conditions.innerHTML = `
      <h6>Cool & Damp</h6>
      <p><strong>Effect: </strong>Joint aches and allergies</p>
      <p><strong>Solution: </strong>Keep warm and air out rooms briefly</p>
    `;
  } else if (Temps >= 10 && Temps <= 19 && Hums < 30) {
    conditions.innerHTML = `
      <h6>Cool & Dry</h6>
      <p><strong>Effect: </strong>Dry skin and static shocks</p>
      <p><strong>Solution: </strong>Moisturize your skin and drink water</p>
    `;
  } else if (Temps < 0 && Hums >= 80) {
    conditions.innerHTML = `
      <h6>Freezing & Wet</h6>
      <p><strong>Effect: </strong>Frostbite and hypothermia</p>
      <p><strong>Solution: </strong>Wear many layers of warm clothes</p>
    `;
  } else if (Temps < 0 && Hums < 80) {
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


async function weather_info() {
  const city = input.value;
  if (city === "") {
    console.log("ERROR: Enter a city");
    return;
  }

  const apiurl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${Apikey}`;
  const forecast = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${Apikey}`;

  try {
    const data = await fetch(apiurl);
    const forecastdata = await fetch(forecast);

    //throw an error if an error occured during the status
    if (!data.ok || !forecastdata.ok) {
      throw new Error(`Response status: ${data.status}`);
    }

    // convertion of the raw data to a readable and exploitable form
    const response = await data.json();
    const foreresponse = await forecastdata.json();

    console.log(foreresponse);

    const apitemperature = response.main.temp;
    const apihumidity = response.main.humidity;
    const apiwind = response.wind.speed;
    const apidescription = response.weather[0].description;
    const weather_icon = response.weather[0].icon;

    // display the icon found in the weather array
    Icons.src = `https://openweathermap.org/img/wn/${weather_icon}@2x.png`;
    Icons.style.display = "block";

    const operate = Math.round(apitemperature - 273.15);
    console.log(apidescription);

    Tempeture.textContent = `${operate} °C`;
    wind.textContent = `${apiwind} m/s`;
    Humidity.textContent = `${apihumidity} %`;
    actual_location.textContent = response.name;
    weather_description.textContent = apidescription;

    weatherInfo.style.display = "block";
    errorDisplay.style.display = "none";

    const localTime = (response.dt + response.timezone) * 1000;
    const targetDate = new Date(localTime);

    // console.log(targetDate);
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

      //Display the information of the 5 next day
      const Today = new Date().toISOString();
      const Splitting = Today.split("T");
      console.log(
        `this is the date in ISO format ${Today}  splitted into ${Splitting}`,
      );
      const FiveDayForecast = foreresponse.list.filter((item) => {
        const Midnight = item.dt_txt.includes("12:00:00");
        return Midnight;
      });

      //using the foreach method to dipslay the result in a specific tag base on the index
      foreCard.forEach((card, index) => {
        const dayInfo = FiveDayForecast[index];
        console.log(dayInfo);
        if (dayInfo) {
          const forecastDate = (dayInfo.dt + foreresponse.city.timezone) * 1000;
          const targetecastDate = new Date(forecastDate);
          const tempCelsius = Math.round(dayInfo.main.temp - 273.15);
          const forecast_icon = dayInfo.weather[0].icon;
          const castHum = dayInfo.main.humidity;
          const desc = dayInfo.weather[0].description;

          card.innerHTML = `
      <h4>${days[targetecastDate.getDay()]}</h4>
      <p class = "forecast-weather-descript">${desc}</p>
      <img src="https://openweathermap.org/img/wn/${forecast_icon}@2x.png" alt="${desc}" title="${desc}">
      <p class="forecast-temp">${tempCelsius}°C</p>
      <p class ="forecast-hum">${castHum}%</p>
    `;
          card.style.display = "block";
        } else {
          card.style.display = "none";
        }
      });

      const day = date.getDate();
      const hour = String(date.getHours()).padStart(2, "0");
      const minute = String(date.getMinutes()).padStart(2, "0");
      return `${days[date.getDay()]} ${date.getDate()} ${month[date.getMonth()]}  ${date.getFullYear()}  ${hour}:${minute}`;
    }
    actualTime.textContent = dateFormat();
    const currentHour = targetDate.getUTCHours();

    changeBackground(currentHour);
    enviromentalRange(operate, apihumidity);

    const currentMinute = targetDate.getUTCMinutes();
    const currectDate = targetDate.getDate();
    const currentMonth = targetDate.getUTCMonth();
    const currentYear = targetDate.getFullYear();
    console.log(currentMinute);
    console.log(
      "this is the date",
      currectDate,
      currentMonth,
      currentYear,
      currentHour,
      currentMinute,
    );
  } catch (error) {
    // 5. Moved error UI updates BEFORE the throw statement
    console.error(error.message);
    errorDisplay.style.display = "block";
    weatherInfo.style.display = "none";
  }
}
searchBtn.addEventListener("click", weather_info);
input.addEventListener("keypress", (e) => {
  if (e.key === "Enter") weather_info();
});
