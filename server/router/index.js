module.exports = function (app) {
    app.use('/login', require('./routes/login'));
    app.use('/cursos', require('./routes/cursos'));
    app.use('/clases', require('./routes/clases'));
};