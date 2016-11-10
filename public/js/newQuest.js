/*$(".btn").click(function(e) {
    var taskTitle = $(this).parent().text();
    taskTitle = taskTitle.substring(0, taskTitle.length - 9);
    $(".confirm").css('display', 'block');
    $("#taskTitle").text(taskTitle);
});
*/

var validateForm = function() {
    var deadline = document.forms["questForm"]["deadline"].value;
    var level = document.forms["questForm"]["level"].value;
    var regex = /^((0?[13578]|10|12)(-|\/)(([1-9])|(0[1-9])|([12])([0-9]?)|(3[01]?))(-|\/)((19)([2-9])(\d{1})|(20)([01])(\d{1})|([8901])(\d{1}))|(0?[2469]|11)(-|\/)(([1-9])|(0[1-9])|([12])([0-9]?)|(3[0]?))(-|\/)((19)([2-9])(\d{1})|(20)([01])(\d{1})|([8901])(\d{1})))$/;
    console.log(regex.test(deadline));
    if (!regex.test(deadline)) {
        console.log("Invalid date format.");
        $("#dateAlert").show();
        return false;
    }
    if (level > 10 || level < 1) {
        console.log("Point value is out of range.");
        return false;
    }
}
