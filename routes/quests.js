// var data = require("../data/castles.json");
// var dataUsers = require("../data/users.json");
var models = require('../models');
var quests;
var monsterHealth;

var models = require('../models');

exports.add = function(req, res) {

  quests = req.app.locals.currentCastle.quests;
  if (req.session.castle) {
    quests = req.session.castle.quests;
  }

  var newQuest = {
    "id": quests.length,
    "title": req.body.title,
    "description": req.body.description,
    "level": req.body.level,
    "deadline": req.body.deadline,
    "takenBy": "",
    "completed": false
  };
  req.app.locals.currentCastle.quests.push(newQuest);
  req.session.castle = req.app.locals.currentCastle;
  req.session.save();

  //console.log(req.app.locals.currentCastle.quests);

  var currentCastle = req.app.locals.currentCastle;
  if (req.session.castle) {
    currentCastle = req.session.castle;
  }
  var todoTaskList = [];
  var inProgressTaskList = [];
  var doneTaskList = [];

  for (var key in currentCastle.quests) {
    if (currentCastle.quests[key].completed) {
      doneTaskList.push(currentCastle.quests[key]);
    } else if (currentCastle.quests[key].takenBy === "") {
      todoTaskList.push(currentCastle.quests[key]);
    } else {
      inProgressTaskList.push(currentCastle.quests[key]);
    }
  }

  var dbQuest = new models.Quest({
    "title": newQuest.title,
    "description": newQuest.description,
    "level": newQuest.level,
    "deadline": newQuest.deadline,
    "completed": false,
    "index": newQuest.id
  });

  dbQuest.save(function(err, quest) {
    if (err) console.log(err);
    models.Castle
      .find({
        name: currentCastle.name
      })
      .exec(function(err, castles) {
        if (err) console.log(err);
        if (castles.length == 0) {
          console.log("no castle with with " + currentCastle.name);
        } else if (castles.length > 1) {
          console.log("too many castles with name " + currentCastle.name);
        } else {
          models.Castle
            .update({
                _id: castles[0]._id
              }, {
                $push: {
                  quests: quest
                }
              },
              function(err, raw) {
                if (err) console.log(err);
                res.render('wizard', {
                  'doneTaskList': doneTaskList,
                  'todoTaskList': todoTaskList,
                  'inProgressTaskList': inProgressTaskList
                });
              }
            );
        }
      });
  });
};

exports.taskDone = function(req, res) { //TODO DB
  quests = req.app.locals.currentCastle.quests;
  if (req.session.castle) {
    quests = req.session.castle.quests;
  }
  monsterHealth = req.app.locals.currentCastle.game["monsterHealth"];
  if (req.session.castle) {
    monsterHealth = req.session.castle.game["monsterHealth"];
  }
  quests.forEach(function(e) {
    if (e["title"] == req.query.task) {
      e["completed"] = true;
      monsterHealth = monsterHealth - parseInt(e["level"]);
      if (monsterHealth <= 0) {
        monsterHealth = 0;
        //TODO add a victory sound and notify
        //members that the monster died
        //Only spawn monster if numQuests>0
        //Else, enter peaceful mode
        //peaceful mode= no monsters and can heal
        //TODO after monster death, allow grace period for healing
        spawnMonster(req);
      }
      if (monsterHealth > 100) {
        monsterHealth = 100;
      }
      console.log(quests);
      console.log(monsterHealth);
    }
  });

  models.Quest
    .find({
      title: req.query.task
    })
    .exec(function(err, quests) {
      if (err) console.log(err);
      if (quests.length == 0) {
        console.log("no quest with title " + req.query.task);
      } else if (quests.length > 1) {
        console.log("more than one quest with name " + req.body.task);
      } else {
        models.Quest
          .update({
              _id: quests[0]._id
            }, {
              $set: {
                completed: true
              }
            },
            function(err, raw) {
              if (err) console.log(err);
              updateGame();
            }
          );
      }
    });

  updateGame = function() {
    var cn = req.app.locals.currentCastle.name;
    if (req.session.castle) {
      cn = req.session.castle.name
    }
    models.Castle
      .find({
        name: cn
      })
      .exec(function(err, castles) {
        if (err) console.log(err);
        if (castles.length == 0) {
          console.log("no castles with title " + cn);
        } else if (castles.length > 1) {
          console.log("more than one castles with name " + cn);
        } else {
          models.Game
            .update({
                _id: castles[0].game
              }, {
                $set: {
                  monsterHealth: monsterHealth
                }
              },
              function(err, raw) {
                if (err) console.log(err);
                console.log("monsterHealth updated in DB");
              }
            );
        }
      });
  }

}

