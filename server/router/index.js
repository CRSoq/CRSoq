module.exports = function (app) {
    app.use('/login', require('./routes/login'));
};