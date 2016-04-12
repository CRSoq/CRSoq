var express     = require('express');
var router      = express.Router();
var mysql       = require('mysql');
var db          = require('./config');
var _           = require('lodash');
var connection  = mysql.createConnection(db.database);

router.post('/obtenerBibliotecaDePreguntas', function (req, res) {
    if(!req.body){
        return res.sendStatus(400);
    }else{
        connection.query('SELECT id_b_pregunta, id_asignatura, b_pregunta FROM biblioteca_preguntas WHERE id_asignatura = ?',[req.body.id_asignatura], function (error, rows) {
            if(error){
                return res.json({'error':true,'err':error});
            }else{
                return res.json(rows);
            }
        });
    }
});

module.exports = router;