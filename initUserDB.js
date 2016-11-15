var mongoose = require('mongoose');
var models = require('./models');
var users_json = require('./data/usersDB.json');
var userIDs = [];

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
  models.User
      .find()
      .remove()
      .exec(function(){console.log("User table dropped"); addUsers();});

  //add users
  addUsers = function() {
    var i = users_json.length;
    users_json.forEach(function(u){
      var user = new models.User(u);
      user.save(function(err, user) {
          if (err) console.log(err);
          userIDs.push({'username': user.username, 'id': user._id});
          i--;
          if(i <= 0) {
            closeDB();
          }
      });
    });
  }

  //close db
  closeDB = function() {
    console.log(userIDs);
    mongoose.connection.close();
  }
});
