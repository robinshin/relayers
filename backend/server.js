const express = require('express');
const bodyParser= require('body-parser')
const app = express();

app.set('port', 8080);

app.use(bodyParser.urlencoded({extended: true}))

//// Protected page
app.use('/profile.html', (req, res) => {
  res.redirect("https://relayers.fr/profile");
})

app.use(express.static('/home/server/relayers/frontend/public'));

//// Port
app.listen(app.get('port'), () => {
  console.log('Node app is running on port', app.get('port'));
})

module.exports = app;
