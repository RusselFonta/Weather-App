// initialization of varaible
const input = document.querySelector(".search-city");
const searchBtn = document.querySelector(".search-btn");
const Apikey = "ca773f218b34e0fb832b3c84dd037899";
const Tempeture = document.querySelector(".temperature");
const Humidity = document.querySelector(".humidity");
const wind = document.querySelector(".wind-speed");
const actual_location = document.querySelector(".location-name");
const body = document.body;

async function weather_info() {
  const city = input.value;
  if (city === "") {
    console.log("ERROR: Enter a city");
    return;
  }
  
  const apiurl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${Apikey}`;

  try {
    const data = await fetch(apiurl);
    const response = await data.json();
    console.log(data)

    const apitemperature = response.main.temp;
    const apihumidity = response.main.humidity;
    const apiwind = response.wind.speed;

    Tempeture.textContent = apitemperature.toFixed(2);
    wind.textContent = apiwind;
    Humidity.textContent = apihumidity;
    actual_location.textContent = city;
        
    if (response) {
      return response
    }
    throw new Error (`Response status: ${response.status}`);
    
  } catch (error) {
    console.error(error.message);
  }
}
searchBtn.addEventListener("click", weather_info);
