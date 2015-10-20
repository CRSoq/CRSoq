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
                        usuario: rows[0].USUARIO
                    };
                    connection.query('UPDATE administrador SET token = ? WHERE ID_USER = ?', [token, rows[0].ID_USER], function(error, rows, fields){
                        if(error){
                            res.send('Error update');
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
        connection.query('',function(err, rows, fields){

        });
    }
});
module.exports = router;