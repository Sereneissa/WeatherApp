
// Setup empty JS object to act as endpoint for all routes
let projectData = {};


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
const port= 3000;

// Spin up the server
const server = app.listen(port,listening);

// Callback to debug 
const server = app.listen(port, listening);
 function listening(){
    // console.log(server);
    console.log(`running on localhost: ${port}`);
  };

// Initialize the main project folder
app.use(express.static('app'));

//GET request 

app.get('/all', sendData);

function sendData (request, response) {
  response.send(projectData);
};

add.post('/add',callBack);
function callBack(req,res){
    res.send('POST receieved')
}

// POST request
const projectData = [];

app.post('/addData', postData);
    function postData(request, response) {
      projectData = request.body;
      response.send({ message: "Post recieved"})
      console.log(request);
}
    
