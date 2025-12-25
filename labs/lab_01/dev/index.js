'use strict';

var path = require('path');
var http = require('http');
var cors = require('cors');
var fs = require('fs');
var oas3Tools = require('oas3-tools');
var { Validator, ValidationError } = require('express-json-validator-middleware');
var serverPort = 3001;
var passport = require('passport');
require('./passport-config');
var session = require('express-session');
var FilmManager = require('./components/FilmManager');
const { getFilmManager } = require('./controllers/Api');
const { getUsers } = require('./controllers/Apiusers');
const { authenticateUser } = require('./controllers/Apiusersauthenticator');
const { logoutUser } = require('./controllers/Apiusersauthenticatorcurrent');
const { getSingleUser } = require('./controllers/ApiusersuserId');
const { getPublicFilms } = require('./controllers/Apifilmspublic');
const { createFilm } = require('./controllers/Apifilms');
const { getPrivateFilms } = require('./controllers/Apifilmsprivate');
const { getSinglePrivateFilm, updateSinglePrivateFilm, deleteSinglePrivateFilm } = require('./controllers/ApifilmsprivatefilmId');
const { getSinglePublicFilm, updateSinglePublicFilm, deleteSinglePublicFilm } = require('./controllers/ApifilmspublicfilmId');
const { getInvitedFilms } = require('./controllers/Apifilmspublicinvited');
const filmManager = new FilmManager();

// Swagger configuration

var expressAppConfig = oas3Tools.expressAppConfig(path.join(__dirname, 'api/openapi.yaml'));
var app = expressAppConfig.getApp();

// Creating the session

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
}));
app.use(session({
    secret: "shhhhh... it's a secret!",
    resave: false,
    saveUninitialized: false,
}));
app.use(passport.authenticate('session'));

// Defining authentication verification middleware 

const isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    return res.status(401).json({ error: 'Not authorized' });
}

/*** JSON Validator Setup ***/
// TODO: Set up your JSON validator here
// You can use 'express-json-validator-middleware' (https://www.npmjs.com/package/express-json-validator-middleware),
// which is based on the 'ajv' module (https://www.npmjs.com/package/ajv).
var filmSchema = JSON.parse(fs.readFileSync(path.join('.', 'json_schemas', 'film_schema.json')).toString());
var userSchema = JSON.parse(fs.readFileSync(path.join('.', 'json_schemas', 'user_schema.json')).toString());
var reviewSchema = JSON.parse(fs.readFileSync(path.join('.', 'json_schemas', 'review_schema.json')).toString());
var validator = new Validator({ allErrors: true });
validator.ajv.addSchema([userSchema, filmSchema, reviewSchema]);
const addFormats = require('ajv-formats').default;
addFormats(validator.ajv);
var validate = validator.validate;

/*** Route Definitions ***/
// TODO: Define your API routes here
// Hint: Use app.get(), app.post(), app.put(), app.delete() to create your endpoints
// Hint: Protect routes that require authentication with your middleware (e.g., isLoggedIn)
// Hint: You can apply your validator to routes that expect JSON input
// Example:
// app.post('/api/films', isLoggedIn, validate({ body: filmSchema }), yourController.createFilm);
app.get(filmManager.api, getFilmManager);

// FILMS PUBLIC ENDPOINT
app.post(filmManager.films, isLoggedIn, validate({body: filmSchema}), createFilm);
app.get(filmManager.invitedPublicFilms, isLoggedIn, getInvitedFilms);
app.get(filmManager.privateFilms, isLoggedIn, getPrivateFilms);
app.get(filmManager.privateFilms + ":filmId", isLoggedIn, getSinglePrivateFilm);
app.put(filmManager.privateFilms + ":filmId", isLoggedIn, updateSinglePrivateFilm);
app.delete(filmManager.privateFilms + ":filmId", isLoggedIn, deleteSinglePrivateFilm);

app.get(filmManager.publicFilms, getPublicFilms);
app.get(filmManager.publicFilms + ":filmId", isLoggedIn, getSinglePublicFilm);
app.put(filmManager.publicFilms + ":filmId", isLoggedIn, updateSinglePublicFilm);
app.delete(filmManager.publicFilms + ":filmId", isLoggedIn, deleteSinglePublicFilm);

// USER ENDPOINT
app.get(filmManager.users, isLoggedIn, getUsers);
app.post(filmManager.usersAuthenticator, authenticateUser);
app.delete(filmManager.usersAuthenticator + "current", isLoggedIn, logoutUser);
app.get(filmManager.users + ":userId", isLoggedIn, getSingleUser);


// Initialize the Swagger middleware

http.createServer(app).listen(serverPort, function () {
    console.log('Your server is listening on port %d (http://localhost:%d)', serverPort, serverPort);
    console.log('Swagger-ui is available on http://localhost:%d/docs', serverPort);
});