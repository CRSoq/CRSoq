var express     = require('express');
var router      = express.Router();
var _           = require('lodash');
var connection  = require('./connection').database;

router.post('/obtenerBibliotecaDePreguntas', function (req, res) {
    if(!req.body){
        return res.sendStatus(400);
    }else{
        connection.query('SELECT id_b_pregunta, id_asignatura, b_pregunta, id_tema FROM biblioteca_preguntas WHERE id_asignatura = ?',[req.body.id_asignatura], function (error, rows) {
            if(error){
                return res.json({'success':false, 'err':error});
            }else{
                return res.json({'success':true, 'result':rows});
            }
        });
    }
});
router.post('/crearPreguntaBibliotecaDePreguntas', function (req, res) {
    if(!req.body){
        return res.sendStatus(400);
    }else{
        connection.query('INSERT INTO biblioteca_preguntas (id_asignatura,b_pregunta,id_tema) VALUES (?,?,?)',[req.body.id_asignatura,req.body.b_pregunta, req.body.id_tema], function (error, result) {
            if(error){
                return res.json({'success':false, 'err':error});
            }else{
                return res.json({'success':true, 'result':result.insertId});
            }
        });
    }
});
router.post('/obtenerBibliotecaDePreguntas2', function (req, res) {
    if(!req.body){
        return res.sendStatus(400);
    }else{
        connection.query('SELECT b.id_b_pregunta, b.id_asignatura, b.b_pregunta, te.nombre FROM biblioteca_preguntas b LEFT JOIN tema te ON b.id_tema = te.id_tema WHERE b.id_asignatura = ?',[req.body.id_asignatura], function (error, rows) {
            if(error){
                return res.json({'success':false, 'err':error});
            }else{
                return res.json({'success':true, 'result':rows});
            }
        });
    }
});
module.exports = router;
