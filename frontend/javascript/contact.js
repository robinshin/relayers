// Highlights field
function highlight(field, error)
{
    if (error)
        field.style.backgroundColor = "#fba";
    else
        field.style.backgroundColor = "";
}

// Verifies that the input mail is correct
function checkMail(field)
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
function checkMsg(field)
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

function checkForm(form)
{
    var mail = form.sender_mail;
    var msg = form.msg;
    var mailCorrect = checkMail(mail);
    var msgCorrect = checkMsg(msg);
    if (mailCorrect && msgCorrect)
        return true;
    else if (!mailCorrect)
    {
        highlight(mail, true);
        return false;
    }
    else if (!msgCorrect)
    {
        highlight(msg, true);
        return false;
    }
    else
    {
        return false;
    }
}


// JQuery
$(function() {
    $('#contact_btn').click(function() {
        if (!checkForm(document.getElementById("contact-form")))
            return;
        $.ajax({
            url : '/contact',
            type : 'POST',
            dataType : 'json',
            data : {
            sender_mail : $('#sender_mail').val(),
            msg : $('#msg').val(),
            reponse : "null"}, // On fait passer nos variables, exactement comme en GET, au script more_com.php  
            cache : false,
            timeout : 5000,
            complete : function() {
                console.log("Done");
            },

            success: function(data) {
                if (data.reponse == 'success') {
                    display_alert('success-alert');
                    document.getElementById("contact-form").reset();
                }
                else if (data.reponse == 'error_sender') {
                    display_alert('sender-error-alert');
                }
                else if (data.reponse == 'error_msg') {
                    display_alert('msg-error-alert');
                }
                else if (data.reponse == 'error') {
                    display_alert('error-alert');
                }
                else {
                    display_alert(undefined);
                }
            },
            error: function() {
                document.getElementById("success-alert").style.display = 'none';
                document.getElementById("error-alert").style.display = 'block';
            }
        });
    });
});

function display_alert(alertId) {
    document.getElementById("success-alert").style.display = 'none';
    document.getElementById("sender-error-alert").style.display = 'none';
    document.getElementById("msg-error-alert").style.display = 'none';
    document.getElementById("error-alert").style.display = 'none';
    if (alertId !== undefined)
        document.getElementById(alertId).style.display = 'block';
}

// Hides alert msg
$(function(){
    $("[data-hide]").on("click", function(){
        $("." + $(this).attr("data-hide")).hide();
    });
});
