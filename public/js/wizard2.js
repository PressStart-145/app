var afterPost = false;

$("#openQuestsBtn").click(function(e) {
    if(afterPost) {
        afterPost = false;
        location.reload();
    }
    else {
        $(this).addClass("selected");
        $("#personalQuestsBtn").removeClass("selected");
        $("#teamList").removeClass("hidden");
        $("#personalList").addClass("hidden");
    }
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

$("#personalList .currentTaskRow .btn").click(function(e) {
    e.preventDefault();
    //$(".confirm").show();
    //console.log($(this).parent());
    var index = $(this).parent()[0].id.split("#")[1];
    console.log(index);
    $($(this).parent()[0]).addClass("hidden");
    afterPost = true;

    var title = $(this).parent().children().eq(0).text();
    var level = $(this).parent().children().eq(1).text();

    var html = "<div class=\"row doneTaskRow\">";
    var html = html + "<div class=\"col-xs-7\">" + title + "</div>";
    var html = html + "<div class=\"col-xs-5\">" + level + "</div></div>";
    $("#personalList .doneList").append(html);
    var count = parseInt($("#compCount").text().split(" ")[1]);
    count++;
    if(count == 1) {
        $("#compCount").text( "Completed " + count + " Quest");
    } else {
        $("#compCount").text( "Completed " + count + " Quests");
    }

    //$("#taskTitle").text(txt); //txt.trim());
    //$.post(“/account/completeTask/abc”,{'taskTitle': txt},callbackFunction);
    $.post( "/account/completeTask", {'taskNum': parseInt(index)});
});

$(".completedQuestsBtn").click(function(e) {
    $(this).toggleClass("selected");
    if($(this).hasClass("selected")) {
        completedMsg = "Hide Completed Quests";
    } else {
        completedMsg = "Show Completed Quests";
    }
    $(this).text(completedMsg);

    console.log($(this).parent().next().html());
    $(this).parent().next().toggleClass("hidden");
    //$("#ranks").show();
});

$("#personalQuestsBtn").click(function(e) {
    $(this).addClass("selected");
    $("#openQuestsBtn").removeClass("selected");
    $("#teamList").addClass("hidden");
    $("#personalList").removeClass("hidden");
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
