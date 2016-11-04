$("#currentQuestsBtn").click(function(e) {
    $(this).addClass("selected");
    $("#completedQuestsBtn").removeClass("selected");
    $(".doneTaskRow").addClass("hidden");
    $(".currentTaskRow").removeClass("hidden");
    //$("#ranks").show();
});

$("#completedQuestsBtn").click(function(e) {
    $(this).addClass("selected");
    $("#currentQuestsBtn").removeClass("selected");
    $(".doneTaskRow").removeClass("hidden");
    $(".currentTaskRow").addClass("hidden");
    //$("#ranks").hide();
});
