/**
 * Module dependencies.
 */

var PORT = 3000;

var fs = require('fs');
var express = require('express');
var http = require('http');
var path = require('path');
var handlebars = require('express3-handlebars');

var app = express();
var castle = require('./routes/castle');
var castles = require('./routes/castles');
var login = require('./routes/login');
var ranking = require('./routes/ranking');

var port = process.env.PORT || PORT;

app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', handlebars());
app.set('view engine', 'handlebars');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(app.router);

app.use(express.static(path.join(__dirname + '/public')));

if('development' == app.get('env')) {
    app.use(express.errorHandler());
}

// Add routes here
app.get('/', login.view);
app.get('/castles/:userName', castles.view);
app.get('/castle/', castle.view);
app.get('/castle/user/join', castle.join);
app.get('/castle/team/ranking', ranking.view);
// Example route
// app.get('/users', user.list);

http.createServer(app).listen(port);
