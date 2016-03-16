var express     = require('express');
var router      = express.Router();
var mysql       = require('mysql');
var db          = require('./config');
var _           = require('lodash');
var connection  = mysql.createConnection(db.database);

router.post('/crearPregunta', function (req, res) {
    if(!req.body){
        return res.sendStatus(400);
    }else{
        if(_.isUndefined(req.body.id_curso)){
            connection.query('SELECT id_curso FROM curso WHERE nombre_curso = ? AND CONCAT(ano," ", semestre)=?;', [req.body.curso, req.body.semestre], function (error, row) {
                if(error){
                    return res.json({'error':true ,'err':error});
                }else{
                    connection.query('INSERT INTO pregunta (id_curso,id_clase,estado,pregunta) VALUES (?,?,?,?)',[row[0].id_curso,req.body.id_clase,req.body.estado,req.body.pregunta], function (error, result) {
                        if(error){
                            return res.json({'error':true ,'err':error});
                        }else{
                            return res.json({'id_pregunta':result.insertId, 'id_curso':row[0].id_curso});
                        }
                    });
                }
            });

        }else{
            connection.query('INSERT INTO pregunta (id_curso,id_clase,estado,pregunta) VALUES (?,?,?,?)',[req.body.id_curso,req.body.id_clase,req.body.estado,req.body.pregunta], function (error, result) {
                if(error){
                    return res.json({'error':true ,'err':error});
                }else{
                    return res.json({'id_pregunta':result.insertId});
                }
            });
        }

    }

});

router.post('/obtenerPreguntaPorId', function (req, res) {
    if(!req.body){
        return res.sendStatus(400);
    }else{
        connection.query('SELECT id_pregunta, id_curso, id_clase, id_user, estado, pregunta FROM pregunta WHERE id_pregunta = ?',[req.body.id], function (error, rows) {
            if(!error){
                return res.json(rows[0]);
            }else{
                return res.json({'error':true,'err':error});
            }
        });
    }
});

router.post('/obtenerPreguntasClase', function (req, res) {
    if(!req.body){
        return res.sendStatus(400);
    }else{
        connection.query('SELECT id_pregunta, id_curso, id_clase, id_user, estado, pregunta FROM pregunta WHERE id_clase = ?',[req.body.id_clase], function (error, rows) {
            if(!error){
                return res.json(rows);
            }else{
                return res.json({'error':true,'err':error});
            }
        });
    }
});

router.post('/obtenerPreguntasCurso', function (req, res) {
    if(!req.body){
        return res.sendStatus(400);
    }else{
        connection.query('SELECT id_pregunta, id_curso, id_clase, id_user, estado, pregunta FROM pregunta WHERE id_curso = ?',[req.body.id_curso], function (error, rows) {
            if(error){
                return res.json({'error':true,'err':error});
            }else{
                return res.json(rows);
            }
        });
    }
});
router.post('/actualizarPregunta', function (req, res) {
    if(!req.body){
        return res.sendStatus(400);
    }else{
        connection.query('UPDATE pregunta SET id_clase = ?, pregunta = ? WHERE id_pregunta = ?',[req.body.id_clase, req.body.pregunta, req.body.id_pregunta], function (error) {
            if(error){
                return res.json({'error': true, 'err':error});
            }else{
                return res.json({'error': false});
            }
        });
    }
});
router.post('/actualizarEstadoPregunta', function (req, res) {
    if(!req.body){
        return res.sendStatus(400);
    }else{
        connection.query('UPDATE pregunta SET estado = ? WHERE id_pregunta = ?',[req.body.estado, req.body.id_pregunta], function (error) {
            if(error){
                return res.json({'error': true, 'err':error});
            }else{
                return res.json({'error': false});
            }
        });
    }
});
router.post('/eliminarPregunta', function (req, res) {
    if(!req.body){
        return res.sendStatus(400);
    }else{
        connection.query('DELETE FROM pregunta WHERE id_pregunta = ?',[req.body.id_pregunta], function (error) {
            if(error){
                return res.json({'error': true, 'err':error});
            }else{
                return res.json({'error': false});
            }
        });
    }
});
router.post('/asignarPreguntaClase', function (req, res) {
    if(!req.body){
        return res.sendStatus(400);
    }else{
        var i = 0;
        var error = [];
        while(i<req.body.pregunta.length){
            connection.query('UPDATE pregunta SET id_clase = ? WHERE id_pregunta = ?',[req.body.id_clase, req.body.pregunta[i].id_pregunta], function (error) {
                if(error){
                    error.push({'error': true, 'err':error});
                }
            });
            i++;
        }
        return res.json(error);
    }
});
router.post('/asignarGanador', function (req, res) {
    if(!req.body){
        return res.sendStatus(400);
    }else{
        connection.query('UPDATE pregunta SET id_user = ? WHERE id_pregunta = ?',[req.body.id_user, req.body.pregunta.id_pregunta], function (error) {
            if(error){
                return res.json({'error': true, 'err':error});
            }else{
                return res.json({'error': false});
            }
        });
    }
});
module.exports = router;