var express     = require('express');
var router      = express.Router();
var mysql       = require('mysql');
var db          = require('./config');
var _           = require('lodash');
var connection  = mysql.createConnection(db.database);

router.post('/crearPreguntaCurso', function (req, res) {
    if(!req.body){
        return res.sendStatus(400);
    }else{
        connection.query('INSERT INTO pregunta (id_clase,id_b_pregunta,id_curso,estado_pregunta,pregunta) VALUES (?,?,?,?,?)',[req.body.id_clase,req.body.id_b_pregunta,req.body.id_curso,req.body.estado_pregunta,req.body.pregunta], function (error, result) {
            if(error){
                res.status(500);
                return res.json({'success':false, 'err':error});
            }else{
                res.status(200);
                return res.json({'success':true, 'id_pregunta':result.insertId});
            }
        });
    }
});
router.post('/archivarPregunta', function (req, res) {
    if(!req.body){
        return res.sendStatus(400);
    }else{
        connection.query('INSERT INTO biblioteca_preguntas (id_asignatura,b_pregunta) VALUES (?,?)',[req.body.id_asignatura,req.body.pregunta], function (error, result) {
            if(error){
                res.status(500);
                return res.json({'success':false, 'err':error});
            }else{
                res.status(200);
                return res.json({'success':true, 'id_b_pregunta':result.insertId});
            }
        });
    }
});

router.post('/crearPreguntaAsignatura', function (req, res) {
    if(!req.body){
        return res.sendStatus(400);
    }else{
        connection.query('INSERT INTO biblioteca_preguntas (id_asignatura,b_pregunta) VALUES (?,?)',[req.body.id_asignatura,req.body.pregunta], function (error, result) {
            if(error){
                return res.json({'error':true ,'err':error});
            }else{
                var id_b_pregunta = result.insertId;
                if(_.isNull(req.body.id_clase)){
                    return res.json({'id_b_pregunta':id_b_pregunta});
                }else{
                    connection.query('INSERT INTO pregunta (id_clase,id_b_pregunta,estado_pregunta,pregunta) VALUES (?,?,?,?)',[req.body.id_clase,id_b_pregunta,req.body.estado_pregunta,req.body.pregunta], function (error, result) {
                        if(error){
                            return res.json({'error':true ,'err':error});
                        }else{
                            return res.json({'id_b_pregunta':id_b_pregunta,'id_pregunta':result.insertId});
                        }
                    });
                }
            }
        });
    }
});
router.post('/obtenerPreguntaPorId', function (req, res) {
    if(!req.body){
        return res.sendStatus(400);
    }else{
        connection.query('SELECT id_pregunta, id_clase, id_b_pregunta, id_curso, estado_pregunta, pregunta FROM pregunta WHERE id_pregunta = ?',[req.body.id_pregunta], function (error, rows) {
            if(error){
                res.status(500);
                return res.json({'success':false, 'err':error});
            }else{
                res.status(200);
                return res.json({'success':true, 'result':rows[0]});
            }
        });
    }
});
router.post('/obtenerPreguntasListaClases', function (req, res) {
    if(!req.body){
        return res.sendStatus(400);
    }else{
        //generar query
        if(req.body.length>0){
            var query = '';
            _.forEach(req.body, function (clase) {
                query += 'SELECT id_pregunta, id_clase, id_b_pregunta, estado_pregunta, pregunta FROM pregunta WHERE id_clase = '+clase.id_clase+' ; ';
            });
            connection.query(query, function (error, rows) {
                if(!error){
                    return res.json(rows);
                }else{
                    return res.json({'error':true,'err':error});
                }
            });
        }
    }
});
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

