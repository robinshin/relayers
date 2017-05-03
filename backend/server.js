const express = require('express');
const bodyParser= require('body-parser')
const app = express();

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
var db
MongoClient.connect('mongodb://127.0.0.1:27017/test', (err, database) => {
    if (err) return console.log(err)
    db = database
    console.log("successfully connected to the database");
    app.listen(app.get('port'), () => {
        console.log('Node app is running on port', app.get('port'));
    })
})
