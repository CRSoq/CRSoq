var path        = require('path');
var bodyParser  = require('body-parser');

var express     = require('express');
var app         = require('express')();
var http        = require('http').Server(app);
var io          = require('socket.io')(http);
var root        = path.resolve(".");

var on          = require('./controllers/on')(io);
http.listen(3000,'192.168.1.100');
app.use(bodyParser.json());
app.use(express.static(root+"/app"));

var router = require('./router')(app);

console.log('Server running on port: 3000\nCTRL+C to stop the server');

module.exports = app;
