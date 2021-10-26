


// Create a new date instance dynamically with JS
let d = new Date();
let newDate = d.getMonth()+'.'+ d.getDate()+'.'+ d.getFullYear();

const daysOfWeek = [
    `Sun`,
    `Mon`, 
    `Tue`,
    `Wed`,
    `Thu`,
    `Fri`,
    `Sat`    
];
const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec'
];


/* api calls */ 

let baseURL = 'https://api.openweathermap.org/data/2.5/weather?',
    foreCastURL = 'https://api.openweathermap.org/data/2.5/forecast?q=',
    metric = '&units=metric',     
    apiKey = '&appid=f39afc0e7211a79d6b404b457dc3633a',
    submitBtn = document.querySelector('#generate'),
    humidity = document.querySelector('#humidity'), 
    feelsLike = document.querySelector('#feelslike'),
    temperature = document.querySelector('#temp'),
    city = document.querySelector('#city');;

let userCity = ``,
    lat,
    long,
    latAndLong,
    forecastTemp = [],        
    forecastCondition= [],
    foreCastDay = [],
    foreCastDate = [],
    foreCastMonth = [];



const inputTheData = (apiData) => {
    const errorMsg = document.querySelector('#error-msg');
    errorMsg.innerHTML = '';
    humidity.innerHTML = `${apiData.main.humidity}%`;
    feelsLike.innerHTML = `${apiData.main.feels_like}°C`;
    temperature.innerHTML = `${Math.floor(apiData.main.temp)}°C`;
    city.innerHTML = `${apiData.name}, ${apiData.sys.country}`;  
}

// Pulls data from API 
const getLocation = async (url, location, units, key) => {   
    const errorMsg = document.querySelector('#error-msg');
    try {        
        const resp = await fetch(url+location+units+key);
        const data = await resp.json();
        if (data.cod === "404") {
            errorMsg.innerHTML = 'Please enter a valid zip code';
        } else {                  
            inputTheData(data);
            userCity = data.name;                  
            return data;
        }        
    }
    catch (error) {
        console.log('error', error);
        errorMsg.innerHTML = 'Please enter a valid zip code';
    }
}


// Get forecast temp and condition
const getForecast = async (url, location, units, key) => {
    try {
        const resp = await fetch(url+location+units+key);
        const data = await resp.json();
        // Resets all array data
        forecastTemp = [],        
        foreCastDay = [],
        foreCastDate = [],
        foreCastMonth = [];
    
         for (let i = 1; i < data.list.length; i++) {
            if (i % 7 === 0) {               
                const timeStamp = data.list[i].dt,
                      date = new Date(timeStamp * 1000),
                      day = date.getDay(),
                      dateNum = date.getDate(),   
                      month = date.getMonth();

                foreCastMonth.push(month);
                foreCastDate.push(dateNum);     
                foreCastDay.push(day);                    
                forecastTemp.push(Math.round(data.list[i].main.temp));                
            };
        };     

    }
    catch (error) {
        console.log('error', error);
    }
}; 



// Find co-ords
let findUserCords = () => {
   
}

// Promise function that gets users location from co-ords
const findUserLocation = () => {
    return new Promise(function(resolve, reject) {
     window.addEventListener('load', function() {
           if(!navigator.geolocation) {
             loadingScreen.innerHTML = `Geolocation is not supported by your browser`; 
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
 

// Envokes Promise, then hides loading screen
findUserLocation()
.then(function(val){  
   return getLocation(baseURL, latAndLong, metric, apiKey); 
})
.then (function(val) {
    return getForecast(foreCastURL, `${userCity}`, metric, apiKey);
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

/* Function to POST data */
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
      updateUI();
  }


  // Updates the page with the user input
const updateUI = async () => {
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
        return getForecast(foreCastURL, `${userCity}`, metric, apiKey);
    })
   
    postGet();
};

// Gets weather data from user zip code
submitBtn.addEventListener('click', getWeather);



// Displays current date
let displayDate = () => {
    const date = document.querySelector('#date');         
    const currentDate = new Date(),
          dayOfWeek = currentDate.getDay(),
          month = currentDate.getMonth(),
          dayNum = currentDate.getDate(),
          year = currentDate.getFullYear();

          date.innerHTML = `${daysOfWeek[dayOfWeek]}, ${months[month]} ${dayNum} ${year}`; 
}
displayDate();
