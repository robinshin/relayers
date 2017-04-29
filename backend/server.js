const express = require('express');
const bodyParser= require('body-parser')
const app = express();

app.set('port', (process.env.PORT || 5000));

app.use(bodyParser.urlencoded({extended: true}))

app.use(express.static('frontend'));

app.post('/users', (req, res) => {
    db.collection('users').save(req.body, (err, result) => {
        if (err) return console.log(err)
        console.log('saved to database')
        res.redirect('/')
    })
})


const MongoClient = require('mongodb').MongoClient
var db
MongoClient.connect(MONGODB_URI, (err, database) => {
    if (err) return console.log(err)
    db = database
    app.listen(app.get('port'), () => {
        console.log('Node app is running on port', app.get('port'));
    })
})
