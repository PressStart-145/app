 var data = require("../data/castles.json");
 var users = require("../data/users.json");

 var currCastle;
 var quests;
 var monsterHealth;
 var castleHealth;

 var newMem = {
     //"username": req.app.locals.userName, TODO
     "username": "snot",
     "numCompleted": 0
 }

 exports.select = function(req, res) {
     var usernameInexistant = true;
     var wrongPassword = true;
     var err = false;
     var errMsg = "";
     var currentUser;

     users.users.forEach(function(userJson) {
         if (userJson.username === req.body.username) {
             usernameInexistant = false;
             if (userJson.password === req.body.password) {
                 wrongPassword = false;
                 currentUser = userJson;
             }
         }
     });

     if (usernameInexistant) {
         err = true;
         errMsg = "Username " + req.body.username + " does not exist";
     } else if (wrongPassword) {
         err = true;
         errMsg = "Wrong password";
     }

     if (err) {
         req.app.locals.err = true;
         req.app.locals.errMsg = errMsg;
         res.redirect('login');
     } else {
         req.app.locals.currentUser = currentUser;

         //TODO prep data to have only the castle where req.body.username is
         res.render('castles', data);
     }
 }

 exports.add = function(req, res) {
     console.log(req.body.type);
     console.log("before");
     console.log(data.castles);
     if (req.body.type === "castle") {
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
         newCastle.admin = req.app.locals.currentUser;
         newCastle.members = req.body.value.members;
         //newCastle.admin = req.app.locals.userName; //TODO implement userName variable
         data.castles.push(newCastle);
     } else if (req.body.type === "member") {
         var name = req.body.value.name;
         for (s in data.castles) {
             if (name != null && data.castles[s].name.replace(/\s/g, '') === name) {
                 data.castles[s].members.push(newMem);
                 return;
             }
         }
     }
     console.log("after");
     console.log(data.castles);
 }

 exports.view = function(req, res) {
     if(req.query.name != undefined) {
         name = req.query.name;
         var index;
         for (s in data.castles) {
             if (name != null && data.castles[s].name == name) {
                 index = s;
             }
         }
         if (data.castles[index] == undefined || index == null) {
             console.log("Failed to find castle ");
             return;
         }
         currCastle = data.castles[index];
         req.app.locals.currentCastle = currCastle;
     } else {
         name = req.app.locals.currentCastle.name;
         currCastle = req.app.locals.currentCastle;
         req.app.locals.currentCastle.game.castleHealth -= 3;
         if(req.app.locals.currentCastle.game.castleHealth < 0) {
             req.app.locals.currentCastle.game.castleHealth = 0;
         }
     }


     quests = currCastle.quests;
     monsterHealth = currCastle.game["monsterHealth"];
     castleHealth = currCastle.game["castleHealth"];

     /*var nameToShow = req.params.userName;
    var castleName = req.params.castleName;
    res.render('castle', {
        'name': nameToShow,
  	     'castleName': castleName
     });*/

     console.log(req.app.locals.currentUser);
     console.log(req.app.locals.currentCastle);

     res.render('castle', {
         'name': req.app.locals.currentUser.name,
         'castleName': name,
         'monsterName': "Kraken",
         'castleHealth': castleHealth,
         'monsterHealth': monsterHealth
     });
 };

 exports.join = function(req, res) {
     res.render('joinCastle', data);
 };

 exports.build = function(req, res) {
     res.render('buildCastle', users);
 };
