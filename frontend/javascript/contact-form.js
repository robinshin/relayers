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
        display_contact_alert(false, 'error_sender');
        return false;
    }
    else if (!msgCorrect)
    {
        display_contact_alert(false, 'error_msg');
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
        if (!checkContactForm($("#contact-form")[0]))
            return;
        $.ajax({
            url : '/contact',
            type : 'POST',
            dataType : 'json',
            data : {
            sender_mail : $('#sender_mail').val(),
            msg : $('#msg').val(),
            reponse : "null"},
            cache : false,
            timeout : 5000,
            complete : function() {
                console.log("Done");
            },

            success: function(data) {
                if (data.reponse == 'success') {
                    display_contact_alert(true, 'success');
                    $("#contact-form")[0].reset();
                }
                else {
                    if (data.msg == 'error_sender') {
                        display_contact_alert(false, 'error_sender');
                    }
                    else if (data.msg == 'error_msg') {
                        display_contact_alert(false, 'error_msg');
                    }
                    else {
                        display_contact_alert(false, 'unknown');
                    }
                }
            },
            error: function() {
                display_contact_alert(false, 'unknown');
            }
        });
    });
});

function display_contact_alert(success, msg_id) {
    if (success) {
        $('#contact-alert').removeClass('alert-danger');
        $('#contact-alert').addClass('alert-success');
    }
    else {
        $('#contact-alert').removeClass('alert-success');
        $('#contact-alert').addClass('alert-danger');
    }
    var msg;
    switch (msg_id) {
        case 'success':
            msg = '<strong>Votre message a bien été envoyé !</strong> Nous vous recontacterons au plus vite :)'
            break;
        case 'error_sender':
            msg = '<strong>Veuillez vérifier votre adresse mail</strong>';
            break;
        case 'error_msg':
            msg = '<strong>Veuillez écrire un message</strong>';
            break;
        default:
            msg = '<strong>Erreur inconnue</strong>'
    }
    $('#text-contact-alert').html(msg);
    $('#contact-alert').css('display', 'block');
}
