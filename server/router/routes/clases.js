var express     = require('express');
var router      = express.Router();
var mysql       = require('mysql');
var db          = require('./config');
var _           = require('lodash');
var connection  = mysql.createConnection(db.database);

router.post('/crearClase', function (req, res) {
    if(!req.body){
        return res.sendStatus(400);
    }else{
        connection.query('INSERT INTO clase (id_modulo,descripcion,fecha, estado_sesion) VALUES (?,?,?,?)',[req.body.id_modulo,req.body.descripcion,req.body.fecha, req.body.estado_sesion], function (error, result) {
            if(!error){
                res.status(200);
                return res.json({'success':true, 'id_clase':result.insertId});
            }else{
                res.status(500);
                return res.json({'success':false, 'err':error});
            }
        });
    }
});
router.post('/obtenerClases', function (req, res) {
    if(!req.body){
        return res.sendStatus(400);
    }else{
        var i = 0;
        var listaDeClases = [];
        var query = "";
        while(i<req.body.length){
            if(i==0){
                query = 'SELECT id_clase, id_modulo, fecha, descripcion, estado_sesion FROM clase WHERE id_modulo = '+req.body[i].id_modulo;
            }else{
                query += '; SELECT id_clase, id_modulo, fecha, descripcion, estado_sesion FROM clase WHERE id_modulo = '+req.body[i].id_modulo;
            }
            i++;
        }
        connection.query(query, function (error, rows) {
            if(!error){
                res.status(200);
                return res.json({'success':true, 'result':rows});
            }else{
                res.status(500);
                return res.json({'success':false, 'err':error});
            }
        });
    }
});

router.post('/actualizarClase', function (req, res) {
    if(!req.body){
        return res.sendStatus(400);
    }else{
        connection.query('UPDATE clase SET id_modulo = ?, descripcion = ?, fecha = ?, estado_sesion = ?  WHERE id_clase = ?',[req.body.id_modulo, req.body.descripcion, req.body.fecha, req.body.estado_sesion, req.body.id_clase], function (error) {
            if(!error){
                res.status(200);
                return res.json({'success':true});
            }else{
                res.status(500);
                return res.json({'success':false, 'err':error});
            }
        });
    }
});
router.post('/eliminarClase', function (req, res) {
    if(!req.body){
        return res.sendStatus(400);
    }else{
        connection.query('UPDATE pregunta SET id_clase = null WHERE id_clase = ?',[req.body.id_clase], function (error) {
            if(error){
                res.status(500);
                return res.json({'success':false, 'err':error});
            }else{
                connection.query('DELETE FROM clase WHERE id_clase = ?',[req.body.id_clase], function (error) {
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
    }
});
router.post('/actualizarSesionClase', function (req, res) {
    if(!req.body){
        return res.sendStatus(400);
    }else{
        connection.query('UPDATE clase SET estado_sesion = ? WHERE id_clase = ?',[req.body.estado_sesion,req.body.id_clase], function (error) {
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