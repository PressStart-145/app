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

  if (req.body.username != null && req.body.password != null) {
    checkCredentialsDB(req, res, req.body.username, req.body.password);
  } else {
    // else if we re not checking for credential
    // (ie select not called from login page)
    usernameInexistant = false;
    wrongPassword = false;
    currentUser = req.app.locals.currentUser;
    if(req.session.user ) {
      currentUser = req.session.user;
    }
    makeCastleJson(req, res, 'castles', 0, null); //0 select:userCastles
  }
}



exports.add = function(req, res) {
  newMem = {
    "username": req.app.locals.currentUser.username,
    "numCompleted": 0
  };

  // console.log(req.body);

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
    newCastle.name = req.body.name;
    newCastle.admin = req.app.locals.currentUser.username;
    newCastle.members.push(newMem);
    var postMembers = req.body.members.split(",");
    console.log(req.body.members.split(","));
    for (key in req.body.members.split(",")) {
      console.log(req.body.members.split(",")[key]);
    }
    for (key in postMembers) {
      newCastle.members.push({
        "username": postMembers[key],
        "numCompleted": 0
      });
    }
    addCastleToDB(req, res, newCastle);
  } else if (req.body.type === "member") {
    var un = req.app.locals.currentUser.username
    if(req.session.user) {
      un = req.session.user.username;
    }
    addMemberToCastle(req, res, un, req.body.name);
  }
}

exports.view = function(req, res) {
  if (req.query.name != undefined) {
    findCastle(req, res, req.query.name);
  } else {
    var cn = req.app.locals.currentCastle.name
    if(req.session.castle) {
      cn = req.session.castle.name;
    }
    findCastleAndRemoveHealth(req, res, cn, 3);
  }
};

exports.join = function(req, res) {
  var un = req.app.locals.currentUser.username
  if(req.session.user) {
    un = req.session.user.username;
  }
  findJoinableCastles(req, res, un);
};

exports.build = function(req, res) {
  makeCastleJson(req, res, 'buildCastle', 3, null);
};


/*
d8888b. d8888b.      d88888b db    db d8b   db  .o88b.
88  `8D 88  `8D      88'     88    88 888o  88 d8P  Y8
88   88 88oooY'      88ooo   88    88 88V8o 88 8P
88   88 88~~~b.      88~~~   88    88 88 V8o88 8b
88  .8D 88   8D      88      88b  d88 88  V888 Y8b  d8
Y8888D' Y8888P'      YP      ~Y8888P' VP   V8P  `Y88P'
*/

checkCredentialsDB = function(req, res, username, password) {
  models.User
    .find({
        username: username
      },
      function(err, users) {
        if (err) console.log(err);
        var usernameInexistant = false;
        var wrongPassword = false;
        var errMsg = "";
        if (users.length == 0) {
          usernameInexistant = true;
          errMsg = "Username " + req.body.username + " does not exist";
        } else if (users.length > 1) {
          console.log("too many users with username " + username);
        } else {
          if (users[0].password !== password) {
            wrongPassword = true;
            errMsg = "Wrong password";
          } else {
            console.log("matching username/password");
          }
        }


        if (usernameInexistant || wrongPassword) {
          req.app.locals.err = true;
          req.app.locals.errMsg = errMsg;
          req.session.err = true;
          req.session.errMsg = errMsg;
          req.session.save();
          res.redirect('login');
        } else {
          req.app.locals.currentUser = {
            "name": users[0].name,
            "username": users[0].username,
            "password": users[0].password,
            "email": users[0].email,
            "imageURL": users[0].imageURL,
          };

          req.session.regenerate(function() {
            // Store the user's primary key
            // in the session store to be retrieved,
            // or in this case the entire user object
            req.session.user = users[0];
            // console.log(req.session);
            req.session.save(function(err) {
              makeCastleJson(req, res, 'castles', 0, null); //0 select:userCastles
            });

          });

        }
      });
}

