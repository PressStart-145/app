var users = require("../users.json");

$("#sidebarMenu").load('/sidebar.html');

$(".backBtn").click(function() {
    e.preventDefault();
    window.history.back();
});

var addUser = function(name, username, password, email) {
    var newUser = {
        "name": name,
        "username": username,
        "password": password,
        "email": email
    };
    users.users.push(newUser);
}
