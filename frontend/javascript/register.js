// JQuery
$(function() {
    $('#register_btn').click(function() {
        $.ajax({
            url : '/register',
            type : 'POST',
            dataType : 'json',
            data : {
            username : $('#username').val(),
            password : $('#password').val()},
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
