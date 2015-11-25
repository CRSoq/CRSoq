var express     = require('express');
var router      = express.Router();
var mysql       = require('mysql');
var db          = require('./config');
var _           = require('lodash');
var connection  = mysql.createConnection(db.database);

router.post('/crearCurso', function (req, res) {
    if(!req.body){
        return res.sendStatus(400);
    }else{
        connection.query('INSERT INTO curso SET id_user = ?, nombre_curso = ?, semestre = ?, ano = ?, estado = ? ',[req.body.id_user, req.body.nombre,req.body.semestre, req.body.ano, req.body.estado], function (error, result) {
            if(error){
                return res.json({'error':true,'err':error});
            }else{
                return res.json({'id_curso':result.insertId});
            }
        });
    }
});

router.post('/obtenerCursos', function (req, res) {
    if(!req.body){
        return res.sendStatus(400);
    }else{
        if(req.body.tipo == 'profesor'){
            connection.query('SELECT id_curso, nombre_curso, semestre, ano, estado FROM curso WHERE id_user = ?',[req.body.id_user, req.body.usuario], function (error, rows) {
                if(!error && rows.length>0){
                    var listaOrdenada = _.map(_.sortByOrder(rows, ['ano', 'semestre'], ['desc', 'desc']));
                    var lista = _.chain(listaOrdenada)
                        .map(function (e) {
                            return _.extend({},e, { anoSemestre: e.ano+' '+ e.semestre });
                        })
                        .groupBy('anoSemestre')
                        .pairs()
                        .map(function(current){
                            return _.object(_.zip(["nombre","cursos"], current));
                        });
                    return res.json(_.sortByOrder(_(lista).reverse().value(),['nombre'],['desc']));
                }else{
                    //error
                    return res.json({'error':true,'err':error});
                }
            });
        }
    }
});

router.post('/obtenerModulos', function (req, res) {
    if(!req.body){
        return res.sendStatus(400);
    }else{
        connection.query('SELECT * FROM modulo WHERE id_curso = ?',[req.body.id_curso], function (error, rows) {
            if(!error && rows.length>0){
                return res.json(rows);
            }else{
                //algo pasa aqui ? ):
                return res.json({'error':true});
            }
        });
    }
});

router.post('/guardarModulos', function (req, res) {
    if(!req.body){
        return res.sendStatus(400);
    }else{
        var result = [
            {'insert': []},
            {'update': []},
            {'delete': []}
        ];
        var i = j = 0;
        while(i<req.body[1].modulos.length) {
            if(_.isUndefined(req.body[1].modulos[i].id_modulo)){
                connection.query('INSERT INTO modulo (id_curso, nombre_modulo, posicion) VALUES (?,?,?)', [req.body[0].id_curso,req.body[1].modulos[i].nombre_modulo,req.body[1].modulos[i].posicion], function (error) {
                    if (error) {
                        console.log(error);
                        result[j].insert.push({'nombre':req.body[1].modulos[i].nombre_modulo});
                        j++;
                    }
                });
            }else{
                connection.query('UPDATE modulo SET nombre_modulo = ?, posicion = ? WHERE id_modulo = ?', [req.body[1].modulos[i].nombre_modulo,req.body[1].modulos[i].posicion,req.body[1].modulos[i].id_modulo], function (error) {
                    if (error) {
                        console.log(error);
                        result[j].update.push({'nombre':req.body[1].modulos[i].nombre_modulo});
                        j++;
                    }
                });
            }
            i++;
        }
        var i=j=0;
        while(i<req.body[2].modulosEliminados.length){
            connection.query('DELETE FROM modulo WHERE id_modulo = ?', [req.body[2].modulosEliminados[i].id_modulo], function (error) {
                if (error) {
                    console.log(error);
                    result[j].delete.push({'nombre':req.body[1].modulosEliminados[i].nombre_modulo});
                    j++;
                }
            });
            i++;
        }
        return res.json(result);
    }
});

router.post('/cambiarEstado', function (req, res) {
    if(!req.body){
        return res.sendStatus(400);
    }else{
        connection.query('UPDATE curso SET estado = ? WHERE id_curso = ?',[req.body.estado, req.body.id_curso], function (error) {
            if(!error){
                return res.json(true);
            }
        });
    }
});
module.exports = router;