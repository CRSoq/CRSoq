var MySQLConnectionManager = require('mysql-connection-manager');

var options = {
    host: 'localhost',
    port: 3306,
    user: 'db_user',
    password: 'db_pass',
    database: 'db_name',
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