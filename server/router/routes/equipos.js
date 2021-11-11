var express     = require('express');
var router      = express.Router();
var _           = require('lodash');
var connection  = require('./connection').database;

router.post('/crearEquipo', function (req, res) {
    if(!req.body){
        return res.sendStatus(400);
    }else{
        connection.query('INSERT INTO equipo (id_curso,nombre_equipo) VALUES (?,?)',[req.body.id_curso, req.body.nombre_equipo], function (error, result) {
            if(!error){
                return res.json({'success':true, 'id_equipo':result.insertId});
            }else{
                return res.json({'success':false, 'err':error});
            }
        });
    }
});
router.post('/obtenerEquipos', function (req, res) {
    if(!req.body){
        return res.sendStatus(400);
    }else{
        connection.query("SELECT id_equipo, id_curso, nombre_equipo FROM equipo WHERE id_curso = ?",[req.body.id_curso], function (error, rows) {
            if(!error){
                return res.json({'success':true, 'result':rows});
            }else{
                return res.json({'success':false, 'err':error});
            }
        });
    }
});
router.post('/obtenerAlumnos', function (req, res) {
    if(!req.body){
        return res.sendStatus(400);
    }else{
        connection.query("SELECT ea.id_user, e.rut, e.nombre, e.apellido FROM equipo_alumnos ea INNER JOIN estudiante e WHERE ea.id_equipo = ? AND ea.id_user = e.id_user",[req.body.id_equipo], function (error, rows) {
            if(!error){
                return res.json({'success':true, 'result':rows});
            }else{
                return res.json({'success':false, 'err':error});
            }
        });
    }
});
router.post('/obtenerAlumnosSinEquipo', function (req, res) {
    if(!req.body){
        return res.sendStatus(400);
    }else{
        connection.query(
            /*"SELECT e.id_user, e.rut, e.nombre, e.apellido \
            FROM estudiante e \
            WHERE e.id_user NOT IN (SELECT id_user FROM equipo_alumnos)\
            AND e.id_user IN (SELECT id_user FROM pertenece WHERE id_curso = ?)",*/
            "SELECT * FROM estudiante \
            WHERE estudiante.id_user NOT IN \
                (SELECT ea.id_user FROM equipo_alumnos ea \
                 WHERE ea.id_equipo IN \
                     (SELECT e.id_equipo FROM equipo e \
                     WHERE e.id_curso = ?) \
                ) \
            AND estudiante.id_user IN \
                (SELECT id_user FROM pertenece \
                 WHERE id_curso = ?)",
            [req.body.id_curso, req.body.id_curso], 
            function (error, rows) {
                if(!error){
                    return res.json({'success':true, 'result':rows});
                }else{
                    return res.json({'success':false, 'err':error});
                }
            });
    }
});
router.post('/obtenerEquipoPorID', function (req, res) {
    if(!req.body){
        return res.sendStatus(400);
    }else{
        connection.query('SELECT id_equipo, id_curso, nombre_equipo FROM equipo WHERE id_equipo = ?',[req.body.id_equipo], function (error, rows) {
            if(!error){
                return res.json({'success':true, 'result':rows});
            }else{
                return res.json({'success':false, 'err':error});
            }
        });
    }
});
router.post('/obtenerEquipoAlumno', function (req, res) {
    if(!req.body){
        return res.sendStatus(400);
    }else{
        connection.query(
            "SELECT e.id_equipo, e.id_curso, e.nombre_equipo \
            FROM equipo e WHERE e.id_curso = ? \
            AND e.id_equipo IN (SELECT ea.id_equipo FROM equipo_alumnos ea WHERE ea.id_user = ?)",
            [req.body.id_curso, req.body.id_user], 
            function (error, rows) {
            if(!error){
                return res.json({'success':true, 'result':rows});
            }else{
                return res.json({'success':false, 'err':error});
            }
        });
    }
});
router.post('/agregarAlumnoAEquipo', function (req, res) {
    if(!req.body){
        return res.sendStatus(400);
    }else{
        connection.query('INSERT IGNORE INTO equipo_alumnos VALUES (?, ?)', [req.body.equipo.id_equipo, req.body.alumno.id_user], function (error, result) {
            if(!error){
                return res.json({'success':true, 'id_user': result.insertId});
            }else{
                return res.json({'success':false, 'err':error});
            }
        });
    }
});
router.post('/agregarAlumnosAEquipo', function (req, res) {
    if(!req.body){
        return res.sendStatus(400);
    }else{
        var queryString = "INSERT IGNORE INTO equipo_alumnos VALUES ";
        _.forEach(req.body.alumnos, function (o) {
            queryString = queryString.concat('(', req.body.equipo.id_equipo, ', ', o.id_user, '),');
        });
        queryString = queryString.slice(0, -1);
        connection.query(queryString, [], function (error, result) {
            if(!error){
                return res.json({'success':true, 'id_user': result.insertId});
            }else{
                return res.json({'success':false, 'err':error});
            }
        });
    }
});
router.post('/actualizarAlumnos', function (req, res) {
    if(!req.body){
        return res.sendStatus(400);
    }else{
        connection.query('DELETE FROM equipo_alumnos WHERE id_equipo = ?', [req.body.equipo.id_equipo], function(error) {
            if(!error){
                var queryString = "INSERT INTO equipo_alumnos VALUES ";
                _.forEach(req.body.alumnos, function (o) {
                    queryString = queryString.concat('(', req.body.equipo.id_equipo, ', ', o.id_user, '),');
                });
                queryString = queryString.slice(0, -1);
                connection.query(queryString, [], function (error) {
                    if(!error){
                        return res.json({'success':true});
                    }else{
                        return res.json({'success':false, 'err':error});
                    }
                });
            }else{
                return res.json({'success':false, 'err':error});
            }
        });
    }
});
router.post('/actualizarEquipo', function (req, res) {
    if(!req.body){
        return res.sendStatus(400);
    }else{
        connection.query('UPDATE equipo SET id_curso = ?, nombre_equipo = ? WHERE id_equipo = ?',[req.body.id_curso, req.body.nombre_equipo, req.body.id_equipo], function (error) {
            if(!error){
                return res.json({'success':true});
            }else{
                return res.json({'success':false, 'err':error});
            }
        });
    }
});
router.post('/eliminarEquipo', function (req, res) {
    if(!req.body){
        return res.sendStatus(400);
    }else{
        connection.query('DELETE FROM equipo_integrantes WHERE id_equipo = ?',[req.body.id_equipo], function (error) {
            if(error){
                return res.json({'success':false, 'err':error});
            }else{
                connection.query('DELETE FROM clase WHERE id_clase = ?',[req.body.id_clase], function (error) {
                    if(error){
                        return res.json({'success':false, 'err':error});
                    }else{
                        return res.json({'success':true});
                    }
                });
            }
        });
    }
});
module.exports = router;
