var data = require("../data/castles.json");
var dataUsers = require("../data/users.json");
var quests = data.castles[0].quests;
var monsterHealth = data.castles[0].game["monsterHealth"];

exports.add = function(req, res) {
    var newQuest = {
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
    quests.forEach(function(e) {
        if(e["title"] == req.query.task) {
            e["completed"] = true;
            monsterHealth = monsterHealth - e["level"];
            if(monsterHealth <= 0) {
                monsterHealth = 0;
                //TODO add a victory sound and notify
                //members that the monster died
                //Only spawn monster if numQuests>0
                //Else, enter peaceful mode
                //peaceful mode= no monsters and can heal
                //TODO after monster death, allow grace period for healing
                spawnMonster();
            }
            if(monsterHealth > 100) {
                monsterHealth = 100;
            }
            console.log(quests);
            console.log(monsterHealth);
        }
    });
}

var spawnMonster = function() {
    if(monsterHealth == 0) {
        monsterHealth = 100;
        console.log("A new monster has been spawned!!!");
    }
}


exports.account = function(req, res) {
    var currentUser = req.app.locals.currentUser;
    var currentCastle = data.castles[0]; //TODO harcoded
    var todoTaskList = [];
    var doneTaskList = [];
    var completedTask = 0;

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
};


exports.acceptTask = function(req, res) {
    var acceptedTaskName = req.body.taskName;
    var accepteeUsername = req.body.username;
    //var currentCastle = data.castles[0]; //TODO harcoded
    var todoTaskList = [];
    var inProgressTaskList = [];
    var doneTaskList = [];


    for (var key in data.castles[0].quests) {
      if (data.castles[0].quests[key].title === acceptedTaskName) {
          data.castles[0].quests[key].takenBy = accepteeUsername;
          //TODO handle dup task titles
          //TODO idea: use quests index number to handle assignment
      }
    }

    for (var key in data.castles[0].quests) {
        if (data.castles[0].quests[key].completed) {
            doneTaskList.push(data.castles[0].quests[key]);
        } else if (data.castles[0].quests[key].takenBy === "") {
            todoTaskList.push(data.castles[0].quests[key]);
        } else {
            inProgressTaskList.push(data.castles[0].quests[key]);
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
  var completedTaskName = req.body.taskName;
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
      if (currentCastle.quests[key].title === completedTaskName) {
          data.castles[0].quests[key].completed = true;
          data.castles[0].game.monsterHealth -= data.castles[0].quests[key].level;
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
          data.castles[0].quests[key].completed = false;
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
      'user': dataUsers.users[2]
  });
}
