//var data = require("../data/castles.json");
//var dataUsers = require("../data/users.json");
var models = require('../models');

exports.view = function(req, res) {
    var castle = req.app.locals.currentCastle;
    var castleUsers = castle.members;
    var currentUser = req.app.locals.currentUser;

    if(req.session.user && req.session.castle) {
      castle = req.session.castle;
      castleUsers = castle.members;
      currentUser = req.session.user;
    }

    // console.log(currentUser.username);
    // if(req.session && req.session.user && req.session.castle) {
    //   console.log("session user");
    //   console.log(req.session.user.username);
    //   console.log("session castle");
    //   console.log(req.session.castle.name);
    // } else {
    //   console.log("not session");
    // }
    var tmpUsers = [];


    castleUsers.forEach(function(u){
      var user = {
        'username': '',
        'image': '',
        'numCompleted': '',
        'taskList': [],
        'currUser': false
      };
      user.username = u.username;

      if(currentUser != null) {
        if(currentUser.username === u.username) {
          user.currUser = true;
        }
      }

      if(u.imageURL == null || u.imageURL === "") {
        user.image = "/images/PersonalAccount-01-01.png";
      } else {
        console.log("imgurl");
        console.log(u.imageURL);
        user.image = u.imageURL;
      }

      user.numCompleted = u.numCompleted;

      castle.quests.forEach(function(q) {
        if(q.takenBy === u.username && !q.completed ) {
          user.taskList.push({'task': q.title});
        }
      });

      tmpUsers.push(user);
    });

    var achievements = [];
    if(castle.game.monsterHealth < 50) {
      achievements.push({
        'image' : '/monsters/kraken/Kraken.png',
        'name' : 'Dealt lots of damage'
      });
    }

    if(parseInt(castle.game.castleHealth) > 70) {
      achievements.push({
        'image' : 'Castle-01-01.png',
        'name' : 'Little damage taken'
      });
    }

    if(parseInt(castle.numCompleted) > 10) {
      achievements.push({
        'image' : 'TeamInfo-01-01.png',
        'name' : 'Lots of tasks done'
      });
    } else if(parseInt(castle.numCompleted) > 5) {
      achievements.push({
        'image' : 'TeamInfo-01-01.png',
        'name' : 'Many tasks done'
      });
    }
    castle.members.forEach(function(m){
      if(parseInt(m.numCompleted) > 4) {
        achievements.push({
          'image' : 'PersonalAccount-01-01.png',
          'name' : m.username + ' has finished ' + m.numCompleted + ' tasks'
        });
      }
    });

    if(castle.members.length > 4) {
      achievements.push({
        'image' : 'Castle-01-01.png',
        'name' : 'Recruited many knights and ladies'
      });
    }


    if(achievements.length == 0) {
      achievements.push({
        'image' : 'TeamInfo-01-01.png',
        'name' : 'no achievements yet'
      });
    }

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

    users = tmpUsers.slice();
    users.sort(compareName);

    rankings = tmpUsers.slice();
    rankings.sort(compareCompleted);

    res.render('team', {
        'users': users,
        'castleName': castle.name,
        'rankings': rankings,
        'achievements' : achievements
    });
};
