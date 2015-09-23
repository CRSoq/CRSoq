var express = require('express');
var path = require('path');
var http = require('http-server');
var app = express();

//app.use(express.static(__dirname = "/"));
app.use(express.static('../app'));
var server =app.listen(3000, function(){
    var host = server.address().address;
    var port = server.address().port;
    console.log("Server on: http://%s:%s", host, port);
});

//var mysql = require('mysql');
/*var connection = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : 'root',
    database: 'unocl_sitio'
});*/
/*
radio97unoApp.use(express.static(__dirname + "/public"));

connection.connect(function(error){
    if(!error){
        console.log('conectado a la db');
    }else{
        console.log('Error conexion db');
    }
});
radio97unoApp.get("/noticias",function(req,res) {

    connection.query('SELECT * FROM noticias', function(err, rows) {

        if (!err)
            res.json(rows);
        else
            console.log('Error while performing Query.');
    });
});
*/