const express = require('express');
const app = express();
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
})
