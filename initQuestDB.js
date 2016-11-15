var mongoose = require('mongoose');
var models = require('./models');
var quests_json = require('./data/questsDB.json');
var questIDs = [];

//Before-grading URI
var mongoldb_uri = 'mongodb://heroku_1vr3s51g:9s5cs0ivlt4ineh760d7ndfa4u@ds155097.mlab.com:55097/heroku_1vr3s51g';
//Press-start URI
//var mongoldb_uri = 'mongodb://heroku_gc5bsfx7:75str8ep8qk1q7e55eiof8pmln@ds155097.mlab.com:55097/heroku_gc5bsfx7';
mongoose.Promise = global.Promise;
mongoose.connect(mongoldb_uri);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  //drop table
  models.Quest
      .find()
      .remove()
      .exec(function(){console.log("Quest table dropped"); addQuests();});

  //add quests
  addQuests = function() {
    var i = quests_json.length;
    quests_json.forEach(function(q){
      var quest = new models.Quest(q);
      quest.save(function(err, quest) {
          if (err) console.log(err);
          questIDs.push({'title': quest.title, 'id': quest._id});
          i--;
          if(i <= 0) {
            closeDB();
          }
      });
    });
  }

  //close db
  closeDB = function() {
    console.log(questIDs);
    mongoose.connection.close();
  }
});
