var express = require('express');
var path = require('path');
var http = require('http-server');
var bodyParser = require('body-parser');
var app = express();

//mac os x
var appRootFolder = function(dir,level){
    var arr = dir.split("/");
    arr.splice(arr.length - level,level);
    var rootFolder = arr.join('/');
    return rootFolder;
};

//windows
/*var appRootFolder = function(dir,level){
    var arr = dir.split("\\");
    arr.splice(arr.length - level,level);
    var rootFolder = arr.join('\\');
    return rootFolder;
};*/

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