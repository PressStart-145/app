var data = require("../data/castles.json");
var users = require("../data/users.json");
var models = require('../models');

var currCastle;
var quests;
var monsterHealth;
var castleHealth;

var newMem = {
  "username": "snot",
  "numCompleted": 0
}

exports.select = function(req, res) {
  var usernameInexistant = true;
  var wrongPassword = true;
  var err = false;
  var errMsg = "";
  var currentUser;

  console.log(req.body);
  if (req.body.username != null && req.body.password != null) {
    //TODO DB CALL TO COMMENT OUT FOR PROD
    //checkCredentialsDB(req.body.username, req.body.password);
    //TODO should return user info to put into req.app.locals.currentUser
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
  } else {
    // else if we re not checking for credential
    // (ie select not called from login page)
    usernameInexistant = false;
    wrongPassword = false;
    currentUser = req.app.locals.currentUser;
  }

  if (err) {
    req.app.locals.err = true;
    req.app.locals.errMsg = errMsg;
    res.redirect('login');
  } else {
    req.app.locals.currentUser = currentUser;

    //TODO DB CALL TO COMMENT OUT FOR PROD
    //rUserCastles(currentUser, userCastles);
    var userCastles = {
      "castles": []
    };
    for (key in data.castles) {
      for (mem in data.castles[key].members) {
        if (data.castles[key].members[mem].username === req.app.locals.currentUser.username) {
          userCastles.castles.push(data.castles[key]);
        }
      }
    }
  }
  res.render('castles', userCastles);
}



exports.add = function(req, res) {
  newMem = {
    "username": req.app.locals.currentUser.username,
    "numCompleted": 0
  };

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
    newCastle.admin = req.app.locals.currentUser.username;
    //newCastle.members = req.body.value.members;
    newCastle.members.push(newMem);
    for (key in req.body.value.members) {
      newCastle.members.push({
        "username": req.body.value.members[key],
        "numCompleted": 0
      });
    }
    data.castles.push(newCastle);
    //TODO DB CALL TO COMMENT OUT FOR PROD
    //addCastleToDB(newCastle);
  } else if (req.body.type === "member") {
    //TODO DB CALL TO COMMENT OUT FOR PROD
    //addMemberToCastle(req.app.locals.currentUser.username, req.body.name);
    var name = req.body.name;
    var memExists = false
    for (s in data.castles) {
      if (name != null && data.castles[s].name.replace(/\s/g, '') === name) {
        for (mem in data.castles[s].members) {
          if (data.castles[s].members[mem].username === req.app.locals.currentUser.username) {
            memExists = true;
            break;
          }
        }
        if (!memExists) {
          data.castles[s].members.push(newMem);
        }
        break;
      }
    }
    res.render('castles', data);
  }
  console.log("after");
  console.log(data.castles);
}

