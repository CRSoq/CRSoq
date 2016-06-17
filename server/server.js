var path        = require('path');
var bodyParser  = require('body-parser');

var express     = require('express');
var app         = require('express')();
var http        = require('http').Server(app);
var io          = require('socket.io')(http);
var root        = path.resolve(".");

var on          = require('./controllers/on')(io);
var config      = require('./config').config;

http.listen(config.server_port,config.server_ip);
app.use(bodyParser.json());
app.use(express.static(root+"/app"));

var router = require('./router')(app);

console.log('Server running on http://'+config.server_ip+':'+config.server_port+'\nCTRL+C to stop the server');

module.exports = app;
