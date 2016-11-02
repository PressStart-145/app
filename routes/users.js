
/*
 * GET log in page.
 */

var data = require("../data/users.json");

exports.add = function(req, res){
    var newUser = {
        "name": req.body.fullname,
        "username": req.body.username,
        "password": req.body.password,
        "email": req.body.email,
        "imageURL": req.body.image
    };
    data.users.push(newUser);
    console.log(data);
    res.render('login');
};

exports.login = function(req, res){
    res.render('login');
};
