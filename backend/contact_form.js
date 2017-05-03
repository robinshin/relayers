const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.set('port', 8081);
app.use(bodyParser.urlencoded({extended: true}))

app.listen(app.get('port'), () => {
  console.log('Contact form app is running on port', app.get('port'));
})

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
        var iSvalid;
        if (err) {
            res.send({ reponse: 'fail' });
        }
        else {
            res.send({ reponse: 'success' });
        }
    });
});
