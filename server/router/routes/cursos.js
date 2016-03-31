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
        connection.query('INSERT INTO curso SET id_asignatura = ?, id_calendario = ?, ano = ?, semestre = ?, id_user = ?, estado_curso = ?, nombre_curso = ? ',[req.body.id_asignatura, req.body.id_calendario, req.body.ano, req.body.semestre, req.body.id_user, req.body.estado_curso, req.body.nombre_curso], function (error, result) {
            if(error){
                return res.json({'error':true,'err':error.code});
            }else{
                return res.json({'id_curso':result.insertId});
            }
        });
    }
});
function ordenar (rows){
    //primer se ordenan las filas por ano y semestre (desc ambos)
    var listaOrdenada = _.map(_.sortByOrder(rows, ['ano', 'semestre'], ['desc', 'desc']));
    //luego se mapean agrupandolas por ano y semestre, y se retorna un objeto con el nombre del semestre
    //y los cursos correspondientes
    var lista = _.chain(listaOrdenada)
        .map(function (e) {
            return _.extend({},e, { anoSemestre: e.ano+' '+ e.semestre });
        })
        .groupBy('anoSemestre')
        .pairs()
        .map(function(current){
            var test = _.object(_.zip(["nombre","cursos"], current));
            test['ano'] = current[1][0].ano;
            test['semestre'] = current[1][0].semestre;
            return test;
        });
    //finalmente se ordenan porque el proceso anterior no es devuelto 100% ordenado por lodash
    _.sortByOrder(_(lista).reverse().value(),['nombre'],['desc']);
    //lista creada y retornada.
    return lista;
};
router.post('/obtenerCursos', function (req, res) {
    if(!req.body){
        return res.sendStatus(400);
    }else{
        if(req.body.tipo == 'profesor'){
            connection.query('SELECT id_curso, id_asignatura, id_calendario, ano, semestre, estado_curso, nombre_curso FROM curso WHERE id_user = ?',[req.body.id_user], function (error, rows) {
                if(!error){
                    return res.json(ordenar(rows));
                }else{
                    return res.json({'error':true,'err':error});
                }
            });
        }else if(req.body.tipo == 'estudiante'){
            connection.query('SELECT c.id_curso, c.nombre_curso, c.semestre, c.ano, c.estado_curso FROM pertenece ec INNER JOIN estudiante e ON ec.id_user=e.id_user INNER JOIN curso c ON ec.id_curso = c.id_curso WHERE e.id_user = ?',[req.body.id_user], function (error, rows) {
                if (!error) {
                    return res.json(ordenar(rows));
                } else {
                    return res.json({'error': true, 'err': error});
                }
            });
        }else if(req.body.tipo == 'administrador'){
            //retornar todos los cursos disponibles
        }else{
            //no se le permite el acceso
        }
    }
});

router.post('/obtenerCursoPorNombre', function (req, res) {
    if(!req.body){
        return res.sendStatus(400);
    }else{
        connection.query('SELECT id_curso, semestre, ano, estado FROM curso WHERE nombre_curso = ?',[req.body.nombre_curso], function (error, rows) {
            if(!error){
                return res.json(rows);
            }else{
                return res.json({'error':true,'err':error});
            }
        });
    }
});

router.post('/obtenerModulos', function (req, res) {
    if(!req.body){
        return res.sendStatus(400);
    }else{
        connection.query('SELECT * FROM modulo WHERE id_curso = ?',[req.body.id_curso], function (error, rows) {
            if(!error && rows.length>=0){
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
        connection.query('UPDATE curso SET estado_curso = ? WHERE id_curso = ?',[req.body.estado, req.body.id_curso], function (error) {
            if(!error){
                return res.json(true);
            }
        });
    }
});
module.exports = router;