const express = require('express');
const bodyParser= require('body-parser')
const app = express();

app.set('port', 80);

app.use(bodyParser.urlencoded({extended: true}))

app.use(express.static('/home/robin/relayers/frontend/public'));
app.use(express.static('/home/robin/relayers/frontend'));

app.post('/users', (req, res) => {
    db.collection('users').save(req.body, (err, result) => {
        if (err) return console.log(err)
        console.log('saved to database')
        res.redirect('/')
    })
})


const MongoClient = require('mongodb').MongoClient
var db
MongoClient.connect('mongodb://relayer:colislapepite@ds123331.mlab.com:23331/relayer-clients', (err, database) => {
    if (err) return console.log(err)
    db = database
    app.listen(app.get('port'), () => {
        console.log('Node app is running on port', app.get('port'));
    })
})
