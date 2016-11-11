var data = require("../data/castles.json");

exports.view = function(req, res) {
    var castle = data.castles[0]
    var users = castle.members;



    var tmpUsers = [];

    users.forEach(function(e){
      var user = {
        'username': '',
        'image': '',
        'numCompleted': '',
        'taskList': []
      };
      user.username = e.username;
      //loop through user and find img
      user.image = "duck.gif";
      // var ncTmp = e.numCompleted;
      // var nc;
      // if(ncTmp < 10) {
      //   nc = String.fromCharCode(160) + String.fromCharCode(160) + String.fromCharCode(160) + "(" + e.numCompleted + ")"
      // } else if (ncTmp < 100) {
      //   nc = String.fromCharCode(160) + "(" + e.numCompleted + ")"
      // } else {
      //   nc = "(" + e.numCompleted + ")"
      // }
      user.numCompleted = e.numCompleted;
      user.taskList.push({'task': "task1"});
      user.taskList.push({'task': "task2"});

      tmpUsers.push(user);
    });


    var achievements = [
      {
        'image' : 'TeamInfo-01-01.png',
        'name' : 'Killed a boss!'
      } ,
      {
        'image' : 'TeamInfo-01-01.png',
        'name' : 'Protected 10 towns!'
      } ,
      {
        'image' : 'TeamInfo-01-01.png',
        'name' : 'No damage in a week!'
      } ,
      {
        'image' : 'TeamInfo-01-01.png',
        'name' : '7 quests completed'
      }
    ];


    function compareCompleted(a,b) {
      if (a.numCompleted > b.numCompleted)
        return -1;
      if (a.numCompleted < b.numCompleted)
        return 1;
      return 0;
    }

    function compareName(a,b) {
      if (a.username < b.username)
        return -1;
      if (a.username > b.username)
        return 1;
      return 0;
    }
    rankings = tmpUsers.sort(compareCompleted);

    users = tmpUsers.sort(compareName);


    res.render('team', {
        'users': users,
        'castleName': castle.name,
        'rankings': rankings,
        'achievements' : achievements
    });
};
