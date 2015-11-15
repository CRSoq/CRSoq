var express     = require('express');
var router      = express.Router();
var mysql       = require('mysql');
var db          = require('./config');
var _           = require('lodash');
var connection  = mysql.createConnection(db.database);

router.post('/crearClase', function (req, res) {
    if(!req.body){
        return res.sendStatus(400);
    }else{
        connection.query('INSERT INTO clase (id_modulo,descripcion,fecha) VALUES (?,?,?)',[req.body.id_modulo,req.body.descripcion,req.body.fecha], function (error, result) {
            if(error){
                res.json({'error':true});
            }else{
                res.json({'id_clase':result.insertId});
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
                query = 'SELECT * FROM clase WHERE id_modulo = '+req.body[i].id_modulo;
            }else{
                query += '; SELECT * FROM clase WHERE id_modulo = '+req.body[i].id_modulo;
            }
            i++;
        }
        connection.query(query, function (error, rows) {
            if(!error && rows.length>0){
                var i=j=0;
                while(i<rows.length){
                    if(rows[i].length>0){
                        while(j<rows[i].length){
                            listaDeClases.push(rows[i][j]);
                            j++;
                        }
                        j=0;
                    }
                    i++;
                }
                return res.json(listaDeClases);
            }
        });
    }
});
router.post('/actualizarClase', function (req, res) {
    if(!req.body){
        return res.sendStatus(400);
    }else{
        connection.query('UPDATE clase SET id_modulo = ?, descripcion = ?, fecha = ? WHERE id_clase = ?',[req.body.id_modulo, req.body.descripcion, req.body.fecha, req.body.id_clase], function (error) {
            if(error){
                return res.json({'error': true});
            }else{
                return res.json({'error': false});
            }
        });
    }
});
router.post('/eliminarClase', function (req, res) {
    if(!req.body){
        return res.sendStatus(400);
    }else{
        connection.query('DELETE FROM clase WHERE id_clase = ?',[req.body.id_clase], function (error) {
            if(error){
                return res.json({'error': true});
            }else{
                return res.json({'error': false});
            }
        });
    }
});
module.exports = router;