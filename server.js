
// Require Express to run server and routes
const express = require("express");

// Start up an instance of app
const app = express();

/* Middleware*/
//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Cors for cross origin allowance
const cors = require('cors');
app.use(cors());

// Setup Server
const port= 8000;

// Spin up the server
const server = app.listen(port,listening);

// Callback to debug 
function listening() {
    console.log("server running")
    console.log(`running on localhost: $(port)`);
}

// Initialize the main project folder
app.use(express.static('website'));

// Setup empty JS object to act as endpoint for all routes
let appData = {};

//GET request 

app.get("/all",function(request, response) {
    res.send(appData);
});

app.post('/add', function ( request ,response ) {
    response.send('POST received');
  });

// POST request
const data = [];
app.post('/addData', function (request, response) {
    data.push(request.body);
    appData["answer"]= request.body.answer;
    console.log(`this is body`);
    console.log(request.body);
    console.log(`this is appData`);
    console.log(appData);
    console.log(`this is data`);
    console.log(data);
})