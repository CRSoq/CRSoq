var MySQLConnectionManager = require('mysql-connection-manager');
var config      = require('../../../server/config').config;
var options = {
    host: config.db_host,
    port: config.db_port,
    user: config.db_user,
    password: config.db_pass,
    database: config.db_name,
    autoReconnect: true,
    keepAlive: true,
    multipleStatements: true
};

var manager = new MySQLConnectionManager(options);

manager.on('connect', function(connection) {
    console.log('DB Connected\nServer CRSoq Ready!');
});

manager.on('reconnect', function(connection) {
});

manager.on('disconnect', function() {
    console.log('DB Disconnected');
});

module.exports.database = manager.connection;