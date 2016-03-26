var express     = require('express');
var router      = express.Router();
var mysql       = require('mysql');
var db          = require('./config');
var _           = require('lodash');
var connection  = mysql.createConnection(db.database);

router.post('/obtenerCalendario', function (req, res) {
    if(!req.body){
        return res.sendStatus(400);
    }else{
        connection.query('SELECT id_calendario, ano, semestre FROM calendario', function (error, rows) {
            if(error){
                res.json({'error':true, 'err':error.code});
            }else{
                res.json(rows);
            }
        });
    }
});

module.exports = router;