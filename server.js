/**
 * Module dependencies.
 */

var PORT = 3000;

var express = require('express');
var http = require('http');
var path = require('path');
var handlebars = require('express3-handlebars');

var app = express();
var castle = require('./routes/castle');
var users = require('./routes/users');
var team = require('./routes/team');
var quests = require('./routes/quests');

var port = process.env.PORT || PORT;

app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', handlebars());
app.set('view engine', 'handlebars');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(app.router);
app.use(express.static(path.join(__dirname + '/public')));

if('development' == app.get('env')) {
    app.use(express.errorHandler());
}

// Add routes here
app.post('/signup/add', users.add);
app.post('/account/completeTask', quests.completeTask);
app.post('/account/reopenTask', quests.reopenTask);
app.get('/login', users.login);
app.get('/castle/select', castle.select);
app.get('/castle', castle.view);
app.get('/castle/join', castle.join);
app.get('/castle/build', castle.build);
app.get('/castle/team', team.view);
app.get('/account', quests.account)
app.post('/quests/add', quests.add);
app.get('/wizard', quests.view);
app.get('/complete', quests.taskDone);
// Example route
// app.get('/users', user.list);

http.createServer(app).listen(port);
console.log("Listening on port " + port);