exports.view = function(req, res) {
  if (req.query.name != undefined) {
    //TODO DB CALL TO COMMENT OUT FOR PROD
    //findCastle(req.query.name);
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
    //TODO DB CALL TO COMMENT OUT FOR PROD
    findCastleAndRemoveHealth("Disney" /*req.app.locals.currentCastle.name*/, 40);
    name = req.app.locals.currentCastle.name;
    currCastle = req.app.locals.currentCastle;
    canDamage = false;
    for (q in currCastle.quests) {
        if (q.completed == false) {
            canDamage = true;
            break;
        }
    }
    if (canDamage) {
        req.app.locals.currentCastle.game.castleHealth -= 3;
    }
    if (req.app.locals.currentCastle.game.castleHealth < 0) {
      req.app.locals.currentCastle.game.castleHealth = 0;
      console.log("Your castle is falling!!!");
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

  //console.log(req.app.locals.currentUser);
  //console.log(req.app.locals.currentCastle);

  res.render('castle', {
    'name': req.app.locals.currentUser.name,
    'castleName': name,
    'monsterName': "Kraken",
    'castleHealth': castleHealth,
    'monsterHealth': monsterHealth
  });
};

exports.join = function(req, res) {
  var userCastles = {
    "castles": []
  };
  var canJoin = true;
  for (key in data.castles) {
    canJoin = true;
    for (mem in data.castles[key].members) {
      if (data.castles[key].members[mem].username === req.app.locals.currentUser.username) {
        canJoin = false;
      }
    }
    if (canJoin) {
      userCastles.castles.push(data.castles[key]);
    }
  }
  console.log(userCastles);
  res.render('joinCastle', userCastles);
};

exports.build = function(req, res) {
  var userData = {
    "users": users.users,
    "castles": data.castles,
    "currUser": req.app.locals.currentUser.username
  };
  res.render('buildCastle', userData);
};


/*
d8888b. d8888b.      d88888b db    db d8b   db  .o88b.
88  `8D 88  `8D      88'     88    88 888o  88 d8P  Y8
88   88 88oooY'      88ooo   88    88 88V8o 88 8P
88   88 88~~~b.      88~~~   88    88 88 V8o88 8b
88  .8D 88   8D      88      88b  d88 88  V888 Y8b  d8
Y8888D' Y8888P'      YP      ~Y8888P' VP   V8P  `Y88P'
*/

checkCredentialsDB = function(username, password) {
  models.User
    .find({
        username: username
      },
      function(err, users) {
        if (err) console.log(err);
        if (users.length == 0) {
          console.log("no user " + username);
        } else if (users.length > 1) {
          console.log("too many users with username " + username);
        } else {
          if (users[0].password !== password) {
            console.log("wrong password for user " + username);
          } else {
            console.log("matching username/password");
          }
        }
      });
}

//check first if there are no castle with this name?
addCastleToDB = function(castleJSON) {
  var userID;
  var gameID;
  var memberIDs = [];
  var memberUsernames = [];

  castleJSON.members.forEach(function(u) {
    memberUsernames.push(u.username);
  });

  models.Castle
    .find({name: castleJSON.name})
    .exec(function(err, castles){
      if(err) console.log(err);
      if(castles.length != 0) {
        console.log("castle " + castleJSON.name + " already exist");
      } else {
        cGame();
      }
    });

  cGame = function() {
    var game = new models.Game({
      "castleHealth": castleJSON.game.castleHealth,
      "monsterHealth": castleJSON.game.monsterHealth
    });
    game.save(function(err, game) {
      if (err) console.log(err);
      gameID = game._id;
      rUserId();
    });
  }

  rUserId = function() {
    models.User
      .find({
          username: {
            $in: memberUsernames
          }
        },
        function(err, users) {
          if (err) console.log(err);
          if (users == null) {
            console.log("no user with names: " + memberUsernames);
          } else {
            users.forEach(function(u) {
              if (u.username === castleJSON.admin) {
                userID = u._id;
              }
              memberIDs.push(u._id);
            });
          }
          cCastle();
        });
  }

  cCastle = function() {
    var castle = new models.Castle({
      "name": castleJSON.name,
      "admin": userID,
      "members": memberIDs,
      "game": gameID
    });

    castle.save(function(err, castle) {
      if (err) console.log(err);
      console.log("castle " + castle.name + " saved on MongoDB");
    });
  }
}

rUserCastles = function(currentUser, userCastles) {
  var result = [];
  console.log("in rUserCastles");
  models.Castle
    .find()
    .populate('members')
    .exec(function(err, castles) {
      if (err) console.log(err);
      castles.forEach(function(c) {
        c.members.forEach(function(m) {
          if (m.username === currentUser.username) {
            result.push(c._id)
          }
        });
      });
      printUserCastles();
    });

  printUserCastles = function() {
    models.Castle
      .find({
        _id: {
          $in: result
        }
      })
      .exec(function(err, castles) {
        if (err) console.log(err);
        console.log("user " + currentUser.username + " is in those castles: ");
        castles.forEach(function(c) {
          console.log(c.name);
        });
      });
  }
}

addMemberToCastle = function(username, castleName) {
  var userID;
  models.User
    .find({
      username: username
    })
    .exec(function(err, users) {
      if (users.length != 1) {
        console.log("0 or more than 1 user with this username " + username);
        console.log(users.count);
        console.log(users);
      } else {
        userID = users[0]._id;
        checkIfUserInCastle();
      }
    });

  checkIfUserInCastle = function() {
    var inCastle = false;
    models.Castle
      .findOne({
        name: castleName
      })
      .populate("members")
      .exec(function(err, castle) {
        if (err) console.log(err);
        castle.members.forEach(function(m) {
          if (m.username === username) {
            inCastle = true;
          }
        });
        if (inCastle) {
          console.log("user " + username + " already in castle " + castleName);
        } else {
          addToCastle();
        }
      });
  }

  addToCastle = function() {
    models.Castle
      .update({
          name: castleName
        }, {
          $push: {
            members: userID
          }
        },
        function(err, raw) {
          if (err) console.log(err);
          console.log("member " + username + " added to castle " + castleName);
        }
      );
  }
}

findCastle = function(castleName) {
  models.Castle
    .findOne({name: castleName})
    .exec(function(err, castle){
      if(err) console.log(err);
      if (!castle) {
        console.log("castle " + castleName + " does not exist");
      } else {
        console.log("castle " + castle.name + " has id " + castle._id);
      }
    });
}


//TODO now working
findCastleAndRemoveHealth = function(castleName, healthAmount) {
  console.log("in findCastleAndRemoveHealth");
  models.Castle
    .findOne({name: castleName})
    .populate("game")
    .exec(function(err, castle) {
      if(err) console.log(err);
      if (!castle) {
        console.log("castle " + castleName + " does not exist");
      } else {
        console.log("castle " + castle.name + " has id " + castle._id);
        console.log("Castle Health: " + castle.game.castleHealth);
        if(castle.game.castleHealth >= healthAmount) {
          castle.game.castleHealth = castle.game.castleHealth - healthAmount;
        } else {
          castle.game.castleHealth = 0;
        }
        castle.save(function(err, c){
          if(err) console.log(err);
          console.log("Castle Health: " + c.game.castleHealth);
        })
      }
    });
}
