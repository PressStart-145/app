$("#currentQuestsBtn").click(function(e) {
    $(this).toggleClass("active");
    $(".doneTaskRow").addClass("hidden");
    $(".currentTaskRow").removeClass("hidden");
    //$("#ranks").show();
});

$("#completedQuestsBtn").click(function(e) {
    $(this).toggleClass("active");
    $(".doneTaskRow").removeClass("hidden");
    $(".currentTaskRow").addClass("hidden");
    //$("#ranks").hide();
});