//check first if there are no castle with this name?
addCastleToDB = function(req, res, castleJSON) {
  var userID;
  var gameID;
  var memberIDs = [];
  var memberUsernames = [];

  castleJSON.members.forEach(function(u) {
    memberUsernames.push(u.username);
  });

  models.Castle
    .find({
      name: castleJSON.name
    })
    .exec(function(err, castles) {
      if (err) console.log(err);
      if (castles.length != 0) {
        console.log("castle " + castleJSON.name + " already exist");
        makeCastleJson(req, res, 'castles', 0, null);
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
      makeCastleJson(req, res, 'castles', 0, null);
    });
  }
}

// rUserCastles = function(currentUser, userCastles) {
//   var result = [];
//   models.Castle
//     .find()
//     .populate('members')
//     .exec(function(err, castles) {
//       if (err) console.log(err);
//       castles.forEach(function(c) {
//         c.members.forEach(function(m) {
//           if (m.username === currentUser.username) {
//             result.push(c._id)
//           }
//         });
//       });
//       printUserCastles();
//     });
//
//   printUserCastles = function() {
//     models.Castle
//       .find({
//         _id: {
//           $in: result
//         }
//       })
//       .exec(function(err, castles) {
//         if (err) console.log(err);
//         console.log("user " + currentUser.username + " is in those castles: ");
//         castles.forEach(function(c) {
//           console.log(c.name);
//         });
//       });
//   }
// }

addMemberToCastle = function(req, res, username, castleName) {
  var userID;
  models.User
    .find({
      username: username
    })
    .exec(function(err, users) {
      if (users.length != 1) {
        console.log("0 or more than 1 user with this username " + username);
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
          makeCastleJson(req, res, 'castles', 0, null); //0 select:userCastles
        }
      );
  }
}

findCastle = function(req, res, castleName) {
  models.Castle
    .findOne({
      name: castleName
    })
    .exec(function(err, castle) {
      if (err) console.log(err);
      if (!castle) {
        console.log("castle " + castleName + " does not exist");
      } else {
        makeCastleJson(req, res, 'castle', 1, castleName);
      }
    });
}

findCastleAndRemoveHealth = function(req, res, castleName, healthAmount) {
  models.Castle
    .findOne({
      name: castleName
    })
    .populate("game quests")
    .exec(function(err, castle) {
      if (err) console.log(err);
      if (!castle) {
        console.log("castle " + castleName + " does not exist");
      } else {
        var canDmg = false;

        if (castle.quests) {
          castle.quests.forEach(function(q) {
            if (!q.completed) {
              canDmg = true;
            }
          });
        }

        if (canDmg) {
          if (castle.game.castleHealth >= healthAmount) {
            castle.game.castleHealth = castle.game.castleHealth - healthAmount;
          } else {
            castle.game.castleHealth = 0;
            console.log("Your castle is falling");
          }
        }
        castle.game.save(function(err, g) {
          if (err) console.log(err);
          makeCastleJson(req, res, 'castle', 1, castleName);
        });
      }
    });
}


findJoinableCastles = function(req, res, username) {
  var result = {
    "castles": []
  }
  models.Castle
    .find()
    .populate("members")
    .exec(function(err, castles) {
      if (err) console.log(err);
      castles.forEach(function(c) {
        var canAdd = true;
        if (c.members) {
          c.members.forEach(function(m) {
            if (m.username === username) {
              canAdd = false;
            }
          });
        }
        if (canAdd) {
          result.castles.push({
            'name': c.name
          });
        }
      });
      makeCastleJson(req, res, 'joinCastle', 2, result);
      //res.render('joinCastle', userCastles);
    });
}


