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
router.post('/obtenerTopicos', function (req, res) {
    if(!req.body){
        return res.sendStatus(400);
    }else{
	connection.query('SELECT * FROM topico WHERE id_asignatura=?',[req.body.id_asignatura], function (error, rows) {
            if(error){
                return res.json({'success':false, 'err':error});
            }else{
                return res.json({'success':true, 'result':rows});
            }
        });
    }
});
router.post('/crearTopico', function (req, res) {
    if(!req.body){
        return res.sendStatus(400);
    }else{
        connection.query('INSERT INTO topico (nombre, id_asignatura) VALUES (?,?)',[req.body.nombre, req.body.id_asignatura], function (error, result) {
            if(!error){
                res.status(200);
                return res.json({'success':true, 'id_topico':result.insertId});
            }else{
                res.status(500);
                return res.json({'success':false, 'err':error});
            }
        });
    }
});
router.post('/editarTopico', function (req, res) {
    if(!req.body){
        return res.sendStatus(400);
    }else{
        connection.query('UPDATE topico SET nombre = ?, id_asignatura = ? WHERE id_topico = ?',[req.body.nombre, req.body.id_asignatura, req.body.id_topico], function (error, rows) {
            if(error){
                return res.json({'success':false, 'err':error});
            }else{
                return res.json({'success':true});
            }
        });
    }
});
router.post('/eliminarTopico', function (req, res) {
    if(!req.body){
        return res.sendStatus(400);
    }else{
        connection.query('DELETE FROM topico WHERE id_topico = ?',[req.body.id_topico], function (error) {
            if(error){
                return res.json({'success':false, 'err':error});
            }else{
                return res.json({'success':true});
            }
        });
    }
});

router.post('/obtenerTemas', function (req, res) {
    if(!req.body){
        return res.sendStatus(400);
    }else{
        connection.query('SELECT te.nombre, tx.nombre AS nombre_topico, te.id_tema, te.id_topico FROM tema te, topico tx WHERE te.id_topico=tx.id_topico AND tx.id_asignatura=?',[req.body.id_asignatura], function (error, rows) {
            if(error){
                return res.json({'success':false, 'err':error});
            }else{
                return res.json({'success':true, 'result':rows});
            }
        });
    }
});
router.post('/crearTema', function (req, res) {
    if(!req.body){
        return res.sendStatus(400);
    }else{
        connection.query('INSERT INTO tema (nombre, id_topico) VALUES (?,?)',[req.body.nombre, req.body.id_topico], function (error, result) {
            if(!error){
                res.status(200);
                return res.json({'success':true, 'id_tema':result.insertId, 'id_topico':result});
            }else{
                res.status(500);
                return res.json({'success':false, 'err':error});
            }
        });
    }
});
router.post('/editarTema', function (req, res) {
    if(!req.body){
        return res.sendStatus(400);
    }else{
        connection.query('UPDATE tema SET nombre = ?, id_topico = ? WHERE id_tema = ?',[req.body.nombre, req.body.id_topico, req.body.id_tema], function (error, rows) {
            if(error){
                return res.json({'success':false, 'err':error});
            }else{
                return res.json({'success':true});
            }
        });
    }
});
router.post('/eliminarTema', function (req, res) {
    if(!req.body){
        return res.sendStatus(400);
    }else{
        connection.query('DELETE FROM tema WHERE id_tema = ?',[req.body.id_tema], function (error) {
            if(error){
                return res.json({'success':false, 'err':error});
            }else{
                return res.json({'success':true});
            }
        });
    }
});
module.exports = router;
