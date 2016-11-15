var mongoose = require('mongoose');
var models = require('./models');
var userIDs = [];
var questLength = 0;

getRandomUserId = function() {
  var result = new mongoose.Types.ObjectId;
  var rate = 0.20;
  if(Math.random() > rate) { // 20 percent of quests are not taken
    var index = Math.floor((Math.random() * userIDs.length));
    result = userIDs[index].id;
  }
  return result;
}

//Before-grading URI
var mongoldb_uri = 'mongodb://heroku_1vr3s51g:9s5cs0ivlt4ineh760d7ndfa4u@ds155097.mlab.com:55097/heroku_1vr3s51g';
//Press-start URI
//var mongoldb_uri = 'mongodb://heroku_gc5bsfx7:75str8ep8qk1q7e55eiof8pmln@ds155097.mlab.com:55097/heroku_gc5bsfx7';
mongoose.Promise = global.Promise;
mongoose.connect(mongoldb_uri);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  //get user IDs
  models.User
      .find({}, function(err, users) {
        users.forEach(function(u) {
          userIDs.push({'username': u.username, 'id': u._id});
        });
        updateQuests();
      });

  //update quests to have user id linked to it
  updateQuests = function() {
    models.Quest
        .find()
        .exec(function(err, quests){
          questLength = quests.length;
          quests.forEach(function(q){
            models.Quest.update({ _id: q._id }
                              , { $set: { takenBy: getRandomUserId() }}
                              , function(err, raw){
                                  if (err) console.log(err);
                                  checkCloseDB();
                                });
          });
        });
  }

  //close db
  checkCloseDB = function() {
    questLength--;
    console.log("Quests left to link: " + questLength);
    if (questLength <= 0) {
      printQuests();
    }
  }

  printQuests = function() {
    console.log("printing linked quests");
    models.Quest.find()
     .populate('takenBy')
     .exec(function(err, quests){
          quests.forEach(function(quest){
            if(quest.takenBy == null) {
              console.log(quest.title + " is up for grabs ");
            } else {
              console.log(quest.title + " was taken by " + quest.takenBy.name);
            }
          });
          closeDB();
     });
  }

  closeDB = function() {
    console.log("closing db");
    mongoose.connection.close();
  }
});