var spawnMonster = function(req) {
  var c = req.app.locals.currentCastle;
  if (req.session.castle) {
    c = req.session.castle;
  }
  if (c.monsterHealth == 0) {
    c.monsterHealth = 100;
    console.log("A new monster has been spawned!!!");
    models.Game
      .find({
        name: c.name
      })
      .exec(function(err, castles) {
        if (err) console.log(err);
        if (castles.length == 0) {
          console.log("no castles with title " + c.name);
        } else if (castles.length > 1) {
          console.log("more than one castles with name " + c.name);
        } else {
          models.Game
            .update({
                _id: castles[0].game
              }, {
                $set: {
                  monsterHealth: c.monsterHealth
                }
              },
              function(err, raw) {
                if (err) console.log(err);
                console.log("monsterHealth updated in DB");
              }
            );
        }
      });
  }
}

//TODO ONLY FOR DEBUGING, CAN BE REMOVED
printCastles = function() {
  console.log("Printing linked castles");
  models.Castle.find()
    .populate('game admin members')
    .exec(function(err, castles) {
      if (castles == null) {
        console.log("No castles");
      } else {
        castles.forEach(function(castle) {
          console.log("------------------------------------");
          if (castle.admin == null) {
            console.log(castle.name + " has no admin");
          } else {
            console.log(castle.name + "'s admin is " + castle.admin.username);
          }
          if (castle.members == null) {
            console.log(castle.name + " has no memebers");
          } else {
            console.log(castle.name + "'s members are:");
            castle.members.forEach(function(m) {
              console.log(m.username);
            });
          }
          if (castle.game == null) {
            console.log(castle.name + " has no game lol");
          } else {
            console.log(castle.name + "'s hp " + castle.game.castleHealth);
            console.log(castle.name + "'s monster's hp " + castle.game.monsterHealth);
          }
        });
        console.log("------------------------------------");
      }
    });
}

exports.account = function(req, res) {

  //printCastles();

  var currentUser = req.app.locals.currentUser;
  var currentCastle = req.app.locals.currentCastle;
  if (req.session.castle) {
    currentCastle = req.session.castle;
  }
  if (req.session.user) {
    currentUser = req.session.user;
  }
  var todoTaskList = [];
  var doneTaskList = [];
  var completedTask = 0;

  var success = req.app.locals.success;
  if(req.session.success) {
    success = req.session.success;
  }
  req.app.locals.success = null;
  req.session.success = null;
  req.session.save();

  for (var key in currentCastle.quests) {
    if ((currentCastle.quests[key].takenBy === currentUser.username) && !currentCastle.quests[key].completed) {
      //console.log('To do: ' + currentCastle.quests[key].title);
      todoTaskList.push(currentCastle.quests[key])
    }
    if ((currentCastle.quests[key].takenBy === currentUser.username) && currentCastle.quests[key].completed) {
      //console.log('Done: ' + currentCastle.quests[key].title);
      doneTaskList.push(currentCastle.quests[key])
    }
  }

  completedTask = doneTaskList.length;
  var onlyOneCompleted = (completedTask == 1);

  res.render('account', {
    'numCompleted': completedTask,
    'currentTaskList': todoTaskList,
    'doneTaskList': doneTaskList,
    'onlyOneCompleted': onlyOneCompleted,
    'user': currentUser,
    'success': success
  });
};


exports.acceptTask = function(req, res) {
  var acceptedTaskIndex = req.body.taskNum;
  var accepteeUsername = req.app.locals.currentUser.username;
  var currentCastle = req.app.locals.currentCastle;
  if (req.session.user) {
    accepteeUsername = req.session.user.username;
  }
  if (req.session.castle) {
    currentCastle = req.session.castle;
  }
  var todoTaskList = [];
  var inProgressTaskList = [];
  var doneTaskList = [];

  console.log(acceptedTaskIndex);

  for (var key in currentCastle.quests) {
    if (key === acceptedTaskIndex) {
      currentCastle.quests[key].takenBy = accepteeUsername;
    }
  }

  req.app.locals.currentCastle = currentCastle;
  req.session.castle = currentCastle;
  req.session.save();

  for (var key in currentCastle.quests) {
    if (currentCastle.quests[key].completed) {
      doneTaskList.push(currentCastle.quests[key]);
    } else if (currentCastle.quests[key].takenBy === "") {
      todoTaskList.push(currentCastle.quests[key]);
    } else {
      inProgressTaskList.push(currentCastle.quests[key]);
    }
  }


  models.User
    .find({
      username: accepteeUsername
    })
    .exec(function(err, users) {
      if (err) console.log(err);
      if (users.length == 0) {
        console.log("no users with name " + accepteeUsername);
      } else if (users.length > 1) {
        console.log("more than one user with username " + accepteeUsername);
      } else {
        updateQuest(users[0]._id);
      }
    });


  updateQuest = function(userID) {
    models.Castle
      .find({
        name: currentCastle.name
      })
      .populate("quests")
      .exec(function(err, castles) {
        if (err) console.log(err);
        if (castles.length == 0) {
          console.log("no castles with name " + currentCastle.name);
        } else if (castles.length > 1) {
          console.log("more than one castles with name " + currentCastle.name);
        } else {
          var q_id;
          castles[0].quests.forEach(function(q) {
            if (q.index == acceptedTaskIndex) {
              q_id = q._id;
            }
          });

          models.Quest
            .update({
                _id: q_id
              }, {
                $set: {
                  takenBy: userID
                }
              },
              function(err, raw) {
                if (err) console.log(err);
                // console.log("after accept task");
                // console.log(currentCastle);
                res.render('wizard', {
                  'doneTaskList': doneTaskList,
                  'todoTaskList': todoTaskList,
                  'inProgressTaskList': inProgressTaskList
                });
              }
            );
        }
      });
  }

};

