/**
 * Module dependencies.
 */

var PORT = 3000;

var express = require('express');
var http = require('http');
var path = require('path');
var handlebars = require('express3-handlebars');

/* Database Code */
var mongoose = require('mongoose');
var local_database_uri  = 'mongodb://localhost/';
//Database URI for both apps
var mongoldb_uri = 'mongodb://heroku_1vr3s51g:9s5cs0ivlt4ineh760d7ndfa4u@ds155097.mlab.com:55097/heroku_1vr3s51g';
var database_uri = mongoldb_uri || local_database_uri;
mongoose.Promise = global.Promise;
mongoose.connect(database_uri);

/*
  d8888b. d8888b.      .d8888. d88888b d888888b db    db d8888b.
  88  `8D 88  `8D      88'  YP 88'     `~~88~~' 88    88 88  `8D
  88   88 88oooY'      `8bo.   88ooooo    88    88    88 88oodD'
  88   88 88~~~b.        `Y8b. 88~~~~~    88    88    88 88~~~
  88  .8D 88   8D      db   8D 88.        88    88b  d88 88
  Y8888D' Y8888P'      `8888Y' Y88888P    YP    ~Y8888P' 88
   
  node initUserDB.js; node initQuestDB.js; node initCastleDB.js; node linkQuestDB.js; node linkCastleDB.js
*/

// DB TESTING
// var db = mongoose.connection;
// db.on('error', console.error.bind(console, 'connection error:'));
// db.once('open', function() {
//     var kittySchema = mongoose.Schema({
//         name: String
//     });
//     var Kitten = mongoose.model('Kitty', kittySchema);
//     var silence = new Kitten({name: "silence"});
//
//     silence.save(function(err, cat){
//         if (err) console.log(err);
//         console.log("saving");
//         console.log(cat);
//         Kitten
//           .find()
//           .remove()
//           .exec(function() {
//             console.log("Kitty table dropped");
//             mongoose.connection.close();
//         });
//     });
// });

var app = express();
var castle = require('./routes/castle');
var users = require('./routes/users');
var team = require('./routes/team');
var quests = require('./routes/quests');

var port = process.env.PORT || PORT;


var dataCastle = require("./data/castles.json");
var dataUsers = require("./data/users.json");
app.locals.currentUser = dataUsers.users[0];
app.locals.currentCastle = dataCastle.castles[0];

app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', handlebars());
app.set('view engine', 'handlebars');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(app.router);
app.use(express.static(path.join(__dirname + '/public'), {
    extensions: ['html', 'htm']
}));

if('development' == app.get('env')) {
    app.use(express.errorHandler());
}

// Add routes here
app.post('/login/forgotPassword', users.sendPassword);
app.post('/signup/add', users.add);
app.post('/account/completeTask', quests.completeTask);
app.post('/account/reopenTask', quests.reopenTask);
app.get('/account/details', users.details);
app.post('/account/update', users.update);
app.post('/wizard/acceptTask', quests.acceptTask);
app.get('/login', users.login);
app.post('/castle/add', castle.add);
app.post('/castle/select', castle.select);
app.get('/castle/select', castle.select);
app.get('/castle', castle.view);
app.get('/castle/join', castle.join);
app.get('/castle/build', castle.build);
app.get('/castle/team', team.view);
app.get('/account', quests.account)
app.post('/wizard/add', quests.add);
app.get('/wizard', quests.view);
app.get('/complete', quests.taskDone);
app.get('/signup', users.signup);

http.createServer(app).listen(port);
console.log("Listening on port " + port);
