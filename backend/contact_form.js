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
    user: 'do.not.reply.relayers@gmail.com',
    pass: 'ColisLaPepite'
  }
});

app.post('/contact', (req, res) => {
  var sender = req.body.sender_mail,
  msg    = req.body.msg,
  regex = /^[a-zA-Z0-9._-]+@[a-z0-9._-]{2,}\.[a-z]{2,4}$/; // Checks if mail is valid

  if ((typeof sender === 'undefined') || (sender === '') || (!regex.test(sender)))
  res.json({ reponse: 'error', msg: 'error_sender' });
  else if ((typeof msg === 'undefined') || (msg === ''))
  res.json({ reponse: 'error', msg: 'error_msg' });
  else {
    var mailOptions = {
      from: 'Formulaire de contact' + ' <'+ sender + '>',
      to: 'contact@relayers.fr',
      subject: ' Relayers - contact form from: ' + sender,
      text: msg
    };

    transporter.sendMail(mailOptions, function(err, response) {
      var iSvalid;
      if (err) {
        res.json({ reponse: 'error', msg: 'unknown' });
      }
      else {
        res.send({ reponse: 'success', msg: 'success' });
      }
    });
  };
});
