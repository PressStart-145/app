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
            console.log(quests);
            console.log(monsterHealth);
        }
    });
}


exports.account = function(req, res) {
    var currentUser = dataUsers.users[2].username; //TODO lookup in dataUsers
    var currentCastle = data.castles[0]; //TODO harcoded
    var todoTaskList = [];
    var doneTaskList = [];
    var completedTask = 0;

    console.log(currentUser);


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
  console.log(req.body.taskName);
  var completedTaskName = req.body.taskName;
  var currentUser = dataUsers.users[2].username; //TODO harcoded
  var currentCastle = data.castles[0]; //TODO harcoded
  var completedTaskList = [];
  var todoTaskList = [];
  var doneTaskList = [];
  var completedTask = 0;

  for (var key in currentCastle.quests) {
      if (currentCastle.quests[key].title === completedTaskName) {
          data.castles[0].quests[key].completed = true;
          data.castles[0].game.monsterHealth -= data.castles[0].quests[key].level;
          //completedTaskList.push(currentCastle.quests[key]);
      }
  }
  completedTask.completed = true;

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

exports.reopenTask = function(req, res) {
  console.log(req.body.taskName);
  var completedTaskName = req.body.taskName;
  var currentUser = dataUsers.users[2].username; //TODO harcoded
  var currentCastle = data.castles[0]; //TODO harcoded
  var completedTaskList = [];
  var todoTaskList = [];
  var doneTaskList = [];
  var completedTask = 0;

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
