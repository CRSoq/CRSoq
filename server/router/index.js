module.exports = function (app) {
    app.use('/login', require('./routes/login'));
    app.use('/calendario', require('./routes/calendario'));
    app.use('/asignaturas', require('./routes/asignaturas'));
    app.use('/cursos', require('./routes/cursos'));
    app.use('/clases', require('./routes/clases'));
    app.use('/sesion', require('./routes/sesion'));
    app.use('/preguntas', require('./routes/preguntas'));
    app.use('/estudiante', require('./routes/estudiante'));
};