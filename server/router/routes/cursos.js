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
        connection.query('INSERT INTO curso SET id_user = ?, nombre_curso = ?, semestre = ?, ano = ? ',[req.body.id_user, req.body.nombre,req.body.semestre, req.body.ano], function (error) {
            if(!error){
                return res.send('add');
            }
        });

    }
});

router.post('/obtenerCursos', function (req, res) {
    if(!req.body){
        return res.sendStatus(400);
    }else{
        if(req.body.tipo == 'profesor'){
            connection.query('SELECT id_curso, nombre_curso, semestre, ano FROM curso WHERE id_user = ?',[req.body.id_user, req.body.usuario], function (error, rows) {
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
                    var algo = lista;
                    _(algo).reverse().value();
                    res.json(_(algo).reverse().value());
                }
            });
        }
    }
});
module.exports = router;