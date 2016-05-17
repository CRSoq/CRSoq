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
                res.status(500);
                return res.json({'success':false, 'err': error});
            }else{
                res.status(200);
                return res.json({'success':true, 'id_user':result.insertId});
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
                res.status(500);
                return res.json({'success':false, 'err':error});
            }else{
                res.status(200);
                return res.json({'success':true, 'result':result});
            }
        });
    }
});

router.post('/obtenerEstudiante', function (req, res) {
    if(!req.body) {
        return res.sendStatus(400);
    }else{
        connection.query('SELECT id_user, rut, nombre, apellido, usuario, clave, token FROM estudiante WHERE rut = ?',[req.body.rut], function (error, row) {
            if(error){
                res.status(500);
                return res.json({'success':false, 'err':error});
            }else{
                res.status(200);
                return res.json({'success':true, 'result':row[0]});
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
        connection.query('SELECT c.id_curso, e.id_user, e.nombre, e.apellido, e.usuario, e.clave, e.rut FROM pertenece ec INNER JOIN estudiante e ON ec.id_user=e.id_user INNER JOIN curso c ON ec.id_curso=c.id_curso WHERE c.id_curso = ?',[req.body.id_curso], function (error, rows) {
            if(error){
                return res.json({'success':false, 'err':error});
            }else{
                return res.json({'success':true, 'result':rows});
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
                res.status(500);
                return res.json({'success':false, 'err':error});
            }else{
                res.status(200);
                return res.json({'success':true});
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
                res.status(500);
                return res.json({'success':false, 'err':error});
            }else{
                res.status(200);
                return res.json({'success':true});
            }
        });
    }
});
module.exports = router;