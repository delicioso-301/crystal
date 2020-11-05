'use strict';

// Load dotenv
require('dotenv').config();

// dotenv variables
const ALBUM_API_KEY = process.env.ALBUM_API_KEY;
const CELEB_API_KEY = process.env.CELEB_API_KEY;
const MOVIE_API_KEY = process.env.MOVIE_API_KEY;
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
// client.connect().then(() => {
app.listen(PORT, () => console.log(`Listening on localhost: ${PORT}`));
//   }).catch(() => console.log(`Could not connect to database`));

// Routes
app.get('/', homepageFunction);
app.use('*', errorFunction);

// Handlers
// home
function homepageFunction(request, response) {
  response.status(200).render('./pages/index.ejs');

}

// *
function errorFunction(request, response) {
  response.status(404).render('./pages/error.ejs');
}