const express = require('express');
const bodyParser= require('body-parser')
const app = express();

app.set('port', 8080);

app.use(bodyParser.urlencoded({extended: true}))

app.use(express.static('/home/server/relayers/frontend/public'));
app.use(express.static('/home/server/relayers/frontend'));


//// Authentification
// Database
var morgan = require('morgan');
var mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI + '/auth?authSource=admin');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log('Successfully connected to database');
});

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// Passport
var passport = require('passport');
var api = require('./routes/api');

app.use(passport.initialize());

app.use('/api', api);

// Passport configuration
var config = require('./config/database');


//// Port
app.listen(app.get('port'), () => {
    console.log('Node app is running on port', app.get('port'));
})

module.exports = app;
