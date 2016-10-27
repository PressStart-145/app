
/*
 * GET log in page.
 */

var users = require("../data/users.json");

exports.view = function(req, res){
    res.render('login');
};
