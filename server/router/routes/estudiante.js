var express     = require('express');
var router      = express.Router();
var mysql       = require('mysql');
var db          = require('./config');
var _           = require('lodash');
var connection  = mysql.createConnection(db.database);

router.post('/crearEstudiante', function (req, res) {
    if(!req.body){
        return res.sendStatus(400);
    }else{
        connection.query('INSERT INTO estudiante (nombre,apellido,usuario,clave,rut) VALUES (?,?,?,?,?)',[req.body.nombre,req.body.apellido,req.body.usuario,req.body.clave, req.body.rut], function (error, result) {
            if(error){
                res.json({'error':true, 'err':error});
            }else{
                res.json({'id_user':result.insertId});
            }
        });
    }
});

router.post('/asignarCursoAEstudiante', function (req, res) {
    if(!req.body) {
        return res.sendStatus(400);
    }else{
        connection.query('INSERT INTO pertenece (id_user,id_curso) VALUES (?,?)',[req.body.id_user,req.body.id_curso], function (error, result) {
            if(error){
                return res.json({'error':true,'err':error});
            }else{
                return res.json({'result':result});
            }
        });
    }
});

router.post('/obtenerEstudiante', function (req, res) {
    if(!req.body) {
        return res.sendStatus(400);
    }else{
        connection.query('SELECT * FROM estudiante WHERE rut = ?',[req.body.rut], function (error, row) {
            if(error){
                return res.json({'error':true, 'err':error});
            }else{
                return res.json({'estudiante':row});
            }
        });
    }
});
/*
router.post('/obtenerEstudiantes', function (req, res) {
    if(!req.body){
        return res.sendStatus(400);
    }else{
        connection.query('SELECT * FROM estudiantes', function (error, rows) {
            if(error){
                return res.json({'error':true, 'err':error});
            }else{
                return res.json({'estudiantes':rows});
            }
        });
    }
});
*/
router.post('/obtenerEstudiantesPorCurso', function (req, res) {
    if(!req.body){
        return res.sendStatus(400);
    }else{
        connection.query('SELECT id_user FROM pertenece WHERE id_curso = ?',[req.body.id_curso], function (error, rows) {
            if(error){
                return res.json({'error':true, 'err':error});
            }else{
                return res.json({'estudiantes':rows});
            }
        });
    }
});
router.post('/obtenerCursosPorEstudiante', function (req, res) {
    if(!req.body){
        return res.sendStatus(400);
    }else{
        connection.query('SELECT id_curso FROM pertenece WHERE id_user = ?',[req.body.id_user], function (error, rows) {
            if(error){
                return res.json({'error':true, 'err':error});
            }else{
                return res.json({'cursos':rows});
            }
        });
    }
});
router.post('/actualizarEstudiante', function (req, res) {
    if(!req.body){
        return res.sendStatus(400);
    }else{
        connection.query('UPDATE estudiante SET nombre = ?, apellido = ?, usuario = ?, clave = ?, rut = ?  WHERE id_user = ?',[req.body.nombre, req.body.apellido, req.body.usuario, req.body.clave, req.body.rut, req.body.id_user], function (error) {
            if(error){
                return res.json({'error': true,'err':error.code});
            }else{
                return res.json({'error': false});
            }
        });
    }
});
router.post('/eliminarEstudianteDelCurso', function (req, res) {
    if(!req.body){
        return res.sendStatus(400);
    }else{
        connection.query('DELETE FROM pertenece WHERE id_user = ? AND id_curso = ?',[req.body.id_user, req.body.id_curso], function (error) {
            if(error){
                return res.json({'error': true,'err':error.code});
            }else{
                return res.json({'error': false});
            }
        });
    }
});
/*
router.post('/eliminarEstudiante', function (req, res) {
    if(!req.body){
        return res.sendStatus(400);
    }else{
        connection.query('DELETE FROM estudiante WHERE id_user = ? AND rut = ?',[req.body.id_user, req.body.rut], function (error) {
            if(error){
                return res.json({'error': true,'err':error.code});
            }else{
                return res.json({'error': false});
            }
        });
    }
});
*/
module.exports = router;