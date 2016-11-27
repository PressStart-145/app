/*$(".btn").click(function(e) {
    var taskTitle = $(this).parent().text();
    taskTitle = taskTitle.substring(0, taskTitle.length - 9);
    $(".confirm").css('display', 'block');
    $("#taskTitle").text(taskTitle);
});
*/

var validateForm = function() {
    $("#dateAlert").hide();
    $("#levelAlert").hide();
    var deadline = document.forms["questForm"]["deadline"].value;
    var level = document.forms["questForm"]["level"].value;
    var regex = /^((0?[13578]|10|12)(-|\/)(([1-9])|(0[1-9])|([12])([0-9]?)|(3[01]?))(-|\/)((19)([2-9])(\d{1})|(20)([01])(\d{1})|([8901])(\d{1}))|(0?[2469]|11)(-|\/)(([1-9])|(0[1-9])|([12])([0-9]?)|(3[0]?))(-|\/)((19)([2-9])(\d{1})|(20)([01])(\d{1})|([8901])(\d{1})))$/;
    var isDeadline = true;
    var isLevel = true;
    if (!regex.test(deadline)) {
        console.log("Invalid date format.");
        $("#dateAlert").show();
        isDeadline = false;
    }
    var inDate = deadline.split("/");
    var dueDate = new Date();
    dueDate.setFullYear(inDate[2], inDate[0]-1, inDate[1]);
    var today = new Date();
    if(dueDate < today) {
        console.log("Deadline is before today.");
        $("#lateAlert").show();
        isDeadline = false;
    }
    if (isNaN(level) || level > 10 || level < 1) {
        console.log("Point value is out of range.");
        $("#levelAlert").show();
        isLevel = false;
    }
    return (isDeadline && isLevel);
}

var sendTaskData = function() {
    //Create a castle JSON object with the name and members provided
    formInfo = $("form").serializeArray();
    var data = {
        "title": formInfo[0].value,
        "description": formInfo[1].value,
        "level": formInfo[3].value,
        "deadline": formInfo[2].value,
        "takenBy": "",
        "completed": false
    };
    console.log(data);
    /*
    var newCastle = {
        "name": formInfo[0].value,
        "members": toAdd
    };*/
    $.post("/wizard/add", data, function(data, status) {
        window.location = "/wizard2";
    });
}
