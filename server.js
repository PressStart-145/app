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


app.locals.currentUser = {
    "name": "Test User",
    "username": "123",
    "password": "123",
    "email": "123@mail.com",
    "imageURL": ""
};

app.locals.currentUser = {
    "name": "Test Castle",
    "admin": "Test User",
    "members": [
        {
            "username": "123",
            "numCompleted": 0
        }
    ],
    "quests": [
        {
            "title": "Test task",
            "description": "test description",
            "level": "99",
            "deadline": "11/10/2016",
            "takenBy": "",
            "completed": false
        },
        {
            "title": "Test task",
            "description": "test description",
            "level": "100",
            "deadline": "11/10/2016",
            "takenBy": "",
            "completed": false
        },
        {
            "title": "Test task",
            "description": "test description",
            "level": "10",
            "deadline": "11/10/2016",
            "takenBy": "",
            "completed": false
        },
        {
            "title": "Test task",
            "description": "test description",
            "level": "1",
            "deadline": "11/10/2016",
            "takenBy": "",
            "completed": false
        },
        {
            "title": "Test task",
            "description": "test description",
            "level": "2",
            "deadline": "11/10/2016",
            "takenBy": "",
            "completed": false
        },
        {
            "title": "Test task",
            "description": "test description",
            "level": "-100",
            "deadline": "11/10/2016",
            "takenBy": "",
            "completed": false
        }
    ],
    "numCompleted": 0,
    "game": {
        "castleHealth": 100,
        "monsterHealth": 100,
        "items": []
    }
};

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
// Example route
// app.get('/users', user.list);

http.createServer(app).listen(port);
console.log("Listening on port " + port);
