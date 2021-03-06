// Display current date, time & location (est vs pst etc)
const d = new Date();
document.getElementById("date").innerHTML = d;

//global variables
let baseURL ='https://api.openweathermap.org/data/2.5/weather?';
let apiKey =  '&appid=f39afc0e7211a79d6b404b457dc3633a';
const metric = '&units=metric';  

//get selectors 
const submit = document.querySelector('#generate');
const hum = document.querySelector('#humidity');
const feelslike = document.querySelector('#feelslike');
const temp = document.querySelector('#temp');
const place = document.querySelector('#city'); 


document.getElementById('generate').addEventListener('click', performAction);

function performAction(e){
  const zipCodeInput = document.getElementById('zip').value;
  getForecastData(baseURL,zipCodeInput,apiKey)

}

// get weather api data 
const getForecastData = async (baseURL,zipCodeInput,apiKey) => {
  const res = await fetch(baseURL+zipCodeInput+apiKey)
  try{
    const data = await res.json();
    console.log(data)
    return data; 
  } catch(error) {
    console.log("errormsg",error);
  }
}


// Post request in async format - received from udacity course 
const postData = async ( url = '', data = {})=>{
  console.log(data);
    const response = await fetch(url, {
    method: 'POST', 
    credentials: 'same-origin',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(data), 
  });

    try {
      const newData = await response.json();
      console.log(newData);
      return newData;
    }catch(error) {
    console.log("error", error);
    }

}

//interact with the forecast data to show weather data 
let weatherData = (data) => {
  const errorMsg = document.querySelector('#errormsg');
      errorMsg.innerHTML = '';
  place.innerHTML = `${data.city}`;
  hum.innerHTML = `${data.humidity} %`;
  temp.innerHTML = `${Math.floor(temp)} °C`;
  feelslike.innerHTML = `${data.feelslike}°C`;
}


//Implement error message 
const getForecastError = async(url, location, key,) => {
  const errorMsg = doducment.querySelector('#errormsg');
  try {
    const response = await fetch(url+location+key);
    const data = await response.json();
    if (data.cod === "404") {
      errorMsg.innerHTML = 'Enter a valid zip code';
  } else {                  
      weatherData(data);
      usersLocation = data.name;                  
      return data;
    }        
  }
    catch (error) {
      console.log('error', error);
      errorMessage.innerHTML = 'Enter a valid zip-code';
  }

}

//Update User UI 
const updateUI = async () => {
  const request = await fetch('/allData');
  try{
    const allData = await request.json();
    document.getElementById('humidity').innerHTML = allData[0].hum;
    document.getElementById('city').innerHTML = allData[0].place;
    document.getElementById('temp').innerHTML = allData[0].temp;
    document.getElementById('feelslike').innerHTML = allData[0].feelslike; 
    document.getElementById('feelings').innerHTML = allData[0].feelings;
    document.getElementById('zip').innerHTML = allData[0].zip;

  }catch(error){
    console.log("error", error);

    updateUI();
  }
}

// Find users location & asks permission to locate 
const locationFinder = new Promise(function(resolve, error) {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(getLocation);
  }
  else {
    locationFinder.innerHTML = error("");

  }
  function getLocation(position) {
      locationFinder.innerHTML= "Latitude: " + position.coords.latitude +
      "<br>Longitude: " + position.coords.longitude;
      resolve(`worked`);   
  }
});  