 var data = require("../data/castles.json");
 var dataUsers = require("../data/castles.json");
 var currCastle = req.app.locals.currentCastle;
 var quests = data.currCastle.quests;
 var monsterHealth = data.currCastle.game["monsterHealth"];
 var castleHealth = data.currCastle.game["castleHealth"];

 var users = require("../data/users.json");

 var newCastle = {
    "name": "",
    "admin": "",
    "members": [],
    "quests": [],
    "numCompleted": 0,
    "game": {
        "castleHealth": 100,
        "monsterHealth": 100,
        "items": []
    }
 };

exports.select = function(req,res) {
    res.render('castles', data);
}

exports.add = function(req,res) {
    newCastle.name = req.body.name;
    newCastle.members = req.body.members;
    //newCastle.admin = req.app.locals.userName; //TODO implement userName variable
    data.castles.push(newCastle);
}

exports.view = function(req, res) {
    req.app.locals.currentCastle = req.query.name;
    /*var nameToShow = req.params.userName;
    var castleName = req.params.castleName;
    res.render('castle', {
        'name': nameToShow,
  	     'castleName': castleName
     });*/


     res.render('castle', {
         'name': "John",
         'castleName': req.app.locals.currentCastle,
         'monsterName': "Kraken",
         'castleHealth': data.castles[0].game["castleHealth"],
         'monsterHealth': data.castles[0].game["monsterHealth"]
     });
};

exports.join = function(req, res){
    res.render('joinCastle', data);
};

exports.build = function(req, res){
    res.render('buildCastle', users);
};
