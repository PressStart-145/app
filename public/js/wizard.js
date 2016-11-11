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

$(".showDesc").click(function(e) {
    $(this).closest(".row").next().slideToggle();
});

$(".todoTaskRow .btn").click(function(e) {
  e.preventDefault();
  console.log($(this).prev().children()[0].id);
  //var txt = $(this).prev().children()[0].children()[0].textContent.trim();
  //console.log(txt);

  var index = $(this).prev().children()[0].id.split("#")[1];
  console.log(index);

  $.post( "/wizard/acceptTask", {'taskNum': parseInt(index), 'username': "user"},function(data){});
  location.reload();
});
