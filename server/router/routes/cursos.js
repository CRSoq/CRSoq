var express     = require('express');
var router      = express.Router();
var mysql       = require('mysql');
var db          = require('./config');
var connection  = mysql.createConnection(db.database);

router.post('/crearCurso', function (req, res) {
    if(!req.body){
        return res.sendStatus(400);
    }else{
        connection.query();
    }
});

router.post('/obtenerCursos', function (req, res) {
    if(!req.body){
        return res.sendStatus(400);
    }else{
        connection.query();
    }
});
module.exports = router;