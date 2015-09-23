var express = require('express');
var path = require('path');
var http = require('http-server');

var app = express();

var appRootFolder = function(dir,level){
    var arr = dir.split('/');
    arr.splice(arr.length - level,level);
    var rootFolder = arr.join('/');
    return rootFolder;
};

var root = appRootFolder(__dirname,1);
app.use(express.static(root+"/app"));
app.listen(3000);