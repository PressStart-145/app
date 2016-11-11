var data = require("../data/castles.json");
var dataUsers = require("../data/users.json");
var quests;
var monsterHealth;

exports.add = function(req, res) {
    quests = req.app.locals.currentCastle.quests;
    var newQuest = {
        "id": quests.length(),
        "title": req.body.title,
        "description": req.body.description,
        "level": req.body.level,
        "deadline": req.body.deadline,
        "takenBy": "",
        "completed": false
    };
    data.castles[0].quests.push(newQuest);


    var currentCastle = data.castles[0]; //TODO harcoded
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

exports.taskDone = function(req, res) {
    quests = req.app.locals.currentCastle.quests;
    monsterHealth = req.app.locals.currentCastle.game["monsterHealth"];
    quests.forEach(function(e) {
        if(e["title"] == req.query.task) {
            e["completed"] = true;
            monsterHealth = monsterHealth - parseInt(e["level"]);
            if(monsterHealth <= 0) {
                monsterHealth = 0;
                //TODO add a victory sound and notify
                //members that the monster died
                //Only spawn monster if numQuests>0
                //Else, enter peaceful mode
                //peaceful mode= no monsters and can heal
                //TODO after monster death, allow grace period for healing
                spawnMonster(req);
            }
            if(monsterHealth > 100) {
                monsterHealth = 100;
            }
            console.log(quests);
            console.log(monsterHealth);
        }
    });
}

var spawnMonster = function(req) {
    if(req.app.locals.currentCastle.monsterHealth == 0) {
        req.app.locals.currentCastle.monsterHealth = 100;
        console.log("A new monster has been spawned!!!");
    }
}


exports.account = function(req, res) {
    var currentUser = req.app.locals.currentUser;
    var currentCastle = req.app.locals.currentCastle;
    var todoTaskList = [];
    var doneTaskList = [];
    var completedTask = 0;

    var success = req.app.locals.success;
    req.app.locals.success = null;

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
    var todoTaskList = [];
    var inProgressTaskList = [];
    var doneTaskList = [];

    console.log(acceptedTaskIndex);

    for (var key in currentCastle.quests) {
      if (key === acceptedTaskIndex) {
          currentCastle.quests[key].takenBy = accepteeUsername;
      }
    }

    console.log(currentCastle.quests);

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

exports.view = function(req, res) {
    var currentCastle = data.castles[0]; //TODO harcoded
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

exports.completeTask = function(req, res) {
  var completedTaskIndex = req.body.taskNum;
  var currentUser = req.app.locals.currentUser;
  var currentCastle = req.app.locals.currentCastle;
  var completedTaskList = [];
  var todoTaskList = [];
  var doneTaskList = [];
  var completedTask = 0;

  currentCastle.members.forEach(function(u) {
    if(u.username == currentUser.username) {
      if(u.numCompleted == null) {
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
          if(currentCastle.game.monsterHealth <= 0) {
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
          if(currentCastle.game.monsterHealth > 100) {
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

  res.render('account', {
      'numCompleted': completedTask,
      'currentTaskList': todoTaskList,
      'doneTaskList': doneTaskList,
      'onlyOneCompleted': onlyOneCompleted,
      'user': currentUser
  });
}

exports.reopenTask = function(req, res) {
  var completedTaskName = req.body.taskName;
  var currentUser = req.app.locals.currentUser;
  var currentCastle = req.app.locals.currentCastle;
  var completedTaskList = [];
  var todoTaskList = [];
  var doneTaskList = [];
  var completedTask = 0;

  currentCastle.members.forEach(function(u) {
    if(u.username == currentUser.username) {
      u.numCompleted--;
    }
  });

  for (var key in currentCastle.quests) {
      if (currentCastle.quests[key].title === completedTaskName) {
          currentCastle.quests[key].completed = false;
          //completedTaskList.push(currentCastle.quests[key]);
      }
  }

  for (var key in currentCastle.quests) {
      if ((currentCastle.quests[key].takenBy === currentUser) && !currentCastle.quests[key].completed) {
          //console.log('To do: ' + currentCastle.quests[key].title);
          todoTaskList.push(currentCastle.quests[key])
      }
      if ((currentCastle.quests[key].takenBy === currentUser) && currentCastle.quests[key].completed) {
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
      'user': currentUser
  });
}
