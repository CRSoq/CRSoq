var express     = require('express');
var router      = express.Router();
var mysql       = require('mysql');
var db          = require('./config');
var _           = require('lodash');
var connection  = mysql.createConnection(db.database);

router.post('/obtenerPreguntasClase', function (req, res) {
    if(!req.body){
        return res.sendStatus(400);
    }else{
        connection.query('SELECT id_pregunta, id_b_pregunta, id_clase, estado_pregunta, pregunta FROM pregunta WHERE id_clase = ?',[req.body.id_clase], function (error, rows) {
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

module.exports = router;