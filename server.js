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
app.get('/', getFromDatabase);
app.post('/details', detailsFunction);
app.post('/save', saveFunction);
app.post('/selection', selectFunction);
app.put('/selection/:id',updatedata);
app.get('/selection/:id',showUpdatedData);
app.delete('/selection/:id',deleteData);


// Handlers
// home
// function homepageFunction(request, response) {
//   response.status(200).render('./pages/index.ejs',);
// }
function getFromDatabase(req, res) {
  let sql = `select * from birthday;`;
  client.query(sql).then((data) => {
    //console.log(data.rows);
    res.render('./pages/index.ejs', {
      birthDayInfo: data.rows
    });
  });
}

function updatedata(req,res){
  const id = req.params.id;
  //console.log(req.body);
  let {fact_text, nasa_name, nasa_url} = req.body;
  let sql = `UPDATE birthday SET fact_text=$1,nasa_name=$2,nasa_url=$3 WHERE ID =$4 RETURNING *;`;
  let safeValues = [fact_text,nasa_name,nasa_url, id];
  client.query(sql, safeValues).then((data) => {
    //console.log(data.rows);
    res.redirect(`/selection/${data.rows[0].id}`);
  });
}
function showUpdatedData(req,res){
  let sql = `select * from birthday where id=$1;`;
  let safeValues = [req.params.id];
  client.query(sql, safeValues).then(data => {
    //console.log(data.rows[0]);
    res.render('./pages/selection.ejs', {
      data: data.rows[0]
    });
  });
}
function deleteData(req,res){
  const id = req.params.id;
  const sql = 'DELETE FROM birthday WHERE id=$1';
  client.query(sql, [id]).then(()=>{
    res.redirect('/');
  });
}

//selection
function selectFunction(req, res) {
  let data = req.body;
  console.log(data);

  res.render('./pages/selection.ejs', {
    data:data
  });
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

//save
function saveFunction(request, response) {
  const day = request.body.day.toString();
  const month = request.body.month.toString();
  const year = request.body.year.toString();
  const nasa = {title: request.body.title, hdurl: request.body.hdurl};
  const fact = {text: request.body.text, year: request.body.fact_year};
  const search = 'SELECT * FROM birthday WHERE birth_day=$1 AND birth_month=$2 AND birth_year=$3 ;';

  const safevalues = [day, month, year];
  client.query(search, safevalues).then(results => {
    if (!(results.rowCount === 0)) {
      //console.log('from data base');
      response.status(200).redirect('/');
    } else {
      const urlNasa = `https://api.nasa.gov/planetary/apod?date=${year}-${month}-${day}&api_key=${NASA_API_KEY}`;
      superagent(urlNasa).then(() => {
        //console.log('from api');
        //console.log(nasaData.body);
        new Birthday(day, month, year, nasa, fact);
        const insert = 'INSERT INTO birthday (birth_day, birth_month, birth_year, nasa_name, nasa_url, fact_year, fact_text) VALUES($1,$2,$3,$4,$5,$6,$7);';
        let newBirthday = [day, month, year, nasa.title, nasa.hdurl, fact.year, fact.text];
        client.query(insert, newBirthday).then(() => {
          response.status(200).redirect('/');
        });
      });
    }
  });
}

app.post('/result', (request, response) => {
  //console.log(request.body);
  const results = request.body;
  response.redirect('/details', {
    age: results.age,
    planet: results.planets
  });

});
app.use('*', errorFunction);

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

