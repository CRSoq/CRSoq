var express     = require('express');
var router      = express.Router();
var _           = require('lodash');
var connection  = require('./connection').database;

router.post('/obtenerProfesores', function (req, res) {
    if(!req.body){
        return res.sendStatus(400);
    }else{
        connection.query('SELECT id_user, nombre, apellido, usuario, clave FROM profesor', function (error, rows) {
            if(error){
                return res.json({'success':false, 'err':error});
            }else{
                return res.json({'success':true, 'result':rows});
            }
        });
    }
});
router.post('/crearProfesor', function (req, res) {
    if(!req.body){
        return res.sendStatus(400);
    }else{
        connection.query('SELECT COUNT (id_user) AS usuarioExistente FROM estudiante WHERE usuario = ?',[req.body.usuario], function (error, rows) {
            if(rows[0].usuarioExistente>0){
                return res.json({'success':false, 'err':{'code':'USUARIO_EXISTENTE'}});
            }else{
                connection.query('INSERT INTO profesor (nombre, apellido, usuario, clave) VALUES (?,?,?,?)',[req.body.nombre,req.body.apellido,req.body.usuario,req.body.clave], function (error, result) {
                    if(error){
                        return res.json({'success':false, 'err':error});
                    }else{
                        return res.json({'success':true, 'id_user':result.insertId});
                    }
                });
            }
        });
    }
});
router.post('/editarProfesor', function (req, res) {
    if(!req.body){
        return res.sendStatus(400);
    }else{
        connection.query('SELECT COUNT (id_user) AS usuarioExistente FROM estudiante WHERE usuario = ?',[req.body.usuario], function (error, rows) {
            if(rows[0].usuarioExistente>0){
                return res.json({'success':false, 'err':{'code':'USUARIO_EXISTENTE'}});
            }else{
                connection.query('UPDATE profesor SET nombre = ?, apellido = ?, usuario = ?, clave = ? WHERE id_user = ?',[req.body.nombre, req.body.apellido, req.body.usuario, req.body.clave ,req.body.id_user], function (error, result) {
                    if(error){
                        return res.json({'success':false, 'err':error});
                    }else{
                        return res.json({'success':true});
                    }
                });
            }
        });
    }
});
module.exports = router;