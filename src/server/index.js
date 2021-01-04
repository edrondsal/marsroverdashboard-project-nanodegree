/*--------------------------------------------------------
Server code for Mars Rover Dashboard Project - Intermediate Javascript Nanodegree
version: 1.0.0
created on: 02/01/21
last modified:  02/01/21
Updates:
02/01/21    File Creation
author: E. RONDON
----------------------------------------------------------*/
var path = require('path')
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors');
const dotenv = require('dotenv');
const fetch = require('node-fetch');

const port = 3000;
const internalServerError = {
  success: false,
  code: 500,
  message: 'Internal Server Error'
};

// Start up an instance of app
const app = express();

//Configuration of express to use body-parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
//Configuration of express to use  Cors for cross origin allowance
app.use(cors());

/* Initializing the main project folder */
app.use(express.static('dist'));

// designates what port the app will listen to for incoming requests
const server = app.listen(port,listening);

//configuration environement variables
dotenv.config();

// set aylien API credentias
const API_KEY = process.env.API_KEY;



/**
 * @description Function working as the callback of the listen function used to create the server
 * @since      0.0.1
 * @access     private
*/
function listening(){
    console.log(`server running in localhost:${port}`);
}

//Configuration of GET route
app.get('/rovers',getRoversCallback)
app.get('/rovers/:id',getRoverCallback)
app.get('/rovers/:id/latestphotos',getRoverLatestPhotosCallback)
//app.get('/rovers/:id/photos')
//app.get('/manifests/:id',getManifestsCallback)


/**
 * @description Function working as the callback for getting the rovers array
 * @since   0.0.1
 * @access  private
 * @param   {Request}   request
 * @param   {Response}  response
 * @returns {Response}  response containing array of dinosaurs 
*/
function getRoversCallback(request, response) {
  fetch(`https://api.nasa.gov/mars-photos/api/v1/rovers?api_key=${API_KEY}`)
  .then(res => res.json())
  .then(json => response.send({success:true, rovers: json.rovers.map(rover => Object.assign({}, rover,{photos: []}) )}))
  .catch( () => response.send(internalServerError));
}

/**
 * @description Function working as the callback for getting a specifc rover
 * @since   0.0.1
 * @access  private
 * @param   {Request}   request
 * @param   {Response}  response
 * @returns {Response}  response containing array of dinosaurs 
*/
function getRoverCallback(request, response) {
  const roverName = request.params.id;
  fetch(`https://api.nasa.gov/mars-photos/api/v1/rovers/${roverName}?api_key=${API_KEY}`)
  .then(res => res.json())
  .then(json => response.send({success:true, rover: json}))
  .catch( () => response.send(internalServerError));
}

/**
 * @description Function working as the callback for getting the latest photos array for a specifc rover
 * @since   0.0.1
 * @access  private
 * @param   {Request}   request
 * @param   {Response}  response
 * @returns {Response}  response containing array of dinosaurs 
*/
function getRoverLatestPhotosCallback(request, response) {
  const roverName = request.params.id;
  const date = request.query.earth_date;
  fetch(`https://api.nasa.gov/mars-photos/api/v1/rovers/${roverName}/photos?earth_date=${date}&api_key=${API_KEY}`)
  .then(res => res.json())
  .then(json => response.send({success:true, photos: json.photos.map(item => {return {img_src: item.img_src, sol:item.sol, earth_date:item.earth_date, camera:item.camera.id} } )}))
  .catch( () => response.send(internalServerError));
}
