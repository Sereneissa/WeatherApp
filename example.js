/* Create a new date instance dynamically with JS
let d = new Date();
let newDate = d.getMonth()+'.'+ d.getDate()+'.'+ d.getFullYear();

const baseURL = 'https://api.openweathermap.org/data/2.5/weather?';
const weatherURL = 'https://api.openweathermap.org/data/2.5/forecast?q=';
const metric = '&units=metric';  
const apiKey = '&appid=f39afc0e7211a79d6b404b457dc3633a';
const submit = document.querySelector('#generate');
const humidity = document.querySelector('#humidity');
const feelsLike = document.querySelector('#feelslike');
const temperature = document.querySelector('#temp');
const city = document.querySelector('#city');;

//other definitions 

const weekdays = [`Sunday`,`Monday`,`Tuesday`,`Wednesday`,`Thursday`,`Friday`,`Saturday`];

const allMonths = ['January','February','March','April','May','June','July','August','September','October','November','December'];


let inputData = (apiData) => {
    const errorMessage = document.querySelector('#error-msg');
    errorMessage.innerHTML = '';
    humidity.innerHTML = `${apiData.main.humidity}%`;
    feelsLike.innerHTML = `${apiData.main.feels_like}°C`;
    temperature.innerHTML = `${Math.floor(apiData.main.temp)}°C`;
    city.innerHTML = `${apiData.name}, ${apiData.sys.country}`;  
}

// Pulls data from API 
const getLocation = async (url, location, units, key) => {   
    const errorMessage = document.querySelector('#error-msg');
    try {        
        const resp = await fetch(url+location+units+key);
        const data = await resp.json();
        if (data.cod === "404") {
            errorMessage.innerHTML = 'Please enter a valid zip code';
        } else {                  
            inputData(data);
            userCity = data.name;                  
            return data;
        }        
    }
    catch (error) {
        console.log('error', error);
        errorMessage.innerHTML = 'Enter a valid zip-code';
    }
}

// Promise function that gets users location from co-ords
const findLocation = () => {
    return new Promise(function(resolve, error) {
     window.addEventListener('load', function() {
           if(!navigator.geolocation) {
             findLocation.innerHTML = `Geolocation is not supported by your browser`; 
           } else {           
             navigator.geolocation.getCurrentPosition(success, error);
           }                   
     }); 
     function error() {
                
        }
     function success(position) {   
             lat = position.coords.latitude,
             long = position.coords.longitude,        
             latAndLong = `lat=${lat}&lon=${long}`;  
             resolve(`worked`);       
         }
    })
   
 };
 

// Envokes & Promise 
findLocation()
.then(function(val){  
   return getLocation(baseURL, metric, apiKey); 
})
.then (function(val) {
    return getweatherData(weatherURL, `${userCity}`, metric, apiKey);
})

.then(function(val) {
   return hideLoading(val); 
})

// Outputs user's feelings data
const getFeelings = () => {
    const feelingInput = document.querySelector('#feelings').value.toLowerCase();    
    if (feelingInput !== '') {        
         return feelingInput
    }            
}

// Function to POST data 
const postData = async ( url = '', data = {})=>{
    console.log(data)
      const response = await fetch(url, {
      method: 'POST',
      credentials: 'same-origin', // include, *same-origin, omit
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify(data), // body data type must match "Content-Type" header        
    });
  
      try {
        const newData = await response.json();
        // console.log(newData);
        return newData
      }catch(error) {
      console.log("error", error);
      // appropriately handle the error
      }
  }
  
  const postGet = () => {
    let feeling = getFeelings();       
    postData('/addData', {answer: feeling})
      .then(function(data){  
        retrieveData('/all')
      })
      update();
  }


  // Updates the page with the user input
const update = async () => {
    const request = await fetch('/all');
    try {
        const allData = await request.json();
        const feelingsOutput = document.querySelector('#content');
        if (allData.answer !== undefined) {
            feelingsOutput.innerHTML = `And you're feeling ${allData.answer}`;
        }        
    } catch(error) {
        console.log('error', error);
    }
 }


// Gets weather data from API
const getWeather = (e) => {
    e.preventDefault()
    const zipCodeInput = `zip=` + document.querySelector('#zip').value;

    getLocation(baseURL, zipCodeInput, metric, apiKey)
    .then(function(val) {        
        return getForecast(weatherURL, `${userCity}`, metric, apiKey);
    })
   
    postGet();
};

// Gets weather data from user zip code
submit.addEventListener('click', getWeather);



// Displays current date
let displayDate = () => {
    const date = document.querySelector('#date');         
    const currentDate = new Date(),
          dayOftheWeek = currentDate.getDay(),
          month = currentDate.getMonth(),
          dateDay= currentDate.getDate(),
          year = currentDate.getFullYear();

          date.innerHTML = `${weekdays[dayOftheWeek]}, ${allMonths[month]} ${dateDay} ${year}`; 
}
displayDate(); */