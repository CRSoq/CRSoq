/* jshint node: true */
'use strict';
var express     = require('express');
var router      = express.Router();
var connection  = require('./connection').database;
router.post('/obtenerActividadesCurso', function (req, res) {
    if(!req.body){
        return res.sendStatus(400);
    }else{
        connection.query('SELECT id_actividad, id_clase, titulo_act, estado_actividad FROM actividad WHERE id_curso = ?',[req.body.id_curso], function (error, rows) {
            if(error){
                return res.json({'success':false, 'err':error});
            }else{
                return res.json({'success':true, 'result':rows});
            }
        });
    }
});
router.post('/crearActividad', function (req, res) {
    if(!req.body){
        return res.sendStatus(400);
    }else{
        connection.query('INSERT INTO actividad (id_clase,id_curso,titulo_act,estado_actividad) VALUES (?,?,?,?)',[req.body.id_clase,req.body.id_curso,req.body.titulo_act,req.body.estado_actividad], function (error, result) {
            if(error){
                return res.json({'success':false, 'err':error});
            }else{
                return res.json({'success':true, 'result':result.insertId});
            }
        });
    }
});
router.post('/eliminarActividad', function (req, res) {
    if(!req.body){
        return res.sendStatus(400);
    }else{
        connection.query('DELETE FROM actividad WHERE id_actividad = ? ',[req.body.id_actividad], function (error) {
            if(error){
                return res.json({'success':false, 'err':error});
            }else{
                return res.json({'success':true});
            }
        });
    }
});
router.post('/actualizarActividad', function (req, res) {
    if(!req.body){
        return res.sendStatus(400);
    }else{
        connection.query('UPDATE actividad SET id_clase = ?, titulo_act = ? WHERE id_actividad = ? ',[req.body.id_clase,req.body.titulo_act,req.body.id_actividad], function (error) {
            if(error){
                return res.json({'success':false, 'err':error});
            }else{
                return res.json({'success':true});
            }
        });
    }
});
router.post('/actualizarEstadoParticipacionActividad', function (req, res) {
    if(!req.body){
        return res.sendStatus(400);
    }else{
        connection.query('UPDATE participa SET estado_part_act =  ? WHERE id_user = ? AND id_actividad = ?',[req.body.estado_part_act,req.body.id_user,req.body.id_actividad], function (error) {
            if(error){
                return res.json({'success':false, 'err':error});
            }else{
                return res.json({'success':true});
            }
        });
    }
});
router.post('/asignarParticipanteActividad', function (req, res) {
    if(!req.body){
        return res.sendStatus(400);
    }else{
        connection.query('INSERT INTO participa (id_user,id_actividad,estado_part_act) VALUES (?,?,?)',[req.body.id_user,req.body.id_actividad,req.body.estado_part_act], function (error) {
            if(error){
                return res.json({'success':false, 'err':error});
            }else{
                return res.json({'success':true});
            }
        });
    }
});
router.post('/obtenerParticipantesActividad', function (req, res) {
    if(!req.body){
        return res.sendStatus(400);
    }else{
        connection.query('SELECT e.id_user, e.nombre, e.apellido, e.rut, e.usuario, part.estado_part_act FROM participa part INNER JOIN estudiante e ON part.id_user = e.id_user WHERE part.id_actividad = ?',[req.body.id_actividad], function (error, rows) {
            if(error){
                return res.json({'success':false, 'err':error});
            }else{
                return res.json({'success':true, 'result':rows});
            }
        });
    }
});
router.post('/eliminarParticipacionActividad', function (req, res) {
    if(!req.body){
        return res.sendStatus(400);
    }else{
        connection.query('DELETE FROM participa WHERE id_actividad = ?',[req.body.id_actividad], function (error) {
            if(error){
                return res.json({'success':false, 'err':error});
            }else{
                return res.json({'success':true});
            }
        });
    }
});
router.post('/eliminarParticipanteActividad', function (req, res) {
    if(!req.body){
        return res.sendStatus(400);
    }else{
        connection.query('DELETE FROM participa WHERE id_actividad = ? AND id_user = ?',[req.body.id_actividad, req.body.id_user], function (error) {
            if(error){
                return res.json({'success':false, 'err':error});
            }else{
                return res.json({'success':true});
            }
        });
    }
});
router.post('/actualizarEstadoActividad', function (req, res) {
    if(!req.body){
        return res.sendStatus(400);
    }else{
        connection.query('UPDATE actividad SET estado_actividad =  ? WHERE id_actividad = ?',[req.body.estado_actividad,req.body.id_actividad], function (error) {
            if(error){
                return res.json({'success':false, 'err':error});
            }else{
                return res.json({'success':true});
            }
        });
    }
});
router.post('/obtenerParticipacionPorEstudiante', function (req, res) {
    if(!req.body){
        return res.sendStatus(400);
    }else{
        connection.query('SELECT id_actividad, id_user, estado_part_act FROM participa WHERE id_user = ?',[req.body.id_user], function (error, rows) {
            if(error){
                return res.json({'success':false, 'err':error});
            }else{
                return res.json({'success':true, 'result':rows});
            }
        });
    }
});
module.exports = router;