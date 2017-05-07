const express = require('express');
const bodyParser= require('body-parser')
const app = express();
const  bcrypt = require('bcrypt-nodejs');

app.set('port', 8082);

app.use(bodyParser.urlencoded({extended: true}))

//// Authentification
// Database
var morgan   = require('morgan'),
    mongoose = require('mongoose'),
    nev = require('email-verification')(mongoose);
mongoose.Promise = global.Promise;

mongoose.connect(process.env.MONGODB_URI + '/users?authSource=admin');
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


//// Nev configuration
var User = require("./models/user");

// Async version of hashing function
myHasher = function(password, tempUserData, insertTempUser, callback) {
  bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash(password, salt, null, function(err, hash) {
      return insertTempUser(hash, tempUserData, callback);
    });
  });
};


nev.configure({
    verificationURL: 'https://relayers.fr/email-verification/${URL}',
    persistentUserModel: User,
    tempUserCollection: 'tempUser',
    emailFieldName: 'username',
    hashingFunction: myHasher,
    expirationTime: 172800,
    shouldSendConfirmation: false,

    transportOptions: {
        service: 'Gmail',
        auth: {
            user: 'do.not.reply.relayers@gmail.com',
            pass: 'ColisLaPepite'
        }
    },
    
    verifyMailOptions: {
        from: 'Relayers - Ne pas répondre <do.not.reply.relayers@gmail.com>',
        subject: 'Vérification de votre compte',
        html: 'Veuillez cliquer sur ce lien pour confirmer votre compte : </p><p>${URL}</p>',
        text: 'Veuillez cliquer sur ce lien pour confirmer votre compte : ${URL}'
    },

	confirmMailOptions: {
      from: 'Relayers - Ne pas répondre <do.not.reply.relayers@gmail.com>',
      subject: 'Confirmation d\'inscription',
      html: '<p>Votre compte a bien été vérifié.</p>',
      text: 'Votre compte a bien été vérifié.'
    }
}, function(error, options){
	if (error) console.log(error);
});


nev.generateTempUserModel(User, function(err, tempUserModel) {
    if (err) {
        console.log(err);
        return;
    }

    console.log('generated temp user model: ' + (typeof tempUserModel === 'function'));
});

// Passport
var passport = require('passport');

app.use(passport.initialize());


// Passport configuration
var config = require('./config/database');

//// Routes

require('./config/passport')(passport);
var jwt = require('jsonwebtoken');

app.post('/register', function(req, res) {
	// get the credentials from request parameters or something
    var username = req.body.username,
        password = req.body.password,
        password_confirm = req.body.password_confirm,
        firstName = req.body.firstName,
        secondName = req.body.secondName,
        address = req.body.address;

    //// Form errors
    var regex = /^[a-zA-Z0-9._-]+@[a-z0-9._-]{2,}\.[a-z]{2,4}$/; // Checks if mail is valid
    if (!username || !password || !password_confirm || !firstName || !secondName || !address) {
        res.json({ reponse: 'error', msg: 'empty fields' });
    }
    else if (!regex.test(req.body.username)) {
        res.json({ reponse: 'error', msg: 'wrong username' });
    }
    else if (req.body.password !== req.body.password_confirm) {
        res.json({ reponse: 'error', msg: 'passwords mismatch' });
    }
    else {
        // All ok
        var newUser = User({
            username: username,
            password: password,
            firstName: firstName,
            secondName: secondName,
            address: address
        });

        nev.createTempUser(newUser, function(err, existingPersistentUser, newTempUser) {
            // Some sort of error
            if (err) {
                res.json({ reponse: 'error', msg: 'unknown' });
            }

            // user already exists in persistent collection...
            else if (existingPersistentUser) {
                res.json({ reponse: 'error', msg: 'already registered' });
            }

            // a new user
            else {
                if (newTempUser) {
                    var URL = newTempUser[nev.options.URLFieldName];
                    nev.sendVerificationEmail(username, URL, function(err, info) {
                        if (err) {
                            res.end({ reponse: 'error', msg: 'unknown' });
                        }

                        res.json({ reponse: 'success', msg: '' });
                    });

                // user already exists in temporary collection...
                }
                else {
                    res.json({ reponse: 'error', msg: 'verif mail already sent' });
                }
            }
        });
    }
});

// User accesses the link that is sent
app.get('/email-verification/:URL', (req, res) => {
  var url = req.params.URL;

  nev.confirmTempUser(url, function(err, user) {
    if (user) {
      nev.sendConfirmationEmail(user.username, function(err, info) {
        if (err) {
          return res.status(404).send('ERROR: sending confirmation email FAILED');
        }
        res.json({
          msg: 'CONFIRMED!',
          info: info
        });
      });
    } else {
      return res.status(404).send('ERROR: confirming temp user FAILED');
    }
  });
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
    console.log('Register form app is running on port', app.get('port'));
})

module.exports = app;
