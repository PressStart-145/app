var task = "";

$("#questList .btn").click(function(e) {
    e.preventDefault();
    $(".confirm").show();
    task = $(this).parent().children('.taskTitle').text().trim();
    $("#taskTitle").text(task);
});

$("#yesDone").click(function(e) {
    e.preventDefault();
    $(".confirm").hide();
    window.location = "/complete?task=" + task;
    return false;
});


$("#noDone").click(function(e) {
    e.preventDefault();
    $(".confirm").hide();
});

$("#currentQuestsBtn").click(function(e) {
    e.preventDefault();
    $("#questList").toggleClass("shrink");
    $("#doneList").toggleClass("shrink");
});

$("#completedQuestsBtn").click(function(e) {
    e.preventDefault();
    $("#questList").toggleClass("shrink");
    $("#doneList").toggleClass("shrink");
});
