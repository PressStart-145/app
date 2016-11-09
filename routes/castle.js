 var data = require("../data/castles.json");
 var dataUsers = require("../data/castles.json");
 var quests = data.castles[0].quests;
 var monsterHealth = data.castles[0].game["monsterHealth"];
 var castleHealth = data.castles[0].game["castleHealth"];

exports.select = function(req,res) {
    res.render('castles', data);
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
    res.render('joinCastle');
};

exports.build = function(req, res){
    res.render('buildCastle');
};
