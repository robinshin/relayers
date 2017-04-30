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
var qs     = require('querystring'),
nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: 'contact.relayers@gmail.com',
    pass: 'colislapepite'
  }
});

app.post('/contact', (req, res) => {
    var body = '';
    req.on('data', function(data) {
        body += data;
    });

    req.on('end', function() {
        var mail = qs.parse(body);
        var mailOptions = {
            from: mail.name+' <'+ mail.sender + '>',
            to: 'contact@relayers.fr',
            subject: 'Contact ',
            text: mail.msg,
            html: mail.msg
        };

        transporter.sendMail(mailOptions, function(err, response) {
            !!err ? console.error(err) : res.end();
        });
    };
    res.end();
});

