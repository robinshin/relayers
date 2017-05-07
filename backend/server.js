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
mongoose.Promise = global.Promise;

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

app.use(passport.initialize());


// Passport configuration
var config = require('./config/database');

//// Routes

require('./config/passport')(passport);
var jwt = require('jsonwebtoken');
var User = require("./models/user");

app.post('/register', function(req, res) {
  var regex = /^[a-zA-Z0-9._-]+@[a-z0-9._-]{2,}\.[a-z]{2,4}$/; // Checks if mail is valid

  if (!req.body.username || !req.body.password || !req.body.password_confirm || !req.body.firstName || !req.body.secondName || !req.body.address) {
    res.json({success: false, msg: 'empty fields'});
  }
  else if (!regex.test(req.body.username)) {
    res.json({success: false, msg: 'wrong username'});
  }
  else if (req.body.password !== req.body.password_confirm) {
    res.json({success: false, msg: 'passwords mismatch'});
  }
  else {
    var newUser = new User({
      username: req.body.username,
      password: req.body.password,
      firstname: req.body.firstName,
      secondname: req.body.secondName,
      address: req.body.address
    });
    // save the user
    newUser.save(function(err) {
      if (err) {
        return res.json({success: false, msg: 'already registered'});
      }
      res.json({success: true, msg: 'success'});
    });
  }
});

app.post('/login', function(req, res) {
  User.findOne({
    username: req.body.username
  }, function(err, user) {
    if (err) throw err;

    if (!user) {
      res.send({success: false, msg: 'Authentication failed. User not found.'});
    } else {
      // check if password matches
      user.comparePassword(req.body.password, function (err, isMatch) {
        if (isMatch && !err) {
          // if user is found and password is right create a token
          var token = jwt.sign(user, config.secret);
          // return the information including token as JSON
          res.json({success: true, token: 'JWT ' + token});
        } else {
          res.send({success: false, msg: 'Authentication failed. Wrong password.'});
        }
      });
    }
  });
});

//// Port
app.listen(app.get('port'), () => {
    console.log('Node app is running on port', app.get('port'));
})

module.exports = app;

