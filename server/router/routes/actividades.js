var express     = require('express');
var router      = express.Router();
var mysql       = require('mysql');
var db          = require('./config');
var _           = require('lodash');
var connection  = mysql.createConnection(db.database);

router.post('/obtenerActividadesCurso', function (req, res) {
    if(!req.body){
        return res.sendStatus(400);
    }else{
        connection.query('SELECT id_actividad, id_clase, titulo_act FROM actividad WHERE id_curso = ?',[req.body.id_curso], function (error, rows) {
            if(error){
                return res.json({'error':true,'err':error});
            }else{
                return res.json(rows);
            }
        });
    }
});

//crear actividad del curso
//eliminar actividad del curso
//modificar actividad del curso
//asginar ganadores de la actividad del curso
//asginar participantes de la actividad del curso
module.exports = router;