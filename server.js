var PORT = 3000;

var express = require('express');
var app = express();
var port = Number(process.env.PORT || PORT);

app.use(express.logger());
app.use(express.compress());

app.use(express.static(__dirname + '/static'));

app.listen(port);
