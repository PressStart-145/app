$(".btn").click(function(e) {
    var taskTitle = $(this).parent().text();
    taskTitle = taskTitle.substring(0, taskTitle.length - 9);
    $(".confirm").css('display', 'block');
    $("#taskTitle").text(taskTitle);
});