router.post('/obtenerPreguntasAsignatura', function (req, res) {
    if(!req.body){
        return res.sendStatus(400);
    }else{
        connection.query('SELECT id_b_pregunta, id_asignatura, b_pregunta FROM biblioteca_preguntas WHERE id_asignatura = ?',[req.body.id_asignatura], function (error, rows) {
            if(error){
                res.status(500);
                return res.json({'success':false, 'err':error});
            }else{
                res.status(200);
                return res.json({'success':true, 'result':rows});
            }
        });
    }
});
router.post('/obtenerPreguntasCurso', function (req, res) {
    if(!req.body){
        return res.sendStatus(400);
    }else{
        connection.query('SELECT id_pregunta, id_clase, id_b_pregunta, id_curso, estado_pregunta, pregunta FROM pregunta WHERE id_curso = ?',[req.body.id_curso], function (error, rows) {
            if(error){
                res.status(500);
                return res.json({'success':false, 'err':error});
            }else{
                res.status(200);
                return res.json({'success':true, 'result':rows});
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
        connection.query('UPDATE pregunta SET estado_pregunta = ? WHERE id_pregunta = ?',[req.body.estado_pregunta, req.body.id_pregunta], function (error) {
            if(error){
                res.status(500);
                return res.json({'success':false, 'err':error});
            }else{
                res.status(200);
                return res.json({'success':true});
            }
        });
    }
});
router.post('/actualizarID_B_Pregunta', function (req, res) {
    if(!req.body){
        return res.sendStatus(400);
    }else{
        connection.query('UPDATE pregunta SET id_b_pregunta = ? WHERE id_pregunta = ?',[req.body.id_b_pregunta, req.body.id_pregunta], function (error) {
            if(error){
                res.status(500);
                return res.json({'success':false, 'err':error});
            }else{
                res.status(200);
                return res.json({'success':true});
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

router.post('/eliminarPreguntaDeLaAsignatura', function (req, res) {
    if(!req.body){
        return res.sendStatus(400);
    }else{
        connection.query('SELECT COUNT(id_pregunta) FROM pregunta WHERE id_b_pregunta = ?',[req.body.id_b_pregunta], function (error, row) {
            if(error){
                //error
            }else{
                console.log(row);
            }
        });
        /*
         connection.query('DELETE FROM biblioteca_preguntas WHERE id_b_pregunta = ?',[req.body.id_pregunta], function (error) {
         if(error){
         res.status(500);
         return res.json({'success':false, 'err':error});
         }else{
         res.status(200);
         return res.json({'success':true});
         }
         });
        */
    }
});
router.post('/eliminarPreguntaDelCurso', function (req, res) {
    if(!req.body){
        return res.sendStatus(400);
    }else{
        connection.query('DELETE FROM pregunta WHERE id_pregunta = ?',[req.body.id_pregunta], function (error) {
            if(error){
                res.status(500);
                return res.json({'success':false, 'err':error});
            }else{
                res.status(200);
                return res.json({'success':true});
            }
        });
    }
});
router.post('/eliminarPreguntaDeLaClase', function (req, res) {
    if(!req.body){
        return res.sendStatus(400);
    }else{
        connection.query('UPDATE pregunta SET id_clase = null WHERE id_pregunta = ?',[req.body.id_pregunta], function (error) {
            if(error){
                res.status(500);
                return res.json({'success':false, 'err':error});
            }else{
                res.status(200);
                return res.json({'success':true});
            }
        });
    }
});

router.post('/asignarPreguntaClase', function (req, res) {
    if(!req.body){
        return res.sendStatus(400);
    }else{
        connection.query('UPDATE pregunta SET id_clase = ? WHERE id_pregunta = ?',[req.body.id_clase, req.body.pregunta.id_pregunta], function (error) {
            if(error){
                return res.json({'error': true, 'err':error});
            }else{
                return res.json({'error': false});
            }
        });
    }
});
router.post('/asignarEstadoParticipacionPregunta', function (req, res) {
    if(!req.body){
        return res.sendStatus(400);
    }else{
        connection.query('UPDATE participan_por_responder SET estado_part_preg = ? WHERE id_user = ? AND id_pregunta = ?',[req.body.estado_part_preg, req.body.id_user, req.body.id_pregunta], function (error) {
            if(error){
                res.status(500);
                return res.json({'success':false, 'err':error});
            }else{
                res.status(200);
                return res.json({'success':true});
            }
        });
    }
});
router.post('/participarEnPregunta', function (req, res) {
    if(!req.body){
        return res.sendStatus(400);
    }else{
        connection.query('INSERT INTO participan_por_responder (id_user,id_pregunta,estado_part_preg) VALUES (?,?,?)',[req.body.id_user, req.body.id_pregunta,req.body.estado_part_preg], function (error) {
            if(error){
                res.status(500);
                return res.json({'success':false, 'err':error});
            }else{
                res.status(200);
                return res.json({'success':true});
            }
        });
    }
});
module.exports = router;