const express = require('express');
const bodyParser= require('body-parser')
const app = express();

var login = require('./register+login_form')

app.use(bodyParser.urlencoded({extended: true}))

//// Configure pug
app.set("view engine", "pug");
app.set("views", '/home/server/relayers/frontend/views');


//// Protected page
app.use('/profile.html', (req, res) => {
  res.redirect("https://relayers.fr/profile");
});

app.get('/', (req, res) => {
  if (login.checkAuthentication(req)) {
    res.render('index', { logged: true });
  }
  else {
    res.render('index', {logged: false});
  }

});

app.use(express.static('/home/server/relayers/frontend/public'));

//// Port
app.listen(app.get(8080), () => {
  console.log('Node app is running on port 8080');
})
