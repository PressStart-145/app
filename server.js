/**
 * Module dependencies.
 */

var PORT = 3000;

var express = require('express');
var http = require('http');
var path = require('path');
var handlebars = require('express3-handlebars');
var bodyParser = require('body-parser'); // for reading POSTed form data into `req.body`
var expressSession = require('express-session');
var cookieParser = require('cookie-parser');

/* Cloudinary Image Hosting */
var cloudinary = require('cloudinary');
cloudinary.config({
    cloud_name: 'pressstart',
    api_key: '253161822796357',
    api_secret: '9vUKk4-tKlFrkk7rHai5tQrL27c'
});
/*
cloudinary.uploader.upload(imgURL, function(result) {
    console.log(result);
});*/

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

app.use(cookieParser());

app.use(expressSession({secret:'dank M3M35'}));

app.use(bodyParser());

app.configure(function(){
    app.use(express.methodOverride());
    app.use(express.multipart());
   });

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
app.post('/login/sendPassword', users.sendPassword);
app.get('/login/forgotPassword', users.forgotPassword);
app.post('/signup/add', users.add);
app.post('/account/completeTask', quests.completeTask);
//app.post('/account/reopenTask', quests.reopenTask);
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
app.get('/wizard2', quests.view2);
app.get('/complete', quests.taskDone);
app.get('/signup', users.signup);

http.createServer(app).listen(port);
console.log("Listening on port " + port);
