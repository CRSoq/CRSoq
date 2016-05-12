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
        connection.query('INSERT INTO curso SET id_asignatura = ?, id_calendario = ?, ano = ?, semestre = ?, id_user = ?, nombre_curso = ? ',[req.body.id_asignatura, req.body.id_calendario, req.body.ano, req.body.semestre, req.body.id_user, req.body.nombre_curso], function (error, result) {
            if(!error){
                res.status(200);
                return res.json({'success':true, 'id_curso':result.insertId});
            }else{
                res.status(500);
                return res.json({'success':false, 'err':error});
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
function ordenar2 (rows){
    //primer se ordenan las filas por ano y semestre (desc ambos)
    var listaOrdenada = _.map(_.sortByOrder(rows, ['nombre_curso','ano', 'semestre'], ['desc','desc', 'desc']));
    //luego se mapean agrupandolas por ano y semestre, y se retorna un objeto con el nombre del semestre
    //y los cursos correspondientes

    var lista = _.chain(listaOrdenada)
        .map(function (item) {
            return _.extend({},item,{'asignatura':item.nombre_curso});
        })
        .groupBy('asignatura')
        .pairs()
        .map(function (item) {
            _.forEach(item, function (element) {
                var id_asignatura = null;
                if(_.isArray(element)){
                    _.forEach(element, function (element2) {
                            id_asignatura = element2.id_asignatura;
                        });
                    item.push(id_asignatura);
                }
            });
            return _.object(_.zip(['asignatura','cursos', 'id_asignatura'], item, item.id_asignatura));
        });
    var values = _(lista).reverse().value();
    _.sortByOrder(values,['asignatura'],['desc']);
    return values;
};
router.post('/obtenerCursos', function (req, res) {
    if(!req.body){
        return res.sendStatus(400);
    }else{
        if(req.body.tipo == 'profesor'){
            connection.query('SELECT id_curso, id_asignatura, id_calendario, ano, semestre, nombre_curso, meta FROM curso WHERE id_user = ?',[req.body.id_user], function (error, rows) {
                if(!error){
                    return res.json({'success':true, 'result':ordenar2(rows)});
                }else{
                    return res.json({'success':false, 'err':error});
                }
            });
        }else if(req.body.tipo == 'estudiante'){
            connection.query('SELECT c.id_curso, c.nombre_curso, c.semestre, c.ano FROM pertenece ec INNER JOIN estudiante e ON ec.id_user=e.id_user INNER JOIN curso c ON ec.id_curso = c.id_curso WHERE e.id_user = ?',[req.body.id_user], function (error, rows) {
                if (!error) {
                    return res.json({'success':true, 'result':ordenar(rows)});
                } else {
                    return res.json({'success':false, 'err':error});
                }
            });
        }else{

        }
    }
});
router.post('/obtenerModulos', function (req, res) {
    if(!req.body){
        return res.sendStatus(400);
    }else{
        connection.query('SELECT * FROM modulo WHERE id_curso = ?',[req.body.id_curso], function (error, rows) {
            if(!error){
                return res.json({'success':true, 'result':rows});
            }else{
                return res.json({'success':false, 'err':error});
            }
        });
    }
});

router.post('/crearModulo', function (req, res) {
    if(!req.body){
        return res.sendStatus(400);
    }else{
        connection.query('INSERT INTO modulo (id_curso, nombre_modulo, posicion) VALUES (?,?,?)',[req.body.id_curso, req.body.nombre_modulo, req.body.posicion], function (error, result) {
            if(!error){
                res.status(200);
                return res.json({'success':true, 'id_modulo':result.insertId});
            }else{
                res.status(500);
                return res.json({'success':false, 'err':error});
            }
        });
    }
});
router.post('/actualizarModulo', function (req, res) {
    if(!req.body){
        return res.sendStatus(400);
    }else{
        connection.query('UPDATE modulo SET nombre_modulo = ?, posicion = ? WHERE id_modulo = ?',[req.body.nombre_modulo, req.body.posicion, req.body.id_modulo], function (error) {
            if(!error){
                res.status(200);
                return res.json({'success':true});
            }else{
                res.status(500);
                return res.json({'success':false, 'err':error});
            }
        });
    }
});
router.post('/eliminarModulo', function (req, res) {
    if(!req.body){
        return res.sendStatus(400);
    }else{
        connection.query('DELETE FROM modulo WHERE id_modulo = ?',[req.body.id_modulo], function (error) {
            if(!error){
                res.status(200);
                return res.json({'success':true});
            }else{
                res.status(500);
                return res.json({'success':false, 'err':error});
            }
        });
    }
});
router.post('/establecerMeta', function (req, res) {
    if(!req.body){
        return res.sendStatus(400);
    }else{
        connection.query('UPDATE curso SET meta = ? WHERE id_curso = ?',[req.body.meta, req.body.curso.id_curso], function (error) {
            if(!error){
                res.status(200);
                return res.json({'success':true});
            }else{
                res.status(500);
                return res.json({'success':false, 'err':error});
            }
        });
    }
});
module.exports = router;