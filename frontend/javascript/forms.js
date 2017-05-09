// Highlights field
function highlight(field, error)
{
    if (error)
        field.style.borderColor = "red";
    else
        field.style.borderColor = "";
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

// Verifies that the field is correct (length not equals to zero)
function checkLength(field)
{
    if (field.value.length > 0)
    {
        highlight(field, false);
        return true;
    }
    else
    {
        highlight(field, true);
        return false;
    }
}

// Hides alert msg
$(function(){
    $("[data-hide]").on("click", function(){
        $("." + $(this).attr("data-hide")).hide();
    });
});
