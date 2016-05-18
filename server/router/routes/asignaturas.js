var express     = require('express');
var router      = express.Router();
var _           = require('lodash');
var connection  = require('./connection').database;

router.post('/obtenerAsignaturas', function (req, res) {
    if(!req.body){
        return res.sendStatus(400);
    }else{
        connection.query('SELECT id_asignatura, nombre_asignatura FROM asignatura', function (error, rows) {
            if(error){
                return res.json({'success':false, 'err':error});
            }else{
                return res.json({'success':true, 'result':rows});
            }
        });
    }
});
router.post('/crearAsignatura', function (req, res) {
    if(!req.body){
        return res.sendStatus(400);
    }else{
        connection.query('INSERT INTO asignatura (nombre_asignatura) VALUES (?)',[req.body.nombre_asignatura], function (error, result) {
            if(error){
                return res.json({'success':false, 'err':error});
            }else{
                return res.json({'success':true, 'id_asignatura':result.insertId});
            }
        });
    }
});
router.post('/editarAsignatura', function (req, res) {
    if(!req.body){
        return res.sendStatus(400);
    }else{
        connection.query('UPDATE asignatura SET nombre_asignatura = ? WHERE id_asignatura = ?',[req.body.nombre_asignatura, req.body.id_asignatura], function (error, result) {
            if(error){
                return res.json({'success':false, 'err':error});
            }else{
                return res.json({'success':true});
            }
        });
    }
});
router.post('/obtenerListaCursosAsignatura', function (req, res) {
    if(!req.body){
        return res.sendStatus(400);
    }else{
        connection.query('SELECT id_curso, id_calendario, ano, semestre FROM curso WHERE id_asignatura=?',[req.body.id_asignatura], function (error, rows) {
            if(error){
                return res.json({'success':false, 'err':error});
            }else{
                return res.json({'success':true, 'result':rows});
            }
        });
    }
});
module.exports = router;