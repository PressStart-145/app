var mongoose = require('mongoose');
var models = require('./models');
var castles_json = require('./data/castlesDB.json');
var gameIDs = [];
var castlesIDs = [];

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
  models.Game
      .find()
      .remove()
      .exec(function(){
        console.log("Game table dropped");
        models.Castle
            .find()
            .remove()
            .exec(function() {
              console.log("Castle table dropped");
              addGames();
            });
        });

  //add castles and game
  addGames = function() {
    var i = castles_json.length;
    castles_json.forEach(function(c){
      var game = new models.Game(c.game);
      game.save(function(err, game) {
          if (err) console.log(err);
          gameIDs.push(game._id);
          i--;
          if(i <= 0) {
            addCastles();
          }
      });
    });
  }

  addCastles = function() {
    var i = castles_json.length;
    castles_json.forEach(function(c){
      var castle = new models.Castle({
        "name": c.name
      });
      castle.save(function(err, castle) {
          if (err) console.log(err);
          castlesIDs.push(castle._id);
          i--;
          if(i <= 0) {
            printCastles();
          }
      });
    });
  }


  //print statements
  printCastles = function() {
    console.log("Game IDs");
    console.log(gameIDs);
    console.log("Castle IDs");
    console.log(castlesIDs);

    // models.Castle.find()
    //  .populate('game')
    //  .exec(function(err, castles){
    //       if(err) console.log(err);
    //       if(castles == null) {
    //         console.log("Castles table is empty");
    //         console.log(castles);
    //       } else {
    //         castles.forEach(function(castle){
    //           if(castles.game == null) {
    //             console.log(castle.name + " has no game lol");
    //           } else {
    //             console.log(castle.name + " is at " + castle.game.castleHealth + " hp and its monster is at " + castle.game.monsterHealth + " hp");
    //           }
    //         });
    //       }
    //       closeDB();
    //  });
    closeDB();
  }
  //close db
  closeDB = function() {
    mongoose.connection.close();
  }
});
