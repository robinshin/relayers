// Checks that two fields are equals
function checkEquals(field)
{
    var field_pwd = document.getElementById("password");
    if (!checkLength(field_pwd) || !checkLength(field)) {
        highlight(field, true);
        highlight(field_pwd, true);
        return false;
    }
    if (field.value === field_pwd.value)
    {
        highlight(field, false);
        highlight(field_pwd, false);
        return true;
    }
    else
    {
        highlight(field, true);
        highlight(field_pwd, true);
        return false;
    }
}

function checkRegisterForm(form)
{
    var firstName = form.firstName,
        secondName = form.secondName,
        mail = form.username,
        password = form.password,
        password_confirm = form.password_confirm;
    
    var firstNameCorrect = checkLength(firstName),
        secondNameCorrect = checkLength(secondName),
        mailCorrect = checkMail(mail),
        passwordCorrect = checkEquals(password_confirm);
    
    if (firstNameCorrect && secondNameCorrect && mailCorrect && passwordCorrect)
        return true;
    
    else if (!firstNameCorrect || !secondNameCorrect)
    {
        display_register_alert('register-empty-fields-error-alert');
        (firstNameCorrect)? highlight(secondName, true) : highlight(firstName, true);
        return false;
    }
    else if (!mailCorrect)
    {
        display_register_alert('register-mail-error-alert');
        highlight(mail, true);
        return false;
    }
    else if (!passwordCorrect)
    {
        display_register_alert('register-password-error-alert');
        highlight(password, true);
        highlight(password_confirm, true);
        return false;
    }
    else
    {
        return false;
    }
}

// JQuery
$(function() {
    $('#register_btn').click(function() {
        if (!checkRegisterForm(document.getElementById("register-form")))
            return;
        $.ajax({
            url : '/register',
            type : 'POST',
            dataType : 'json',
            data : {
               username : $('#username').val(),
               password : $('#password').val(),
               password_confirm : $('#password_confirm').val(),
               firstName : $('#firstName').val(),
               secondName : $('#secondName').val(),
               address : $('#address').val()
            },
            cache : false,
            timeout : 5000,
            complete : function() {
                console.log("Done");
            },

            success: function(data) {
                console.log(data);
            },
            error: function() {
            }
        });
    });
});

function display_register_alert(alertId) {
    document.getElementById("register-success-alert").style.display = 'none';
    document.getElementById("register-mail-error-alert").style.display = 'none';
    document.getElementById("register-password-error-alert").style.display = 'none';
    document.getElementById("register-already-registered-error-alert").style.display = 'none';
    document.getElementById("register-empty-fields-error-alert").style.display = 'none';
    
    if (alertId !== undefined)
        document.getElementById(alertId).style.display = 'block';
}
