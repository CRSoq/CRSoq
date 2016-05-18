var express     = require('express');
var router      = express.Router();
var crypto      = require('crypto');
var connection  = require('./connection').database;

router.post('/', function(req, res){
    if (!req.body){
        return res.sendStatus(400);
    }else {
        var select_admin = 'SELECT * FROM administrador WHERE usuario = ? AND clave = ?';
        var select_estud = 'SELECT * FROM estudiante WHERE usuario = ? AND clave = ?';
        var select_profe = 'SELECT * FROM profesor WHERE usuario = ? AND clave = ?';
        connection.query(select_estud,[req.body.usuario, req.body.clave], function (error, rows) {
            if(!error){
                if(rows.length==1){
                    var token = crypto.randomBytes(64).toString('hex');
                    res.status(200);
                    return res.json({'success':true, 'usuario':{
                        token   : token,
                        usuario : rows[0].usuario,
                        tipo    : 'estudiante',
                        id_user : rows[0].id_user,
                        nombre  : rows[0].nombre,
                        apellido: rows[0].apellido,
                        rut     : rows[0].rut
                    }});
                }else{
                    connection.query(select_profe,[req.body.usuario, req.body.clave], function (error, rows) {
                        if(!error){
                            if(rows.length==1){
                                var token = crypto.randomBytes(64).toString('hex');
                                res.status(200);
                                return res.json({'success':true, 'usuario':{
                                    token: token,
                                    usuario: rows[0].usuario,
                                    tipo: 'profesor',
                                    id_user : rows[0].id_user,
                                    nombre  : rows[0].nombre,
                                    apellido: rows[0].apellido
                                }});
                            }else{
                                connection.query(select_admin,[req.body.usuario, req.body.clave], function (error, rows) {
                                    if(!error){
                                        if(rows.length==1){
                                            var token = crypto.randomBytes(64).toString('hex');
                                            res.status(200);
                                            return res.json({'success':true, 'usuario':{
                                                token: token,
                                                usuario: rows[0].usuario,
                                                tipo: 'administrador',
                                                id_user : rows[0].id_user,
                                                nombre  : rows[0].nombre,
                                                apellido: rows[0].apellido
                                            }});
                                        }else {
                                            res.json({'success':false});
                                        }
                                    }else{
                                        return res.json({'success':false, 'err':error});
                                    }
                                });
                            }
                        }else{
                            return res.json({'success':false, 'err':error});
                        }
                    });
                }
            }else{
                return res.json({'success':false, 'err':error});
            }
        });
    }
});

router.post('/asignarToken', function (req, res) {
    if (!req.body){
        return res.sendStatus(400);
    }else{
        connection.query('UPDATE ?? SET token = ? WHERE id_user = ?', [req.body.tipo,req.body.token, req.body.id_user], function(error){
            if(error){
                return res.json({'success':false, 'err':error});
            }else{
                return res.json({'success':true});
            }
        });
    }
});

router.post('/checkToken', function (req, res) {
    var input = {};
    if (!req.body){
        return res.sendStatus(400);
    }else{
        input = {
            token : req.body.token,
            usuario: req.body.usuario,
            tipo: req.body.tipo
        };

        if( typeof input.token !== 'undefined'){
            connection.query('SELECT id_user FROM ?? WHERE token = ? AND usuario = ?',[input.tipo,input.token,input.usuario],function(err, rows) {
                if (!err) {
                    if (rows.length == 1) {
                        return res.json({'credencial':true});
                    } else {
                        return res.json({'credencial': false});
                    }
                } else {
                    return res.json({'error':true,'err':err});

                }
            });

        }else{
            res.json({'error':true,'err':'no token'});
        }
    }
});

module.exports = router;