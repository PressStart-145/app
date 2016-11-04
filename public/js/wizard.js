$("#openQuestsBtn").click(function(e) {
    $(this).addClass("selected");
    $("#currentQuestsBtn").removeClass("selected");
    $("#completedQuestsBtn").removeClass("selected");

    $(".todoTaskRow").removeClass("hidden");
    $(".doneTaskRow").addClass("hidden");
    $(".inProgressTaskList").addClass("hidden");
    //$("#ranks").show();
});

$("#currentQuestsBtn").click(function(e) {
    $(this).addClass("selected");
    $("#openQuestsBtn").removeClass("selected");
    $("#completedQuestsBtn").removeClass("selected");

    $(".inProgressTaskList").removeClass("hidden");
    $(".doneTaskRow").addClass("hidden");
    $(".todoTaskRow").addClass("hidden");
    //$("#ranks").show();
});

$("#completedQuestsBtn").click(function(e) {
    $(this).addClass("selected");
    $("#openQuestsBtn").removeClass("selected");
    $("#currentQuestsBtn").removeClass("selected");

    $(".doneTaskRow").removeClass("hidden");
    $(".inProgressTaskList").addClass("hidden");
    $(".todoTaskRow").addClass("hidden");
    //$("#ranks").show();
});
