var express     = require('express');
var router      = express.Router();
var mysql       = require('mysql');
var db          = require('./config');
var _           = require('lodash');
var connection  = mysql.createConnection(db.database);

//router.post('/obtenerPreguntasClase', function (req, res) {
//    if(!req.body){
//        return res.sendStatus(400);
//    }else{
//        connection.query('SELECT id_pregunta, id_b_pregunta, id_clase, estado_pregunta, pregunta FROM pregunta WHERE id_clase = ?',[req.body.id_clase], function (error, rows) {
//            if(!error){
//                res.status(200);
//                return res.json({'success':true, 'result':rows});
//            }else{
//                res.status(500);
//                return res.json({'success':false, 'err':error});
//            }
//        });
//    }
//});

router.post('/obtenerCantidadPreguntasCursoPorEstado', function (req, res) {
    if(!req.body){
        return res.sendStatus(400);
    }else{
        connection.query('SELECT COUNT(id_pregunta) AS ? FROM pregunta WHERE id_curso = ? AND estado_pregunta = ?',[req.body.estado_pregunta,req.body.id_curso, req.body.estado_pregunta], function (error, result) {
            if(!error){
                return res.json({'success':true, 'result':result[0]});
            }else{
                return res.json({'success':false, 'err':error});
            }
        });
    }
});
router.post('/numeroDeEstudiantesPorCurso', function (req, res) {
    if(!req.body){
        return res.sendStatus(400);
    }else{
        connection.query('SELECT COUNT(id_user) AS numeroEstudiantes FROM pertenece WHERE id_curso = ?',[req.body.id_curso], function (error, result) {
            if(!error){
                return res.json({'success':true, 'result':result["0"].numeroEstudiantes});
            }else{
                return res.json({'success':false, 'err':error});
            }
        });
    }
});
router.post('/numeroTotalDeParticipacionPorCurso', function (req, res) {
    if(!req.body){
        return res.sendStatus(400);
    }else{
        connection.query('SELECT COUNT(p.id_user) AS numeroTotalDeParticipacionPorCurso FROM pertenece p INNER JOIN participan_por_responder part ON p.id_user = part.id_user WHERE p.id_curso = ?',[req.body.id_curso], function (error, result) {
            if(!error){
                return res.json({'success':true, 'result':result["0"].numeroTotalDeParticipacionPorCurso});
            }else{
                return res.json({'success':false, 'err':error});
            }
        });
    }
});
router.post('/participacionActualCurso', function (req, res) {
    if(!req.body){
        return res.sendStatus(400);
    }else{
        connection.query(
            'SELECT COUNT(part.id_user) AS participacionActual'+
            ' FROM pregunta p'+
            ' INNER JOIN participan_por_responder part'+
            ' ON part.id_pregunta=p.id_pregunta'+
            ' WHERE p.id_curso=?',[req.body.id_curso], function (error, result) {
                if(!error){
                    return res.json({'success':true, 'result':result["0"].participacionActual});
                }else{
                    return res.json({'success':false, 'err':error});
                }
            });
    }
});
router.post('/participacionTotalPosibleCurso', function (req, res) {
    if(!req.body){
        return res.sendStatus(400);
    }else{
        connection.query(
            'SELECT ' +
            ' COUNT(id_pregunta) * (SELECT COUNT(id_user) FROM pertenece WHERE id_curso = ?) AS participacionTotalPosibleCurso'+
            ' FROM pregunta'+
            ' WHERE id_curso = ?'+
            ' AND estado_pregunta="realizada"',[req.body.id_curso,req.body.id_curso], function (error, result) {
                if(!error){
                    return res.json({'success':true, 'result':result["0"].participacionTotalPosibleCurso});
                }else{
                    return res.json({'success':false, 'err':error});
                }
            });
    }
});
router.post('/participacionPorPreguntasEnCurso', function (req, res) {
    if(!req.body){
        return res.sendStatus(400);
    }else{
        connection.query(
            'SELECT p.id_pregunta, p.pregunta, COUNT(ppr.id_user) AS numeroParticipantes'+
            ' FROM pregunta p'+
            ' INNER JOIN participan_por_responder ppr'+
            ' ON p.id_pregunta= ppr.id_pregunta'+
            ' WHERE p.id_curso=?'+
            ' GROUP BY p.id_pregunta',[req.body.id_curso], function (error, rows) {
                if(!error){
                    return res.json({'success':true, 'result':rows});
                }else{
                    return res.json({'success':false, 'err':error});
                }
            });
    }
});

