$("#questList .currentTaskRow .btn").click(function(e) {
    e.preventDefault();
    //$(".confirm").show();
    //console.log($(this).parent());
    var index = $(this).parent()[0].id.split("#")[1];
    console.log(index);

    //$("#taskTitle").text(txt); //txt.trim());
    //$.post(“/account/completeTask/abc”,{'taskTitle': txt},callbackFunction);
    $.post( "/account/completeTask", {'taskNum': parseInt(index)},function(data){location.reload();});
});

$("#questList .doneTaskRow .btn").click(function(e) {
    e.preventDefault();
    //$(".confirm").show();
    //console.log($(this).parent());
    var txt = $(this).parent()[0].children[0].textContent.trim();
    //console.log(txt);

    $("#taskTitle").text(txt); //txt.trim());


    //$.post(“/account/completeTask/abc”,{'taskTitle': txt},callbackFunction);
    $.post( "/account/reopenTask", {'taskName': txt},function(data){
      location.reload();
      /*
      $(document).ready(function(){
        alert('done refreshing and document is ready');
        $('#completedQuestsBtn').click();
      });
      */ //TODO doesnt reload in completed tasks
    });

});

$('#completedQuestsBtn').click(function(e){
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

// $("#currentQuestsBtn").click(function(e) {
//     e.preventDefault();
//     $("#questList").toggleClass("shrink");
//     $("#doneList").toggleClass("shrink");
// });
//
// $("#completedQuestsBtn").click(function(e) {
//     e.preventDefault();
//     $("#questList").toggleClass("shrink");
//     $("#doneList").toggleClass("shrink");
// });