exports.view = function(req, res) {
  var currentCastle = req.app.locals.currentCastle;
  if (req.session.castle) {
    currentCastle = req.session.castle;
  }
  // console.log(currentCastle);
  var todoTaskList = [];
  var inProgressTaskList = [];
  var doneTaskList = [];

  for (var key in currentCastle.quests) {
    if (currentCastle.quests[key].completed) {
      doneTaskList.push(currentCastle.quests[key]);
    } else if (currentCastle.quests[key].takenBy === "") {
      todoTaskList.push(currentCastle.quests[key]);
    } else {
      inProgressTaskList.push(currentCastle.quests[key]);
    }
  }


  res.render('wizard', {
    'doneTaskList': doneTaskList,
    'todoTaskList': todoTaskList,
    'inProgressTaskList': inProgressTaskList
  });
};

exports.view2 = function(req, res) {
  var currentUser = req.app.locals.currentUser;
  var currentCastle = req.app.locals.currentCastle;
  if (req.session.user) {
    currentUser = req.session.user;
  }
  if (req.session.castle) {
    currentCastle = req.session.castle;
  }
  console.log(currentCastle);
  var todoTaskList = [];
  var inProgressTaskList = [];
  var doneTaskList = [];

  /* Team Quests */
  for (var key in currentCastle.quests) {
    if (currentCastle.quests[key].completed) {
      doneTaskList.push(currentCastle.quests[key]);
    } else if (currentCastle.quests[key].takenBy === "") {
      todoTaskList.push(currentCastle.quests[key]);
    } else {
      inProgressTaskList.push(currentCastle.quests[key]);
    }
  }

  /* Personal Quests */
  var completedTask = 0;
  var userToDoTaskList = [];
  var userCompleteTaskList = [];

  var success = req.app.locals.success;
  if(req.session.success) {
    success = req.session.success;
  }
  req.app.locals.success = null;
  req.session.success = null;
  req.session.save();

  for (var key in currentCastle.quests) {
    if ((currentCastle.quests[key].takenBy === currentUser.username) && !currentCastle.quests[key].completed) {
      //console.log('To do: ' + currentCastle.quests[key].title);
      userToDoTaskList.push(currentCastle.quests[key])
    }
    if ((currentCastle.quests[key].takenBy === currentUser.username) && currentCastle.quests[key].completed) {
      //console.log('Done: ' + currentCastle.quests[key].title);
      userCompleteTaskList.push(currentCastle.quests[key])
    }
  }

  completedTask = doneTaskList.length;
  var onlyOneCompleted = (completedTask == 1);

  res.render('wizard2', {
    'doneTaskList': doneTaskList,
    'currentTaskList': userToDoTaskList,
    'userCompleteTaskList': userCompleteTaskList,
    'todoTaskList': todoTaskList,
    'inProgressTaskList': inProgressTaskList,
    'numCompleted': completedTask,
    'onlyOneCompleted': onlyOneCompleted
  });
};

