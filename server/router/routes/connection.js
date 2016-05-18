var mysql       = require('mysql');
var db          = require('./config');
var connection  = mysql.createConnection(db.database);
var MySQLConnectionManager = require('mysql-connection-manager');
var manager = new MySQLConnectionManager(db.database, connection);



module.exports.database = connection;