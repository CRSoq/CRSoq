var express     = require('express');
var router      = express.Router();
var _           = require('lodash');
var connection  = require('./connection').database;

router.post('/crearClase', function (req, res) {
    if(!req.body){
        return res.sendStatus(400);
    }else{
    //console.log(req.body.fecha);
    //var fecha = req.body.fecha;
	//var fecha = req.body.fecha.split("T");
	//console.log(fecha);
	//var fecha = fecha[0]+" "+fecha[1];
	//console.log(fecha);
	//var fecha = fecha.split(".");
	//var fecha = fecha[0];
	//console.log(fecha);
	//var a='INSERT INTO clase (id_modulo,description,fecha, estado_sesion) VALUES ('+req.body.id_modulo+','+req.body.description+','+fecha[0]+','+req.body.estado_sesion+')';
	//console.log(a);
        connection.query('INSERT INTO clase (id_modulo,descripcion,fecha, estado_sesion) VALUES (?,?,str_to_date(?,"%Y-%m-%dT%H:%i:%s.%fZ"),?)',[req.body.id_modulo,req.body.descripcion, req.body.fecha, req.body.estado_sesion], function (error, result) {
            if(!error){
                return res.json({'success':true, 'id_clase':result.insertId});
            }else{
                return res.json({'success':false, 'err':error});
            }
        });
    }
});
router.post('/obtenerClases', function (req, res) {
    if(!req.body){
        return res.sendStatus(400);
    }else{
        var i = 0;
        var listaDeClases = [];
        var query = "";
        while(i<req.body.length){
            if(i==0){
                query = 'SELECT id_clase, id_modulo, fecha, descripcion, estado_sesion FROM clase WHERE id_modulo = '+req.body[i].id_modulo;
            }else{
                query += '; SELECT id_clase, id_modulo, fecha, descripcion, estado_sesion FROM clase WHERE id_modulo = '+req.body[i].id_modulo;
            }
            i++;
        }
        connection.query(query, function (error, rows) {
            if(!error){
                return res.json({'success':true, 'result':rows});
            }else{
                return res.json({'success':false, 'err':error});
            }
        });
    }
});
router.post('/obtenerClasesPorID', function (req, res) {
    if(!req.body){
        return res.sendStatus(400);
    }else{
        connection.query('SELECT id_clase, id_modulo, fecha, descripcion, estado_sesion FROM clase WHERE id_clase = ?',[req.body.id_clase], function (error, rows) {
            if(!error){
                return res.json({'success':true, 'result':rows});
            }else{
                return res.json({'success':false, 'err':error});
            }
        });
    }
});
router.post('/actualizarClase', function (req, res) {
    if(!req.body){
        return res.sendStatus(400);
    }else{
        connection.query('UPDATE clase SET id_modulo = ?, descripcion = ?, fecha = str_to_date(?,"%Y-%m-%dT%h:%i:%s.%fZ"), estado_sesion = ?  WHERE id_clase = ?',[req.body.id_modulo, req.body.descripcion, req.body.fecha, req.body.estado_sesion, req.body.id_clase], function (error) {
            if(!error){
                return res.json({'success':true});
            }else{
                return res.json({'success':false, 'err':error});
            }
        });
    }
});
router.post('/eliminarClase', function (req, res) {
    if(!req.body){
        return res.sendStatus(400);
    }else{
        connection.query('UPDATE pregunta SET id_clase = null WHERE id_clase = ?',[req.body.id_clase], function (error) {
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
router.post('/actualizarSesionClase', function (req, res) {
    if(!req.body){
        return res.sendStatus(400);
    }else{
        connection.query('UPDATE clase SET estado_sesion = ? WHERE id_clase = ?',[req.body.estado_sesion,req.body.id_clase], function (error) {
            if(error){
                return res.json({'success':false, 'err':error});
            }else{
                return res.json({'success':true});
            }
        });
    }
});
router.post('/obtenerEstadoSesion', function (req, res) {
    if(!req.body){
        return res.sendStatus(400);
    }else{
        connection.query('SELECT estado_sesion FROM clase WHERE id_clase = ?',[req.body.id_clase], function (error, row) {
            if(error){
                return res.json({'success':false, 'err':error});
            }else{
                return res.json({'success':true, 'result':row[0]});
            }
        });
    }
});
router.post('/contarClasesPorModulo', function (req, res) {
    if(!req.body){
        return res.sendStatus(400);
    }else{
        connection.query('SELECT COUNT(id_clase) AS numClases FROM clase WHERE id_modulo = ?',[req.body.id_modulo], function (error, result) {
            if(!error){
                res.status(200);
                return res.json({'success':true, 'result':result["0"].numClases});
            }else{
                res.status(500);
                return res.json({'success':false, 'err':error});
            }
        });
    }
});
module.exports = router;
