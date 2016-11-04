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
    res.render('wizard', data.castles[0]);
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

exports.view = function(req, res) {
    res.render('wizard', data.castles[0]);
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
