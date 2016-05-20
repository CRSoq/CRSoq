var MySQLConnectionManager = require('mysql-connection-manager');

var options = {
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'root',
    database: 'crs',
    autoReconnect: true,
    keepAlive: true,
    multipleStatements: true
};

var manager = new MySQLConnectionManager(options);

manager.on('connect', function(connection) {
    console.log('DB Connected');
});

manager.on('reconnect', function(connection) {
});

manager.on('disconnect', function() {
    console.log('DB Disconnected');
});

module.exports.database = manager.connection;