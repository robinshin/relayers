// Highlights field
function highlight(field, error)
{
    if (error)
        field.style.backgroundColor = "#fba";
    else
        field.style.backgroundColor = "";
}
// Verifies that the input mail is correct
function verifMail(field)
{
    var regex = /^[a-zA-Z0-9._-]+@[a-z0-9._-]{2,}\.[a-z]{2,4}$/;
    if(!regex.test(field.value))
    {
        highlight(field, true);
        return false;
    }
    else
    {
        highlight(field, false);
        return true;
    }
}

// Verifies that the message is correct (length not equals to zero)
function verifMsg(field)
{
    if (field.value.length > 0)
    {
        highlight(field, false);
        return true;
    }
    else
    {
        return false;
    }
}

function verifForm(form)
{
    var mail = form.sender_mail;
    var msg = form.msg;
    var mailCorrect = verifMail(mail);
    var msgCorrect = verifMsg(msg);
    if (mailCorrect && msgCorrect)
        return true;
    else if (!mailCorrect)
    {
        highlight(mail, true);
        alert("Veuillez rentrer une adresse e-mail correcte");
        return false;
    }
    else if (!msgCorrect)
    {
        highlight(msg, true);
        alert("Veuillez écrire un message");
        return false;
    }
    else
    {
        alert("Veuillez remplir correctement tous les champs");
        return false;
    }
}

app = express();
var bool = false;
app.get('/', (req, res) => {
    bool = req.query.valid;
})

var alert_msg = document.getElementById("alert_success");
if (bool == false) {
    alert_msg.setProperty("hidden")
else
    alert_msg.setProperty("visible")
