const express = require('express');
const bodyParser= require('body-parser')
const app = express();

app.set('port', 8080);

app.set("view engine", "pug");
app.set("views", '/home/server/relayers/frontend/views');

app.use(bodyParser.urlencoded({extended: true}))

//// Protected page
app.use('/profile.html', (req, res) => {
  res.redirect("https://relayers.fr/profile");
})

app.get('/', (req, res) => {
  res.render("index");
});

app.use(express.static('/home/server/relayers/frontend/public'));

//// Port
app.listen(app.get('port'), () => {
  console.log('Node app is running on port', app.get('port'));
})

module.exports = app;
