const express = require('express');
const bodyParser= require('body-parser')
const app = express();

app.set('port', 80);

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


const MongoClient = require('mongodb').MongoClient
var db
MongoClient.connect('mongodb://relayer:colislapepite@ds123331.mlab.com:23331/relayer-clients', (err, database) => {
    if (err) return console.log(err)
    db = database
    app.listen(app.get('port'), () => {
        console.log('Node app is running on port', app.get('port'));
    })
})


// Contact form
nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: 'contact.relayers@gmail.com',
    pass: 'colislapepite'
  }
});

app.get('/contact', (req, res) => {
    res.redirect('/')
})

app.post('/contact', (req, res) => {
    var sender = req.body.sender_mail,
        msg    = req.body.msg;
    var mailOptions = {
        from: ' <'+ sender + '>',
        to: 'contact@relayers.fr',
        subject: ' Relayers - contact form from: ' + sender,
        text: msg
    };

    transporter.sendMail(mailOptions, function(err, response) {
        if (err) return console.log(err)
        res.redirect('/')
        response.redirect('/')
    });
});

