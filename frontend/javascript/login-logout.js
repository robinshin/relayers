function readCookie(name) {
  var nameEQ = name + "=";
  var ca = document.cookie.split(';');
  for(var i=0;i < ca.length;i++) {
    var c = ca[i];
    while (c.charAt(0)==' ') c = c.substring(1,c.length);
    if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
  }
  return null;
}


//// JQuery
// Checks if user is logged in
$(function() {
  var token = readCookie('token');
  if (token) {
    $.ajax({
      url :"/check",
      type:'POST',
      headers : { "Authorization" : token },
      dataType: 'json',
      cache: false,
      timeout: 5000,

      success: function(data) {
        if (data.reponse === "success") {
          $('#profile').css('display', 'block');
          $('#login').css('display', 'none');
        }
        else {
          $('#profile').css('display', 'none');
          $('#login').css('display', 'none');
        }
      }
    });
  }
  else {
    $('#profile').css('display', 'none');
    $('#login').css('display', 'none');
  }
});
