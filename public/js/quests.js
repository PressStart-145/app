$("#questList .btn").click(function(e) {
    e.preventDefault();
    $(".confirm").show();
    $("#taskTitle").text($(this).parent().text().trim());
});

$("#yesDone").click(function(e) {
    e.preventDefault();
    $(".confirm").hide();
});


$("#noDone").click(function(e) {
    e.preventDefault();
    $(".confirm").hide();
});
