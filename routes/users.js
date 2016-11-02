
/*
 * GET log in page.
 */

var data = require("../data/users.json");

exports.add = function(req, res){
    var newUser = {
        "name": "Donald Duck",
        "username": "duckgoose",
        "password": "doniscool",
        "email": "duckboy@mail.com",
        "imageURL": "/images/duck.gif"
    };
    data.users.push(newUser);
    console.log(data);
    res.render('login');
}

exports.login = function(req, res){
    res.render('login');
};
