const express = require('express');
const bodyParser= require('body-parser')
const app = express();

app.set('port', 8080);

app.use(bodyParser.urlencoded({extended: true}))

//// Protected page
app.use('/account.html', (req, res) => {
  res.redirect("https://relayers.fr/account");
})

app.use(express.static('/home/server/relayers/frontend/public'));
app.use(express.static('/home/server/relayers/frontend'));e

//// Port
app.listen(app.get('port'), () => {
  console.log('Node app is running on port', app.get('port'));
})

module.exports = app;
