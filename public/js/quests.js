$("#questList .btn").click(function(e) {
    e.preventDefault();
    $(".confirm").show();
    console.log($(this).parent());
    var txt = $(this).parent()[0].children[0].textContent.trim();
    console.log(txt);

    $("#taskTitle").text(txt); //txt.trim());
});

$("#yesDone").click(function(e) {
    e.preventDefault();
    $(".confirm").hide();
});


$("#noDone").click(function(e) {
    e.preventDefault();
    $(".confirm").hide();
});