router.post('/partYNumIntentosFallidosxPreg', function (req, res) {
    if(!req.body){
        return res.sendStatus(400);
    }else{
        connection.query(
            'SELECT p.id_pregunta, p.pregunta, COUNT(ppr.id_user) AS numeroParticipantes, (SELECT COUNT(id_user) FROM participan_por_responder WHERE estado_part_preg!="ganador" AND id_pregunta=p.id_pregunta) AS numeroIntentos'+
            ' FROM pregunta p'+
            ' LEFT OUTER JOIN participan_por_responder ppr'+
            ' ON p.id_pregunta= ppr.id_pregunta'+
            ' WHERE p.id_curso=?' +
            ' AND p.estado_pregunta="realizada"'+
            ' GROUP BY p.id_pregunta;',[req.body.id_curso], function (error, rows) {
                if(!error){
                    return res.json({'success':true, 'result':rows});
                }else{
                    return res.json({'success':false, 'err':error});
                }
            });
    }
});
router.post('/ganadoresPerdedoresNoSelecPregxCurso', function (req, res) {
    if(!req.body){
        return res.sendStatus(400);
    }else{
        connection.query(
            'SELECT p.id_pregunta, p.pregunta, c.fecha, c.descripcion, COUNT(ppr.id_user) AS numeroParticipantes,'+
            ' (SELECT COUNT(id_user)'+
            ' FROM participan_por_responder'+
            ' WHERE estado_part_preg="ganador" AND id_pregunta=p.id_pregunta) AS ganadores,'+
            ' (SELECT COUNT(id_user)'+
            ' FROM participan_por_responder'+
            ' WHERE estado_part_preg="perdedor" AND id_pregunta=p.id_pregunta) AS perdedores,'+
            ' (SELECT COUNT(id_user)'+
            ' FROM participan_por_responder'+
            ' WHERE estado_part_preg="noSeleccionado" AND id_pregunta=p.id_pregunta) AS "noSeleccionados"'+
            ' FROM pregunta p'+
            ' LEFT OUTER JOIN participan_por_responder ppr'+
            ' ON p.id_pregunta= ppr.id_pregunta' +
            ' INNER JOIN clase c'+
            ' ON c.id_clase=p.id_clase'+
            ' WHERE p.id_curso=?' +
            ' AND p.estado_pregunta="realizada"'+
            ' GROUP BY p.id_pregunta',[req.body.id_curso], function (error, rows) {
                if(!error){
                    return res.json({'success':true, 'result':rows});
                }else{
                    return res.json({'success':false, 'err':error});
                }
            });
    }
});
router.post('/resultadoPreguntasPorCurso', function (req, res) {
    if(!req.body){
        return res.sendStatus(400);
    }else{
        connection.query(
            'SELECT  id_clase, fecha,' +
            ' SUM(Ganador) AS respuestasCorrectas,'+
            ' SUM(Perdedores) AS respuestasIncorrectas,'+
            ' SUM(SinRespuestas) AS SinRespuestas'+
            ' FROM (SELECT'+
            ' IF(SUM(ppr.estado_part_preg="ganador") = 1, 1, 0) AS Ganador,'+
            ' IF(SUM(ppr.estado_part_preg="ganador") = 0 && SUM(ppr.estado_part_preg="perdedor")> 0 , 1, 0) AS Perdedores,'+
            ' IF(SUM(ppr.estado_part_preg="ganador") = 0 || SUM(ppr.estado_part_preg="ganador") is NULL, 1, 0) AS SinRespuestas,'+
            ' c.fecha, c.id_clase'+
            ' FROM pregunta p'+
            ' LEFT OUTER JOIN participan_por_responder ppr'+
            ' ON p.id_pregunta=ppr.id_pregunta'+
            ' INNER JOIN clase c'+
            ' ON c.id_clase=p.id_clase'+
            ' WHERE p.id_curso=?'+
            ' GROUP BY p.id_pregunta) AS tabla'+
            ' GROUP BY fecha;',[req.body.id_curso], function (error, rows) {
                if(!error){
                    return res.json({'success':true, 'result':rows});
                }else{
                    return res.json({'success':false, 'err':error});
                }
            });
    }
});
router.post('/partEstudiantePregRelEnCurso', function (req, res) {
    if(!req.body){
        return res.sendStatus(400);
    }else{
        connection.query(
            'SELECT  e.id_user, e.nombre, e.apellido, e.rut, c.id_clase, c.fecha, q.id_pregunta, q.id_b_pregunta, q.pregunta, ' +
            ' IF(ppr.estado_part_preg is NULL , "no participa", ' +
            '   IF(ppr.estado_part_preg="noSeleccionado","no seleccionado",ppr.estado_part_preg)) AS participacion'+
            ' FROM pertenece p'+
            ' INNER JOIN estudiante e'+
            ' ON e.id_user=p.id_user'+
            ' RIGHT OUTER JOIN pregunta q'+
            ' ON q.id_curso=p.id_curso' +
            ' INNER JOIN  clase c'+
            ' ON c.id_clase=q.id_clase'+
            ' LEFT JOIN participan_por_responder ppr'+
            ' ON e.id_user=ppr.id_user'+
            ' AND q.id_pregunta=ppr.id_pregunta'+
            ' WHERE p.id_curso=?'+
            ' AND q.estado_pregunta="realizada"'+
            ' AND q.id_curso=?;',[req.body.id_curso,req.body.id_curso], function (error, rows) {
                if(!error){
                    return res.json({'success':true, 'result':rows});
                }else{
                    return res.json({'success':false, 'err':error});
                }
            });
    }
});
router.post('/partxEstdPregRealEnCurso', function (req, res) {
    if(!req.body){
        return res.sendStatus(400);
    }else{
        connection.query(
            'SELECT  e.id_user, e.nombre, e.apellido, e.rut, c.id_clase, c.fecha, q.id_pregunta, q.pregunta, ' +
            ' IF(ppr.estado_part_preg is NULL , "no participa", ' +
            '   IF(ppr.estado_part_preg="noSeleccionado","no seleccionado",ppr.estado_part_preg)) AS participacion'+
            ' FROM pertenece p'+
            ' INNER JOIN estudiante e'+
            ' ON e.id_user=p.id_user'+
            ' RIGHT OUTER JOIN pregunta q'+
            ' ON q.id_curso=p.id_curso' +
            ' INNER JOIN  clase c'+
            ' ON c.id_clase=q.id_clase'+
            ' LEFT JOIN participan_por_responder ppr'+
            ' ON e.id_user=ppr.id_user'+
            ' AND q.id_pregunta=ppr.id_pregunta'+
            ' WHERE p.id_curso=?'+
            ' AND q.estado_pregunta="realizada"'+
            ' AND q.id_curso=?' +
            ' AND e.id_user=?;',[req.body.id_curso,req.body.id_curso, req.body.id_user], function (error, rows) {
                if(!error){
                    return res.json({'success':true, 'result':rows});
                }else{
                    return res.json({'success':false, 'err':error});
                }
            });
    }
});
router.post('/partActvidadesxCurso', function (req, res) {
    if(!req.body){
        return res.sendStatus(400);
    }else{
        connection.query(
            'SELECT  e.id_user, e.nombre, e.apellido, e.rut, a.id_actividad, a.titulo_act, part.estado_part_act'+
            ' FROM pertenece p'+
            ' INNER JOIN estudiante e'+
            ' ON e.id_user=p.id_user'+
            ' INNER JOIN participa part'+
            ' ON part.id_user=e.id_user'+
            ' INNER JOIN actividad a'+
            ' ON a.id_actividad=part.id_actividad'+
            ' WHERE p.id_curso=?',[req.body.id_curso], function (error, rows) {
                if(!error){
                    return res.json({'success':true, 'result':rows});
                }else{
                    return res.json({'success':false, 'err':error});
                }
            });
    }
});
router.post('/partActvidadesCursoxEstudiante', function (req, res) {
    if(!req.body){
        return res.sendStatus(400);
    }else{
        connection.query(
            'SELECT  e.id_user, e.nombre, e.apellido, e.rut, a.id_actividad, a.titulo_act, part.estado_part_act'+
            ' FROM pertenece p'+
            ' INNER JOIN estudiante e'+
            ' ON e.id_user=p.id_user'+
            ' INNER JOIN participa part'+
            ' ON part.id_user=e.id_user'+
            ' INNER JOIN actividad a'+
            ' ON a.id_actividad=part.id_actividad'+
            ' WHERE p.id_curso=?' +
            ' AND e.id_user=?',[req.body.id_curso, req.body.id_user], function (error, rows) {
                if(!error){
                    return res.json({'success':true, 'result':rows});
                }else{
                    return res.json({'success':false, 'err':error});
                }
            });
    }
});
router.post('/actividadesCurso', function (req, res) {
    if(!req.body){
        return res.sendStatus(400);
    }else{
        connection.query(
            'SELECT id_actividad, id_clase, id_curso, titulo_act, estado_actividad'+
            ' FROM actividad'+
            ' WHERE id_curso=?',[req.body.id_curso], function (error, rows) {
                if(!error){
                    return res.json({'success':true, 'result':rows});
                }else{
                    return res.json({'success':false, 'err':error});
                }
            });
    }
});
router.post('/obtenerEstudiantesPorCurso', function (req, res) {
    if(!req.body){
        return res.sendStatus(400);
    }else{
        connection.query(
            'SELECT e.id_user, e.nombre, e.apellido, e.rut'+
            ' FROM pertenece p'+
            ' INNER JOIN estudiante e'+
            ' ON e.id_user=p.id_user'+
            ' WHERE p.id_curso=?',[req.body.id_curso], function (error, rows) {
                if(!error){
                    return res.json({'success':true, 'result':rows});
                }else{
                    return res.json({'success':false, 'err':error});
                }
            });
    }
});
router.post('/obtenerMetaCurso', function (req, res) {
    if(!req.body){
        return res.sendStatus(400);
    }else{
        connection.query('SELECT meta FROM curso WHERE id_curso = ?',[req.body.id_curso], function (error, row) {
            if(!error){
                return res.json({'success':true, 'result':row[0].meta});
            }else{
                return res.json({'success':false, 'err':error});
            }
        });
    }
});
router.post('/cantidadTotalPreguntasCurso', function (req, res) {
    if(!req.body){
        return res.sendStatus(400);
    }else{
        connection.query('SELECT COUNT(id_pregunta) AS cantidad_preguntas_curso FROM pregunta WHERE id_curso = ? AND estado_pregunta="realizada"',[req.body.id_curso], function (error, rows) {
            if(!error){
                return res.json({'success':true, 'result':rows[0].cantidad_preguntas_curso});
            }else{
                return res.json({'success':false, 'err':error});
            }
        });
    }
});
router.post('/numeroParticipacionPreguntasCurso', function (req, res) {
    if(!req.body){
        return res.sendStatus(400);
    }else{
        connection.query('SELECT COUNT(part.id_user) AS numeroParticipacionPreguntasCurso FROM participan_por_responder part INNER JOIN pregunta p ON p.id_pregunta = part.id_pregunta WHERE p.id_curso = ? AND p.estado_pregunta="realizada" AND part.id_user = ?;',[req.body.id_curso, req.body.id_user], function (error, rows) {
            if(!error){
                return res.json({'success':true, 'result':rows[0].numeroParticipacionPreguntasCurso});
            }else{
                return res.json({'success':false, 'err':error});
            }
        });
    }
});
router.post('/numeroNoSeleccionadoPreguntasCurso', function (req, res) {
    if(!req.body){
        return res.sendStatus(400);
    }else{
        connection.query('SELECT COUNT(part.id_user) AS numeroNoSeleccionadoPreguntasCurso FROM participan_por_responder part INNER JOIN pregunta p ON p.id_pregunta = part.id_pregunta WHERE p.id_curso = ? AND p.estado_pregunta="realizada" AND part.estado_part_preg="noSeleccionado" AND part.id_user = ?;',[req.body.id_curso, req.body.id_user], function (error, rows) {
            if(!error){
                return res.json({'success':true, 'result':rows[0].numeroNoSeleccionadoPreguntasCurso});
            }else{
                return res.json({'success':false, 'err':error});
            }
        });
    }
});
router.post('/numeroCorrectasPreguntasCurso', function (req, res) {
    if(!req.body){
        return res.sendStatus(400);
    }else{
        connection.query('SELECT COUNT(part.id_user) AS numeroCorrectasPreguntasCurso FROM participan_por_responder part INNER JOIN pregunta p ON p.id_pregunta = part.id_pregunta WHERE p.id_curso = ? AND p.estado_pregunta="realizada" AND part.estado_part_preg="ganador" AND part.id_user = ?;',[req.body.id_curso, req.body.id_user], function (error, rows) {
            if(!error){
                return res.json({'success':true, 'result':rows[0].numeroCorrectasPreguntasCurso});
            }else{
                return res.json({'success':false, 'err':error});
            }
        });
    }
});
router.post('/numeroIncorrectasPreguntasCurso', function (req, res) {
    if(!req.body){
        return res.sendStatus(400);
    }else{
        connection.query('SELECT COUNT(part.id_user) AS numeroIncorrectasPreguntasCurso FROM participan_por_responder part INNER JOIN pregunta p ON p.id_pregunta = part.id_pregunta WHERE p.id_curso = ? AND p.estado_pregunta="realizada" AND part.estado_part_preg="perdedor" AND part.id_user = ?;',[req.body.id_curso, req.body.id_user], function (error, rows) {
            if(!error){
                return res.json({'success':true, 'result':rows[0].numeroIncorrectasPreguntasCurso});
            }else{
                return res.json({'success':false, 'err':error});
            }
        });
    }
});
router.post('/cantidadTotalPreguntasClase', function (req, res) {
    if(!req.body){
        return res.sendStatus(400);
    }else{
        connection.query('SELECT COUNT(id_pregunta) AS cantidad_preguntas_clase FROM pregunta WHERE id_clase = ? AND estado_pregunta="realizada"',[req.body.id_clase], function (error, rows) {
            if(!error){
                return res.json({'success':true, 'result':rows[0].cantidad_preguntas_clase});
            }else{
                return res.json({'success':false, 'err':error});
            }
        });
    }
});
router.post('/numeroParticipacionPreguntasClase', function (req, res) {
    if(!req.body){
        return res.sendStatus(400);
    }else{
        connection.query('SELECT COUNT(part.id_user) AS numeroParticipacionPreguntasClase FROM participan_por_responder part INNER JOIN pregunta p ON p.id_pregunta = part.id_pregunta WHERE p.id_clase = ? AND p.estado_pregunta="realizada" AND part.id_user = ?;',[req.body.id_clase, req.body.id_user], function (error, rows) {
            if(!error){
                return res.json({'success':true, 'result':rows[0].numeroParticipacionPreguntasClase});
            }else{
                return res.json({'success':false, 'err':error});
            }
        });
    }
});
router.post('/numeroNoSeleccionadoPreguntasClase', function (req, res) {
    if(!req.body){
        return res.sendStatus(400);
    }else{
        connection.query('SELECT COUNT(part.id_user) AS numeroNoSeleccionadoPreguntasClase FROM participan_por_responder part INNER JOIN pregunta p ON p.id_pregunta = part.id_pregunta WHERE p.id_clase = ? AND p.estado_pregunta="realizada" AND part.estado_part_preg="noSeleccionado" AND part.id_user = ?;',[req.body.id_clase, req.body.id_user], function (error, rows) {
            if(!error){
                return res.json({'success':true, 'result':rows[0].numeroNoSeleccionadoPreguntasClase});
            }else{
                return res.json({'success':false, 'err':error});
            }
        });
    }
});
router.post('/numeroCorrectasPreguntasClase', function (req, res) {
    if(!req.body){
        return res.sendStatus(400);
    }else{
        connection.query('SELECT COUNT(part.id_user) AS numeroCorrectasPreguntasClase FROM participan_por_responder part INNER JOIN pregunta p ON p.id_pregunta = part.id_pregunta WHERE p.id_clase = ? AND p.estado_pregunta="realizada" AND part.estado_part_preg="ganador" AND part.id_user = ?;',[req.body.id_clase, req.body.id_user], function (error, rows) {
            if(!error){
                return res.json({'success':true, 'result':rows[0].numeroCorrectasPreguntasClase});
            }else{
                return res.json({'success':false, 'err':error});
            }
        });
    }
});
router.post('/numeroIncorrectasPreguntasClase', function (req, res) {
    if(!req.body){
        return res.sendStatus(400);
    }else{
        connection.query('SELECT COUNT(part.id_user) AS numeroIncorrectasPreguntasClase FROM participan_por_responder part INNER JOIN pregunta p ON p.id_pregunta = part.id_pregunta WHERE p.id_clase = ?  AND p.estado_pregunta="realizada" AND part.estado_part_preg="perdedor" AND part.id_user = ?;',[req.body.id_clase, req.body.id_user], function (error, rows) {
            if(!error){
                return res.json({'success':true, 'result':rows[0].numeroIncorrectasPreguntasClase});
            }else{
                return res.json({'success':false, 'err':error});
            }
        });
    }
});
router.post('/pregRealiazadasAgrupadasxClases', function (req, res) {
    if(!req.body){
        return res.sendStatus(400);
    }else{
        connection.query('SELECT c.id_clase, c.fecha, COUNT(p.id_pregunta) preguntasRealizadas'+
            ' FROM pregunta p'+
            ' INNER JOIN clase c'+
            ' ON c.id_clase=p.id_clase'+
            ' WHERE p.id_curso=?'+
            ' AND p.estado_pregunta="realizada"'+
            ' GROUP BY p.id_clase',[req.body.id_curso], function (error, rows) {
            if(!error){
                return res.json({'success':true, 'result':rows});
            }else{
                return res.json({'success':false, 'err':error});
            }
        });
    }
});
router.post('/partPregRealiazadasAgrupadasxClases', function (req, res) {
    if(!req.body){
        return res.sendStatus(400);
    }else{
        connection.query('SELECT c.id_clase, c.fecha, COUNT(ppr.estado_part_preg) participantes'+
        ' FROM pregunta p'+
        ' INNER JOIN clase c'+
        ' ON c.id_clase=p.id_clase'+
        ' LEFT OUTER JOIN participan_por_responder ppr'+
        ' ON p.id_pregunta=ppr.id_pregunta'+
        ' WHERE p.id_curso=?'+
        ' AND p.estado_pregunta="realizada"'+
        ' GROUP BY p.id_clase',[req.body.id_curso], function (error, rows) {
            if(!error){
                return res.json({'success':true, 'result':rows});
            }else{
                return res.json({'success':false, 'err':error});
            }
        });
    }
});
module.exports = router;