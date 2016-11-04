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

$(".todoTaskRow .btn").click(function(e) {
  e.preventDefault();
  var txt = $(this).parent()[0].children[0].textContent.trim();
  console.log(txt);


  $.post( "/wizard/acceptTask", {'taskName': txt, 'username': "user"},function(data){});
  location.reload();
});
