/*
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var app = require('express')();
var http = require('http').Server(app);
var path = require('path');
var bodyParser = require('body-parser');
var io = require('socket.io')(http);
*/
//mac os x
/*
var appRootFolder = function(dir,level){
    var arr = dir.split("/");
    arr.splice(arr.length - level,level);
    var rootFolder = arr.join('/');
    return rootFolder;
};
*/
//windows
/*
var appRootFolder = function(dir,level){
    var arr = dir.split("\\");
    arr.splice(arr.length - level,level);
    var rootFolder = arr.join('\\');
    return rootFolder;
};

io.on('connection', function(socket){
    console.log('user '+socket);
});

app.use(bodyParser.json());
var root = appRootFolder(__dirname,1);
app.use(express.static(root+"/app"));
app.listen(3000);

var router = require('./router')(app);
// Error Handling
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
});


module.exports = app;
*/

var appRootFolder = function(dir,level){
    var arr = dir.split("\\");
    arr.splice(arr.length - level,level);
    var rootFolder = arr.join('\\');
    return rootFolder;
};
var path        = require('path');
var bodyParser  = require('body-parser');

var express     = require('express');
var app         = require('express')();
var http        = require('http').Server(app);
var io          = require('socket.io')(http);
var root        = appRootFolder(__dirname,1);

var on          = require('./controllers/on')(io);

app.use(bodyParser.json());
app.use(express.static(root+"/app"));

var router = require('./router')(app);

http.listen(3000);

module.exports = app;
