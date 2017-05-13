const express = require('express');
const bodyParser = require('body-parser')
const app = express();
const bcrypt = require('bcrypt-nodejs');
var cookieParser = require('cookie-parser');

app.set('port', 8082);

app.use(bodyParser.urlencoded({extended: true}))

//// Authentification
// Database
var morgan = require('morgan'),
mongoose = require('mongoose'),
nev = require('email-verification')(mongoose);

app.use(morgan('dev'));

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI + '/users?authSource=admin');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

/*app.use( (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});*/


//// Nev configuration
var User = require("./models/user");

// Async version of hashing function
myHasher = (password, tempUserData, insertTempUser, callback) => {
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(password, salt, null, (err, hash) => {
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
}, (error, options) => {
  if (error)
  console.log(error);
});


nev.generateTempUserModel(User, (err, tempUserModel) => {
  if (err) {
    console.log(err);
    return;
  }
});


//// Passport
var passport = require('passport');
var session = require('express-session');
// Initialize passport for use
app.use(passport.initialize());
app.use(passport.session());

app.use(cookieParser(config.cookieSecret))


// Checks if user is authenticated
isAuthenticated = function(req,res,next){
   if(req.user)
      return next();
   else
      return res.status(401).json({
        error: 'User not authenticated'
      });
}

// Serialize / deserialize user
// used to serialize the user for the session
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});


// Passport configuration
var config = require('./config/database');
// Bring in defined Passport Strategy
require('./config/passport')(passport);


//// Routes
var jwt = require('jsonwebtoken');

////// Register route
app.post('/register', (req, res) => {
  var username = req.body.username,
  password = req.body.password,
  password_confirm = req.body.password_confirm,
  firstName = req.body.firstName,
  lastName = req.body.lastName,
  address = req.body.address,
  phoneNumber = req.body.phoneNumber;

  //// Form errors
  const regexMail = /^[a-zA-Z0-9._-]+@[a-z0-9._-]{2,}\.[a-z]{2,4}$/, // Checks if mail is valid
  regexPhone = /^(0|\+33)[1-9]([-. ]?[0-9]{2}){4}$/; // Checks if phone is valid
  if (!username || !password || !password_confirm || !firstName || !lastName || !address) {
    res.json({ reponse: 'error', msg: 'empty fields' });
  }
  else if (!regexMail.test(req.body.username)) {
    res.json({ reponse: 'error', msg: 'wrong username' });
  }
  else if (!regexPhone.test(req.body.phoneNumber)) {
    res.json({ reponse: 'error', msg: 'wrong phone number' });
  }
  else if (req.body.password !== req.body.password_confirm) {
    res.json({ reponse: 'error', msg: 'passwords mismatch' });
  }
  //// Here : no basic form error
  else {
    const newUser = User({
      username: username,
      password: password,
      profile: { firstName: firstName, lastName: lastName, address: address, phoneNumber: phoneNumber }
    });

    nev.createTempUser(newUser, (err, existingPersistentUser, newTempUser) => {
      if (err) {
        res.json({ reponse: 'error', msg: 'unknown' });
      }

      // User already exists in persistent collection...
      else if (existingPersistentUser) {
        res.json({ reponse: 'error', msg: 'already registered' });
      }

      // A new user
      else {
        if (newTempUser) {
          var URL = newTempUser[nev.options.URLFieldName];
          nev.sendVerificationEmail(username, URL, (err, info) => {
            if (err) {
              res.json({ reponse: 'error', msg: 'unknown' });
            }
            else {
              res.json({ reponse: 'success', msg: '' });
            }
          });
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

  nev.confirmTempUser(url, (err, user) => {
    if (user) {
      nev.sendConfirmationEmail(user.username, function(err, info) {
        if (err) {
          return res.redirect('https://relayers.fr/' + '?confirm=false');
        }
        res.redirect('https://relayers.fr/' + '?confirm=true');
      });
    }
    else {
      return res.redirect('https://relayers.fr/' + '?confirm=false');
    }
  });
});

app.post('/login', (req, res) => {
  User.findOne({
    username: req.body.username
  }, (err, user) => {
    if (err)
    throw err;
    if (!user) {
      res.send({reponse: 'error', msg: 'user not found'});
    }
    else {
      // check if password matches
      user.comparePassword(req.body.password, (err, isMatch) => {
        if (isMatch && !err) {
          // if user is found and password is right create a token
          var token = jwt.sign(user, config.secret, { expiresIn: 21600 });
          // return the information including token as JSON
          res.json({
            reponse: 'success',
            token: 'JWT ' + token,
            profile: user.profile,
            role: user.role
          });
        }
        else {
          res.send({reponse: 'error', msg: 'wrong password'});
        }
      });
    }
  });
});

app.post('/auth', passport.authenticate('jwt', { session: false }), (req, res) => {
  var token = getToken(req.headers);
  if (token) {
    jwt.verify(token, config.secret, function(err, decoded){
      if (err) {
        return res.json({reponse: 'error'});
      }
      else if (req.user.role != "Owner") {
        return res.json({reponse: 'error'});
      }
      else {
        res.json({reponse: 'success'});
      }
    });
  }
});

getToken = function (headers) {
  if (headers && headers.authorization) {
    var parted = headers.authorization.split(' ');
    if (parted.length === 2) {
      return parted[1];
    } else {
      return null;
    }
  } else {
    return null;
  }
};


app.get('/profile', isAuthenticated, (req, res) => {
  res.sendFile('/home/server/relayers/frontend/public/profile.html');
});

//// Port
app.listen(app.get('port'), () => {
  console.log('Register + login form app is running on port', app.get('port'));
})

module.exports = app;