exports.completeTask = function(req, res) { //TODO DB
  var completedTaskIndex = req.body.taskNum;
  var currentUser = req.app.locals.currentUser;
  var currentCastle = req.app.locals.currentCastle;
  if (req.session.user) {
    currentUser = req.session.user;
  }
  if (req.session.castle) {
    currentCastle = req.session.castle;
  }
  var completedTaskList = [];
  var todoTaskList = [];
  var doneTaskList = [];
  var completedTask = 0;

  currentCastle.members.forEach(function(u) {
    if (u.username == currentUser.username) {
      if (u.numCompleted == null) {
        u.numCompleted = 1;
      } else {
        u.numCompleted++;
      }
    }
  });

  for (var key in currentCastle.quests) {
    if (key === completedTaskIndex) {
      currentCastle.quests[key].completed = true;
      //currentCastle.game.monsterHealth -= currentCastle.quests[key].level;
      currentCastle.game.monsterHealth -= parseInt(currentCastle.quests[key].level);
      if (currentCastle.game.monsterHealth <= 0) {
        currentCastle.game.monsterHealth = 0;
        //TODO add a victory sound and notify
        //members that the monster died
        //Only spawn monster if numQuests>0
        //Else, enter peaceful mode
        //peaceful mode= no monsters and can heal
        //TODO after monster death, allow grace period for healing
        currentCastle.game.monsterHealth = 100;
        currentCastle.game.castleHealth = 100;
        console.log("A new monster has been spawned!!!");
      }
      if (currentCastle.game.monsterHealth > 100) {
        currentCastle.game.monsterHealth = 100;
      }
      //completedTaskList.push(currentCastle.quests[key]);
    }
  }

  for (var key in currentCastle.quests) {
    if ((currentCastle.quests[key].takenBy === currentUser.username) && !currentCastle.quests[key].completed) {
      //console.log('To do: ' + currentCastle.quests[key].title);
      todoTaskList.push(currentCastle.quests[key])
    }
    if ((currentCastle.quests[key].takenBy === currentUser.username) && currentCastle.quests[key].completed) {
      //console.log('Done: ' + currentCastle.quests[key].title);
      doneTaskList.push(currentCastle.quests[key])
    }
  }

  completedTask = doneTaskList.length;
  var onlyOneCompleted = (completedTask == 1);

  models.Castle
    .find({
      name: currentCastle.name
    })
    .populate("quests")
    .exec(function(err, castles) {
      if (err) console.log(err);
      if (castles.length == 0) {
        console.log("no castles with name " + currentCastle.name);
      } else if (castles.length > 1) {
        console.log("more than one castles with name " + currentCastle.name);
      } else {
        var q_id;
        castles[0].quests.forEach(function(q) {
          if (q.index == completedTaskIndex) {
            q_id = q._id;
          }
        });

        models.Quest
          .update({
              _id: q_id
            }, {
              $set: {
                completed: true
              }
            },
            function(err, raw) {
              if (err) console.log(err);
              updateGame(castles[0].game);
            }
          );
      }
    });
  updateGame = function(gameID) {
    models.Game
      .update({
          _id: gameID
        }, {
          $set: {
            monsterHealth: currentCastle.game.monsterHealth
          }
        },
        function(err, raw) {
          if (err) console.log(err);
          res.render('account', {
            'numCompleted': completedTask,
            'currentTaskList': todoTaskList,
            'doneTaskList': doneTaskList,
            'onlyOneCompleted': onlyOneCompleted,
            'user': currentUser
          });
        }
      );
  }
}

// exports.reopenTask = function(req, res) { //TODO DB (not in use though)
//   var completedTaskName = req.body.taskName;
//   var currentUser = req.app.locals.currentUser;
//   var currentCastle = req.app.locals.currentCastle;
//   var completedTaskList = [];
//   var todoTaskList = [];
//   var doneTaskList = [];
//   var completedTask = 0;
//
//   currentCastle.members.forEach(function(u) {
//     if (u.username == currentUser.username) {
//       u.numCompleted--;
//     }
//   });
//
//   for (var key in currentCastle.quests) {
//     if (currentCastle.quests[key].title === completedTaskName) {
//       currentCastle.quests[key].completed = false;
//       //completedTaskList.push(currentCastle.quests[key]);
//     }
//   }
//
//   for (var key in currentCastle.quests) {
//     if ((currentCastle.quests[key].takenBy === currentUser) && !currentCastle.quests[key].completed) {
//       //console.log('To do: ' + currentCastle.quests[key].title);
//       todoTaskList.push(currentCastle.quests[key])
//     }
//     if ((currentCastle.quests[key].takenBy === currentUser) && currentCastle.quests[key].completed) {
//       //console.log('Done: ' + currentCastle.quests[key].title);
//       doneTaskList.push(currentCastle.quests[key])
//     }
//   }
//
//   completedTask = doneTaskList.length;
//   var onlyOneCompleted = (completedTask == 1);
//
//   res.render('account', {
//     'numCompleted': completedTask,
//     'currentTaskList': todoTaskList,
//     'doneTaskList': doneTaskList,
//     'onlyOneCompleted': onlyOneCompleted,
//     'user': currentUser
//   });
// }
