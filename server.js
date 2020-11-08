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

// App setup
app.use(cors());
app.set('view engine', 'ejs');
app.use(methodOverride('_method'));
app.use(express.urlencoded({ extended: true }));

// Database Setup
const client = new pg.Client(DATABASE_URL);

// Resources directory
app.use(express.static('public'));
app.use(express.static('views'));

// Listen
client.connect().then(() => {
  app.listen(PORT, () => console.log(`Listening on localhost: ${PORT}`));
}).catch(() => console.log(`Could not connect to database`));

// Routes
app.get('/', homepageFunction);
app.post('/details', detailsFunction);
app.post('/save', saveFunction);
app.use('*', errorFunction);

// Handlers
// home
function homepageFunction(request, response) {
  response.status(200).render('./pages/index.ejs');
}

// details
function detailsFunction(request, response) {
  let nasaResp;
  let factResp;
  const day = request.body.day.toString();
  const month = request.body.month.toString();
  const yearNasa = yearCheck(request.body.year.toString());
  const year = request.body.year.toString();
  const urlNasa = `https://api.nasa.gov/planetary/apod?date=${yearNasa}-${month}-${day}&api_key=${NASA_API_KEY}`;
  const urlFact = `http://numbersapi.com/${month}/${day}/date?json`;

  let age =  getAge(year+'-'+month+'-'+day);
  let planet = request.body.planets;

  superagent(urlNasa).then((nasaData) => {
    nasaResp = nasaData.body;
  }).then(() => {
    superagent(urlFact).then((factData) => {
      factResp = factData.body;
    }).then(() => {
      let birthday = new Birthday(day, month, year, nasaResp, factResp);
      const responseObject = { birthday: birthday, age:age , planet:planet };
      response.status(200).render('./pages/details.ejs', responseObject);
    });
  }).catch(console.error);
}

// save
function saveFunction(request, response) {
  // console.log(request.body);
  const day = request.body.day.toString();
  const month = request.body.month.toString();
  const year = request.body.year.toString();
  const nasa = {title: request.body.title, hdurl: request.body.hdurl};
  const fact = {text: request.body.text, year: request.body.fact_year};

  const search = 'SELECT * FROM birthday WHERE birth_day=$1 AND birth_month=$2 AND birth_year=$3 AND nasa_name=$4 AND nasa_url=$5 AND fact_year=$6 AND fact_text=$7;';
  const insert = 'INSERT INTO birthday (birth_day, birth_month, birth_year, nasa_name, nasa_url, fact_year, fact_text) VALUES($1,$2,$3,$4,$5,$6,$7);';
  let newBirthday = [day, month, year, nasa.title, nasa.hdurl, fact.year, fact.text];
  // console.log(newBirthday);

  client.query(search, newBirthday).then(birthdayData => {
    if (birthdayData.rows === []) {
      console.log('Already in database');
      response.status(200).redirect('/');
    } else {
      client.query(insert, newBirthday).then(birthdayData => {
        console.log('Not existing in database');
        console.log(birthdayData);
      });
    }
  });
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

//helper
function getAge(date){
  let diff = new Date()-new Date(date);
  let age = Math.floor(diff/31557600000);
  return age;
}

function yearCheck(req){
  let year;
  if (Number(req) >= 1995){
    year = req;
  } else {
    year = '1995';
  }
  return year;
}
