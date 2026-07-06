// initialization of varaible
const input = document.querySelector(".search-city");
const searchBtn = document.querySelector(".search-btn");
const  apiurl = "https://openweathermap.org{city}&appid=${apiKey}&units=metric;"
const ApiKey = "ca773f218b34e0fb832b3c84dd037899";
const Tempeture = document.querySelector(".temperature");
const Humidity = document.querySelector(".humidity");
const wind = document.querySelector(".wind-speed");
const body = document.body

async function Weather_information() {
    const city = input.value.trim();
    if( city === ""){
        console.error("Please enter the name of a city");
    }
    try{
         const response = await fetch(apiurl);
        if(!response.ok){
            console.log("ERROR: An error was made when recieving request from the servwer")
        }
        const Apiresponse = await response.json();
        // Taking weather conditiion from the respond
        const apitempeture = Apiresponse.main.temp;
        const apihumidity = Apiresponse.main.humidity;
        const apiwind = Apiresponse.wind.speed;

        console.log( apitempeture)
        console.log( apihumidity)
        console.log( apiwind)
        console.log(city)


        // Calculating the time of a city 
        const local_time = (Apiresponse.dt + Apiresponse.timezone)* 1000 ;
        const targetDate = new Date(local_time);
        const currentHour = targetDate.getUTCHours;
// Function to change background image base on the time

// adding a line of code to handle background image change base on time
function changebackground(currentHour){
    if(currentHour == 6 && currentHour < 12 ){
        body.style.background = url("asset/image/morning (1).jpg");
    } else if(currentHour == 12 && currentHour < 18){
        body.style.background = url("asset/image/afternoon.jpg");
    }else if(currentHour == 18 && currentHour < 21){
         body.style.background = url("asset/image/evening (2).jpg");
    }else{
        body.style.background = url("asset/image/pexels-diva-23-2157852563-35333210.jpg");
    }
}
    }
    catch(error){
        console.log("ERROR")
    }
}
searchBtn.addEventListener('click' , Weather_information);
