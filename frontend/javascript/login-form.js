function checkLoginForm(form)
{
  var mail = form.login_username,
  password = form.login_password;

  var mailCorrect = checkMail(mail),
  passwordCorrect = checkLength(password);

  if (mailCorrect && passwordCorrect) {
    return true;
  }
  else if (!mailCorrect)
  {
    display_login_alert(false, 'wrong_username');
    return false;
  }
  else if (!passwordCorrect)
  {
    display_login_alert(false, 'wrong_password');
    return false;
  }
  else
  {
    display_login_alert(false, 'unknown');
    return false;
  }
}


//// Login form
$(function() {
  $('#login_btn').click(function() {
    $('#login-alert').css('display', 'none');
    if (!checkLoginForm($('#login-form')[0])) {
      return;
    }
    $.ajax({
      url : '/login',
      type : 'POST',
      dataType : 'json',
      data : {
        username : $('#login_username').val(),
        password : $('#login_password').val()
      },
      cache : false,
      timeout : 5000,

      success: function(data) {
        if (data.reponse == 'success') {
          $.ajax({
            url :"/auth",
            type:'POST',
            headers : { "Authorization" : data.token },
            dataType: 'html',
            data: {
              role: data.role
            },

            success: function(data) {
              if (data.reponse === 'success') {
                window.location.reload();
              }
              else {
                ////// Temporaire
                if (data.msg === 'not owner') {
                  display_login_alert(false, 'not_owner');
                }
                else {
                  display_login_alert(false, 'unknown');
              }
            }
          });
        }
        else {
          if (data.msg == 'user not found') {
            display_login_alert(false, 'user_not_found');
          }
          else if (data.msg == 'wrong password') {
            display_login_alert(false, 'wrong_password');
          }
          else {
            display_login_alert(false, 'unknown');
          }
          checkLoginForm($('#login-form')[0]);
        }
      },

      error: function() {
        display_login_alert(false, 'unknown');
      }
    });
  });
});

//// Login alert
function display_login_alert(success, msg_id) {
  if (success) {
    return ;
  }
  var msg;
  switch (msg_id) {
    case 'wrong_username':
    msg = '<strong>Veuillez vérifier votre nom d\'utilisateur</strong>';
    break;
    case 'user_not_found':
    msg = '<strong>Utilisateur inconnu</strong>';
    break;
    case 'wrong_password':
    msg = '<strong>Mot de passe incorrect</strong>';
    break;
    case 'not_owner':
    msg = 'Le service n\'est pas encore disponible';
    break;
    default:
    msg = '<strong>Erreur inconnue</strong>'
  }
  $('#text-login-alert').html(msg);
  $('#login-alert').css('display', 'block');
}
