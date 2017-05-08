const express = require('express');
const bodyParser= require('body-parser')
const app = express();

app.set('port', 8080);

app.use(bodyParser.urlencoded({extended: true}))

app.use(express.static('/home/server/relayers/frontend/public'));
app.use(express.static('/home/server/relayers/frontend'));

app.get('/:account_validate', (req, res) => {
    var account_validate = req.params.account_validate;
    if (account_validate === 'true')
        res.json({ reponse: 'account_validated' });
});

//// Port
app.listen(app.get('port'), () => {
    console.log('Node app is running on port', app.get('port'));
})

module.exports = app;

