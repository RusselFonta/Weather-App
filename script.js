// initialization of varaible
const input = document.querySelector(".search-city");
const searchBtn = document.querySelector(".search-btn");
const Apikey = "ca773f218b34e0fb832b3c84dd037899";
const Tempeture = document.querySelector(".temperature");
const Humidity = document.querySelector(".humidity");
const wind = document.querySelector(".wind-speed");
const ultravoilet = document.querySelector(".uv-light")
const actual_location = document.querySelector(".location-name");
const errorDisplay = document.querySelector(".error-part")
const weatherInfo = document.querySelector(".weather-box")
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
    const apidescription = response.weather.main

    const operate = Math.round(apitemperature - 273.15); 
    console.log(apidescription)

    Tempeture.textContent = `${operate } °C`;
    wind.textContent = `${apiwind} m/s`;
    Humidity.textContent = `${apihumidity} %`;
    actual_location.textContent = city;
    ultravoilet.textContent = apidescription;

    // change of background image base on the time 
    //  1. calculation of time
    const localTime = (response.dt + response.timezone) * 1000 ;

    // 2. creation of calender
    const targetDate = new  Date(localTime);
    console.log(targetDate)

    const currentHour = targetDate.getUTCHours();

    // 3. function to change background image base on time
    function changeBackground(time){

      if(time >= 6 && time < 12){
        body.style.backgroundImage = 'url(asset/image/morning.jpg)';
      }else if( time >= 12 && time < 18){
        body.style.backgroundImage = 'url(asset/image/afternoon.jpg)'

      }else if(time >= 18 && time < 23 ){
         body.style.backgroundImage = 'url(asset/image/evening.jpg)'
      }else{
        body.style.backgroundImage = 'url(asset/image/star.jpg)'
      }
    }
    console.log(changeBackground(currentHour))
// ending of the function to change background image base on time

    const currentMinute = targetDate .getUTCMinutes()
    const currectDate = targetDate.getUTCDate();
    const currentMonth = targetDate.getUTCMonth();
    const currentYear = targetDate.getUTCFullYear();


    console.log( 'this is the date', currectDate , currentMonth, currentYear, currentHour,currentMinute);
    
        
    if (response.ok) {
      return response
    }
    throw new Error (`Response status: ${response.status}`);
    
  } catch (error) {
    throw error;
    errorDisplay.style.display = 'block';
    weatherInfo.style.display = 'none';



  }
}
searchBtn.addEventListener("click", weather_info);
