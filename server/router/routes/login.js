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
        connection.query('SELECT * from administrador WHERE USUARIO = ? AND CLAVE = ?',[req.body.usuario,req.body.clave], function (err, rows, fields) {
            if (!err) {
                if(rows.length==1){
                    var token = crypto.randomBytes(64).toString('hex');
                    output = {
                        token: token,
                        usuario: rows[0].usuario
                    };
                    console.log(token);
                    connection.query('UPDATE administrador SET token = ? WHERE id_user = ?', [token, rows[0].ID_USER], function(error, rows, fields){
                        if(error){
                            res.send('Error update');
                        }else{
                            var output = {
                                credencial : true
                            };
                            console.log("true");
                            res.json(output);
                        }
                    });
                    res.json(output);
                }else{
                    output = {
                        token: ""
                    };
                    res.json(output);
                }

            }
            else {
                res.send('Error select');
            }
        });
    }
});

router.post('/checkToken', function (req, res) {
    var output = {};
    if (!req.body){
        return res.sendStatus(400);
    }else{
        connection.query('SELECT * FROM administrador WHERE token = ? AND usuario = ?',[req.body.token,req.body.usuario],function(err, rows, fields){
            if(!err){
                if(rows.length==1){
                    output = {
                        credencial : true
                    };
                    console.log("true");
                    res.json(output);
                }else{
                    output = {
                        credencial : false
                    };
                    console.log("false");
                    res.json(output);
                }
            }else{
                res.send('Error');
            }
        });
    }
});
module.exports = router;