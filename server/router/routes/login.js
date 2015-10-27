var express     = require('express');
var router      = express.Router();
var mysql       = require('mysql');
var db          = require('./config');
var crypto      = require('crypto');
var connection  = mysql.createConnection(db.database);


router.post('/', function(req, res){
    var output = {};
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
                    output = {
                        token: token,
                        usuario: rows[0].usuario,
                        tipo: 'estudiante'
                    };
                    connection.query('UPDATE estudiante SET token = ? WHERE id_user = ?', [token, rows[0].id_user], function(error, rows, fields){
                        if(error){
                            res.send('Error update');
                        }else{
                            res.json(output);
                        }
                    });
                }else{
                    connection.query(select_profe,[req.body.usuario, req.body.clave], function (error, rows) {
                        if(!error){
                            if(rows.length==1){
                                var token = crypto.randomBytes(64).toString('hex');
                                output = {
                                    token: token,
                                    usuario: rows[0].usuario,
                                    tipo: 'profesor'
                                };
                                connection.query('UPDATE profesor SET token = ? WHERE id_user = ?', [token, rows[0].id_user], function(error, rows, fields){
                                    if(error){
                                        res.send('Error update');
                                    }else{
                                        res.json(output);
                                    }
                                });
                            }else{
                                connection.query(select_admin,[req.body.usuario, req.body.clave], function (error, rows) {
                                    if(!error){
                                        if(rows.length==1){
                                            var token = crypto.randomBytes(64).toString('hex');
                                            output = {
                                                token: token,
                                                usuario: rows[0].usuario,
                                                tipo: 'administrador'
                                            };
                                            connection.query('UPDATE administrador SET token = ? WHERE id_user = ?', [token, rows[0].id_user], function(error, rows, fields){
                                                if(error){
                                                    res.send('Error update');
                                                }else{
                                                    res.json(output);
                                                }
                                            });
                                        }else{
                                            res.send('error');
                                        }
                                    }
                                });
                            }
                        }
                    });
                }
            }
        });
    }
});

router.post('/checkToken', function (req, res) {
    var output = {};
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
            connection.query('SELECT * FROM ?? WHERE token = ? AND usuario = ?',[input.tipo,input.token,input.usuario],function(err, rows, fields) {
                if (!err) {
                    if (rows.length == 1) {
                        output = {
                            credencial: true
                        };
                        res.json(output);
                    } else {
                        output = {
                            credencial: false
                        };
                        res.json(output);
                    }
                } else {
                    res.send('Error');
                }
            });

        }else{
            res.send('no data');
        }
    }
});

module.exports = router;