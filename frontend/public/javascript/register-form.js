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
  lastName = form.lastName,
  mail = form.username,
  address = form.address,
  phoneNumber = form.phoneNumber,
  password = form.password,
  password_confirm = form.password_confirm;

  var firstNameCorrect = checkLength(firstName),
  lastNameCorrect = checkLength(lastName),
  mailCorrect = checkMail(mail),
  addressCorrect = checkLength(address),
  phoneCorrect = checkPhone(phoneNumber),
  passwordCorrect = checkEquals(password_confirm);

  if (firstNameCorrect && lastNameCorrect && mailCorrect && passwordCorrect) {
    return true;
  }
  else if (!firstNameCorrect)
  {
    display_register_alert(false, 'empty_fields');
    return false;
  }
  else if (!lastNameCorrect)
  {
    display_register_alert(false, 'empty_fields');
    return false;
  }
  else if (!addressCorrect)
  {
    display_register_alert(false, 'empty_fields');
    return false;
  }
  else if (!mailCorrect)
  {
    display_register_alert(false, 'wrong_username');
    return false;
  }
  else if (!phoneCorrect)
  {
    display_register_alert(false, 'wrong_phonenumber');
    return false;
  }
  else if (!passwordCorrect)
  {
    display_register_alert(false, 'passwords_mismatch');
    return false;
  }
  else
  {
    display_register_alert(false, 'unknown');
    return false;
  }
}


//// Register form
$(function() {
  $('#register_btn').click(function() {
    $('#register-alert').css('display', 'none');
    if (!checkRegisterForm($("#register-form")[0]))
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
        lastName : $('#lastName').val(),
        address : $('#autocomplete').val(),
        phoneNumber : $('#phoneNumber').val()
      },
      cache : false,
      timeout : 5000,

      success: function(data) {
        if (data.reponse == 'success') {
          display_register_alert(true, 'success');
          $("#register-form")[0].reset();
        }
        else {
          if (data.msg == 'empty fields') {
            display_register_alert(false, 'empty_fields');
          }
          else if (data.msg == 'wrong username') {
            display_register_alert(false, 'wrong_username');
          }
          else if (data.msg == 'wrong phone number') {
            display_register_alert(false, 'wrong_phonenumber');
          }
          else if (data.msg == 'passwords mismatch') {
            display_register_alert(false, 'passwords_mismatch');
          }
          else if (data.msg == 'already registered') {
            display_register_alert(false, 'already_registered');
          }
          else if (data.msg == 'verif mail already sent') {
            display_register_alert(false, 'verif_mail_already_sent');
          }
          else {
            display_register_alert(false, 'unknown');
          }
          checkRegisterForm($('#register-form')[0]);
        }
      },

      error: function() {
        display_register_alert(false, 'unknown');
      }
    });
  });
});

//// Register alert
function display_register_alert(success, msg_id) {
  if (success) {
    $('#register-alert').removeClass('alert-danger');
    $('#register-alert').addClass('alert-success');
  }
  else {
    $('#register-alert').removeClass('alert-success');
    $('#register-alert').addClass('alert-danger');
  }
  var msg;
  switch (msg_id) {
    case 'success':
    msg = '<strong>Inscription validée !</strong> Un mail de confirmation vous a été envoyé !'
    break;
    case 'empty_fields':
    msg = '<strong>Veuillez renseigner tous les champs</strong>';
    break;
    case 'wrong_username':
    msg = '<strong>Veuillez vérifier votre adresse mail</strong>';
    break;
    case 'wrong_phonenumber':
    msg = '<strong>Veuillez vérifier votre numéro de téléphone</strong>';
    break;
    case 'passwords_mismatch':
    msg = '<strong>Les mots de passe ne correspondent pas</strong>';
    break;
    case 'already_registered':
    msg = '<strong>Vous êtes déjà inscrit</strong>';
    break;
    case 'verif_mail_already_sent':
    msg = '<strong>Vous devez valider votre compte</strong>'
    break;
    default:
    msg = '<strong>Erreur inconnue</strong>'
  }
  $('#text-register-alert').html(msg);
  $('#register-alert').css('display', 'block');
}


//// Mail confirmation
$(function() {
  $('#mailConfirmationModal').click(function() {
    $('#mail-confirmedModal').removeClass('show');
    $('#mail-confirmedModal').addClass('hide');
  });
});