makeCastleJson = function(req, res, page, num, arg) {
  var result = {
    'castles': []
  };
  models.Castle
    .find()
    .populate("members quests game admin")
    .exec(function(err, castles) {
      if (err) console.log(err);
      castles.forEach(function(c) {
        var cJson = {
          "name": "",
          "admin": "",
          "members": [],
          "quests": [],
          "numCompleted": 0,
          "game": {
            "castleHealth": 0,
            "monsterHealth": 0,
            "items": []
          }
        };

        var ncg = 0;

        cJson.name = c.name;
        if (c.admin) {
          cJson.admin = c.admin.username;
        }
        if (c.game) {
          cJson.game.castleHealth = c.game.castleHealth;
          cJson.game.monsterHealth = c.game.monsterHealth;
        }

        var memberIDs = [];
        c.members.forEach(function(m) {
          var mJson = {
            "username": m.username,
            "numCompleted": 0,
            "imageURL": m.imageURL
          };
          var nc = 0;
          c.quests.forEach(function(q) {
            if ((q.takenBy).toString() === (m._id).toString() && q.completed) {
              nc++;
            }
          });
          mJson.numCompleted = nc;
          cJson.members.push(mJson);

          var toAdd = true;
          memberIDs.forEach(function(m2) {
            if (m2.username === m.username) {
              toAdd = false;
            }
          });
          if (toAdd) {
            memberIDs.push({
              "id": m._id,
              "username": m.username
            });
          }
        });
        // var i = 0;
        c.quests.forEach(function(q) {
          var qJson = {
            "id": q.index,
            "title": q.title,
            "description": q.description,
            "level": q.level,
            "deadline": q.deadline.toDateString(),
            "takenBy": "",
            "completed": q.completed
          };

          if (q.completed) {
            ncg++;
          }

          memberIDs.forEach(function(m) {
            //if(m.id === q.takenBy) { // <-- this doesnt work fu JS
            if ((m.id).toString() === (q.takenBy).toString()) {
              qJson.takenBy = m.username;
            }
          });

          cJson.quests.push(qJson);
        });

        cJson.numCompleted = ncg;
        result.castles.push(cJson);
      });

      //console.log(result);
      dbCastleJson = result;


      var dataToSend;

      //0 select:userCastles
      //1 view:currentCastle
      //2 join:joinableCastles
      //0 build:castles. users, currentUser
      switch (num) {
        case 0:
          var dbUserCastles = {
            "castles": []
          };
          result.castles.forEach(function(c) {
            c.members.forEach(function(m) {
              var un = req.app.locals.currentUser.username
              if(req.session.user) {
                un = req.session.user.username;
              }
              if (m.username === un) {
                dbUserCastles.castles.push(c);
              }
            });
          });
          dataToSend = dbUserCastles;
          break;
        case 1:
          result.castles.forEach(function(c) {
            if (c.name === arg) {
              req.app.locals.currentCastle = c;
              req.session.castle = c
              req.session.save();

              var hasNoQuests = true;

              if (c.quests) {
                c.quests.forEach(function(q) {
                  if (!q.completed) {
                    hasNoQuests = false;
                  }
                });
              }

              var un = req.app.locals.currentUser.name
              if(req.session.user) {
                un = req.session.user.name;
              }

              dataToSend = {
                'name': un,
                'castleName': c.name,
                'monsterName': "Kraken",
                'castleHealth': c.game.castleHealth,
                'monsterHealth': c.game.monsterHealth,
                'noQuests': hasNoQuests
              };
            }
          });
          break;
        case 2:
          dataToSend = arg;
          break;
        case 3:
          var un = req.app.locals.currentUser.username
          if(req.session.user) {
            un = req.session.user.username;
          }
          var userData = {
            "users": [],
            "castles": result.castles,
            "currUser": un
          };

          result.castles.forEach(function(c) {
            c.members.forEach(function(m) {
              var inIt = false;
              userData.users.forEach(function(u) {
                if (m.username === u.username) {
                  inIt = true;
                }
              });
              if (!inIt) {
                userData.users.push({
                  "username": m.username
                });
              }
            });
          });
          dataToSend = userData;

          break;
        default:

      };

      //console.log(dataToSend);
      res.render(page, dataToSend);
      //return result;
    });
}

// function sleep(milliseconds) {
//   var start = new Date().getTime();
//   for (var i = 0; i < 1e7; i++) {
//     if ((new Date().getTime() - start) > milliseconds){
//       break;
//     }
//   }
// }
