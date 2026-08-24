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
const body = document.body;

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

    // dipdiplay the icon found in the weather array
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

    // function changeBackground(time) {
    //   if (time >= 6 && time < 12) {
    //     body.style.backgroundImage = 'url("asset/image/morning.jpg")'
    //   } else if (time >= 12 && time < 18) {
    //     body.style.backgroundImage = 'url("asset/image/afternoon.jpg")'
    //   } else if (time >= 18 && time < 23) {
    //     body.style.backgroundImage = 'url("asset/image/evening.jpg")'
    //   } else {
    //     body.style.backgroundImage = 'url("asset/image/star.jpg")'
    //   }
    // }
    // changeBackground(currentHour)
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
    changeBackground(currentHour);

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
