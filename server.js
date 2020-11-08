'use strict';

// Load dotenv
require('dotenv').config();

// dotenv variables
const NASA_API_KEY = process.env.NASA_API_KEY;
const DATABASE_URL = process.env.DATABASE_URL;
const PORT = process.env.PORT || 3000;

//  Dependencies
const methodOverride = require('method-override');
const superagent = require('superagent');
const express = require('express');
const cors = require('cors');
const pg = require('pg');
const app = express();

// Database Setup
const client = new pg.Client(DATABASE_URL);

// App setup
app.use(cors());
app.set('view engine', 'ejs');
app.use(methodOverride('_method'));
app.use(express.urlencoded({ extended: true }));

// Resources directory
app.use(express.static('public'));

// Listen
client.connect().then(() => {
  app.listen(PORT, () => console.log(`Listening on localhost: ${PORT}`));
}).catch(() => console.log(`Could not connect to database`));

// Routes
app.get('/', homepageFunction);
app.post('/details', detailsFunction);
app.use('*', errorFunction);

// Handlers
// home
function homepageFunction(request, response) {
  response.status(200).render('./pages/index.ejs');
}

// details
function detailsFunction(request, response) {
  console.log(request.body);
  const day = request.body.day.toString();
  const month = request.body.month.toString();
  const year = request.body.year.toString();
  const urlNasa = `https://api.nasa.gov/planetary/apod?date=${year}-${month}-${day}&api_key=${NASA_API_KEY}`;
  const urlFact = `http://numbersapi.com/${month}/${day}/date?json`;
  let nasaResp;
  let factResp;

  superagent(urlNasa).then((nasaData) => {
    nasaResp = nasaData.body;
    // console.log(nasaResp);
  }).then(() => {
    superagent(urlFact).then((factData) => {
      factResp = factData.body;
      // console.log(factResp);
    }).then(() => {
      let birthday = new Birthday(day, month, year, nasaResp, factResp);
      const responseObject = { birthday: birthday };
      response.status(200).render('./pages/details.ejs', responseObject);
    });
  }).catch(console.error);
}

// *
function errorFunction(request, response) {
  response.status(404).render('./pages/error.ejs');
}

// constructor
function Birthday(day, month, year, nasaResp, factResp) {
  this.birth_day = day;
  this.birth_month = month;
  this.birth_year = year;
  this.nasa_name = nasaResp.title;
  this.nasa_url = nasaResp.hdurl;
  this.fact_text = factResp.text;
  this.fact_year = factResp.year;
}
