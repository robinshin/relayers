function checkContactForm(form)
{
    var mail = form.sender_mail;
    var msg = form.msg;
    var mailCorrect = checkMail(mail);
    var msgCorrect = checkLength(msg);
    if (mailCorrect && msgCorrect)
        return true;
    else if (!mailCorrect)
    {
        display_contact_alert('sender-error-alert');
        highlight(mail, true);
        return false;
    }
    else if (!msgCorrect)
    {
        display_contact_alert('msg-error-alert');
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
        if (!checkContactForm(document.getElementById("contact-form")))
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
                    display_contact_alert('success-alert');
                    document.getElementById("contact-form").reset();
                }
                else if (data.reponse == 'error_sender') {
                    display_contact_alert('sender-error-alert');
                }
                else if (data.reponse == 'error_msg') {
                    display_contact_alert('msg-error-alert');
                }
                else if (data.reponse == 'error') {
                    display_contact_alert('error-alert');
                }
                else {
                    display_contact_alert(undefined);
                }
            },
            error: function() {
                display_contact_alert('error-alert');
            }
        });
    });
});

function display_contact_alert(alertId) {
    document.getElementById("success-alert").style.display = 'none';
    document.getElementById("sender-error-alert").style.display = 'none';
    document.getElementById("msg-error-alert").style.display = 'none';
    document.getElementById("error-alert").style.display = 'none';
    if (alertId !== undefined)
        document.getElementById(alertId).style.display = 'block';
}
