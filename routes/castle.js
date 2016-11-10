 var data = require("../data/castles.json");
 var dataUsers = require("../data/castles.json");
 var currCastle;
 var quests;
 var monsterHealth;
 var castleHealth;

 var users = require("../data/users.json");

 var newMem = {
     //"username": req.app.locals.userName, TODO
     "username": "snot",
     "numCompleted": 0
 }

exports.select = function(req,res) {
    res.render('castles', data);
}

exports.add = function(req,res) {
    console.log(req.body.type);
    console.log("before");
    console.log(data.castles);
    if(req.body.type === "castle") {
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
        newCastle.name = req.body.value.name;
        newCastle.members = req.body.value.members;
        //newCastle.admin = req.app.locals.userName; //TODO implement userName variable
        data.castles.push(newCastle);
    } else if(req.body.type === "member") {
        var name = req.body.value.name;
        for(s in data.castles) {
            if(name != null && data.castles[s].name.replace(/\s/g,'') === name) {
                data.castles[s].members.push(newMem);
                return;
            }
        }
    }
    console.log("after");
    console.log(data.castles);
}

exports.view = function(req, res) {
    var name = req.query.name;
    var index;
    req.app.locals.currentCastle = req.query.name;
    for(s in data.castles) {
        if(name != null && data.castles[s].name == name) {
            index = s;
        }
    }
    if(data.castles[index] == undefined || index == null) {
        console.log("Failed to find castle.");
        return;
    }
    //currCastle = req.app.locals.currentCastle;
    currCastle = data.castles[index];
    quests = currCastle.quests;
    monsterHealth = currCastle.game["monsterHealth"];
    castleHealth = currCastle.game["castleHealth"];
    /*var nameToShow = req.params.userName;
    var castleName = req.params.castleName;
    res.render('castle', {
        'name': nameToShow,
  	     'castleName': castleName
     });*/


     res.render('castle', {
         'name': "John", //TODO use global
         'castleName': name,
         'monsterName': "Kraken",
         'castleHealth': castleHealth,
         'monsterHealth': monsterHealth
     });
};

exports.join = function(req, res){
    res.render('joinCastle', data);
};

exports.build = function(req, res){
    res.render('buildCastle', users);
};
