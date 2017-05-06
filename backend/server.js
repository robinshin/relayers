const express = require('express');
const bodyParser= require('body-parser')
const app = express();
const mongoose = require('mongoose');

app.set('port', 8080);

app.use(bodyParser.urlencoded({extended: true}))

app.use(express.static('/home/server/relayers/frontend/public'));
app.use(express.static('/home/server/relayers/frontend'));

app.post('/users', (req, res) => {
    db.collection('users').save(req.body, (err, result) => {
        if (err) return console.log(err)
        console.log('saved to database')
        res.redirect('/')
    })
})


const MongoClient = require('mongodb').MongoClient, format = require('util').format;
mongoose.connect(process.env.MONGODB_URI + '/users?authSource=admin');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', function() {
  // we're connected!
  console.log('Connected to the database');
});


app.listen(app.get('port'), () => {
    console.log('Node app is running on port', app.get('port'));
})

