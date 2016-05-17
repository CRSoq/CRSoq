var express     = require('express');
var router      = express.Router();
var mysql       = require('mysql');
var db          = require('./config');
var _           = require('lodash');
var connection  = mysql.createConnection(db.database);

router.post('/crearSesion', function (req, res) {
    if(!req.body){
        return res.sendStatus(400);
    }else{
        connection.query('INSERT INTO sesion (id_clase,estado_sesion) VALUES (?,?)',[req.body.id_clase,req.body.estado_sesion], function (error, result) {
            if(error){
                return res.json({'error':true ,'err':error});
            }else{
                return res.json({'id_sesion':result.insertId});
            }
        });
    }
});
router.post('/obtenerSesion', function (req, res) {
    if(!req.body){
        return res.sendStatus(400);
    }else{
        connection.query('SELECT * FROM sesion WHERE id_clase = ?',[req.body.id_clase], function (error, rows) {
            if(!error && rows.length>0){
                return res.json(rows);
            }else{
                return res.json({'error':true ,'err':error});
            }
        });
    }
});
/*
router.post('/obtenerSesionPreguntas', function (req, res) {
    if(!req.body){
        return res.sendStatus(400);
    }else{
        connection.query('SELECT * FROM preguntas WHERE id_clase = ?',[req.body.id_clase], function (error, rows) {
            if(!error && rows.length>0){
                return res.json(rows);
            }else{
                return res.json({'error':true ,'err':error});
            }
        });
    }
});
*/
router.post('/actualizarSesionClase', function (req, res) {
    if(!req.body){
        return res.sendStatus(400);
    }else{
        connection.query('UPDATE clase SET estado_sesion = ? WHERE id_sesion = ?',[req.body.estado_sesion, req.body.id_clase], function (error) {
            if(error){
                return res.json({'error':true ,'err':error});
            }else{
                return res.json({'error': false});
            }
        });
    }
});

module.exports = router;