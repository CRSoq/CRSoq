var express     = require('express');
var router      = express.Router();
var mysql       = require('mysql');
var db          = require('./config');
var _           = require('lodash');
var connection  = mysql.createConnection(db.database);

router.post('/crearPregunta', function (req, res) {
    if(!req.body){
        return res.sendStatus(400);
    }else{
        connection.query('INSERT INTO pregunta (id_curso,id_clase,pregunta) VALUES (?,?,?)',[req.body.id_curso,req.body.id_clase,req.body.pregunta], function (error, result) {
            if(error){
                return res.json({'error':true ,'err':error});
            }else{
                return res.json({'id_pregunta':result.insertId});
            }
        });
    }

});

router.post('/obtenerPreguntaPorId', function (req, res) {
    if(!req.body){
        return res.sendStatus(400);
    }else{
        connection.query('SELECT * FROM pregunta WHERE id_pregunta = ?',[req.body.id], function (error, rows) {
            if(!error){
                return res.json(rows[0]);
            }else{
                return res.json({'error':true,'err':error});
            }
        });
    }
});

router.post('/obtenerPreguntasClase', function (req, res) {
    if(!req.body){
        return res.sendStatus(400);
    }else{
        connection.query('SELECT * FROM pregunta WHERE id_clase = ?',[req.body.id_clase], function (error, rows) {
            if(!error){
                return res.json(rows);
            }else{
                return res.json({'error':true,'err':error});
            }
        });
    }
});

router.post('/obtenerPreguntasCurso', function (req, res) {
    if(!req.body){
        return res.sendStatus(400);
    }else{
        connection.query('SELECT * FROM pregunta WHERE id_curso = ?',[req.body.id_curso], function (error, rows) {
            if(error){
                return res.json({'error':true,'err':error});
            }else{
                return res.json(rows);
            }
        });
    }
});
router.post('/actualizarPregunta', function (req, res) {
    if(!req.body){
        return res.sendStatus(400);
    }else{
        connection.query('UPDATE pregunta SET id_clase = ?, pregunta = ? WHERE id_pregunta = ?',[req.body.id_clase, req.body.pregunta, req.body.id_pregunta], function (error) {
            if(error){
                return res.json({'error': true, 'err':error});
            }else{
                return res.json({'error': false});
            }
        });
    }
});
router.post('/eliminarPregunta', function (req, res) {
    if(!req.body){
        return res.sendStatus(400);
    }else{
        connection.query('DELETE FROM pregunta WHERE id_pregunta = ?',[req.body.id_pregunta], function (error) {
            if(error){
                return res.json({'error': true, 'err':error});
            }else{
                return res.json({'error': false});
            }
        });
    }
});
router.post('/asignarGanador', function (req, res) {
    if(!req.body){
        return res.sendStatus(400);
    }else{
        connection.query('UPDATE pregunta SET id_user = ? WHERE id_pregunta = ?',[req.body.id_user, req.body.pregunta.id_pregunta], function (error) {
            if(error){
                return res.json({'error': true, 'err':error});
            }else{
                return res.json({'error': false});
            }
        });
    }
});
module.exports = router;