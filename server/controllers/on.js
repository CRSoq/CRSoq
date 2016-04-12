var querystring = require('querystring');
var http        = require('http');
var _           = require('lodash');
var db          = require('./config');
var mysql       = require('mysql');
var connection  = mysql.createConnection(db.database);

module.exports = function (io) {
    var usuarios = [];
    io.on('connection', function(socket){

        //obtener cursos del usuario
        socket.on('EnviarDatos', function (req, res) {
            connection.query('SELECT * FROM curso WHERE id_user = ?',[req.id_user], function (error, rows) {
                if(!error){
                    var user = _.findWhere(usuarios, {'usuario': req.usuario});
                    var ingresoUsuario = function (data) {
                        if(_.isUndefined(user)){
                            usuarios.push({
                                'usuario'   :req.usuario,
                                'tipo'      :req.tipo,
                                'token'     :req.token,
                                'id_user'   :req.id_user,
                                'socketId'  :socket.client.id,
                                'cursos'    :data
                            });

                        }else{
                            user.socketId   = socket.client.id;
                            user.cursos     = data;
                        }
                        console.log(usuarios.length);
                        console.log("");
                        console.log(usuarios);
                    };

                    if(req.tipo == 'profesor'){
                        connection.query('SELECT id_curso, id_asignatura, id_calendario, ano, semestre, estado_curso, nombre_curso FROM curso WHERE id_user = ?',[req.id_user], function (error, rows) {
                            if(!error) {
                                ingresoUsuario(rows);
                            }
                        });

                    }else if(req.tipo == 'estudiante'){
                            connection.query('SELECT c.id_curso, c.nombre_curso, c.semestre, c.ano, c.estado_curso FROM pertenece ec INNER JOIN estudiante e ON ec.id_user=e.id_user INNER JOIN curso c ON ec.id_curso = c.id_curso WHERE e.id_user = ?',[req.id_user], function (error, rows) {
                                if (!error) {
                                    ingresoUsuario(rows);
                                }
                            });
                    }else if(req.tipo == 'administrador'){
                            //retornar todos los cursos disponibles
                    }else{
                            //no se le permite el acceso
                    }
                }
            });
        });

        //crear la sesion de preguntas (por el profesor)
        socket.on('iniciarSesion', function (data) {
            socket.join(data.sala);
            var i = 0;
            while(i<usuarios.length){
                if(socket.id != usuarios[i].socketId){
                    var user = _.findWhere(usuarios[i].cursos, {'id_curso':data.id_curso});
                    if(!_.isUndefined(user)){
                            console.log(usuarios[i].usuario);
                            //emitir aviso de ingreso al usuario [i]
                            io.to(usuarios[i].socketId).emit('sesionAbierta', data);
                    }
                }
                i++;
            }
        });

        //ingresar a la sala
        socket.on('IngresarASala', function (data) {
            socket.join(data.sala);
        });

        socket.on('SalirSala', function (data) {
            socket.leave(data.sala);
        });

        //realizar pregunta dentro de la sesion (por el profesor)
        socket.on('RealizarPregunta', function (data) {
            io.to(data.sala).emit('Pregunta', data.pregunta);
        });

        socket.on('FinalizarPregunta', function (data) {
            io.to(socket.rooms[1]).emit('continuarSesion');
        });
        //responder pregunta
        socket.on('responderPregunta', function (dataUsuario) {
            socket.broadcast.to(socket.rooms[1]).emit('agregarParticipante', dataUsuario);
        });

        socket.on('actualizarListaParticipantes', function (listaParticipantes) {
            socket.broadcast.to(socket.rooms[1]).emit('listaParticipantes', listaParticipantes);
        });

        socket.on('cerrarParticipacion', function () {
            socket.broadcast.to(socket.rooms[1]).emit('finParticipacion');
        });

        socket.on('responderParticipante', function (participante) {
            var estudianteSeleccionado = _.findWhere(usuarios, {'usuario':participante.usuario});
            socket.broadcast.to(estudianteSeleccionado.socketId).emit('turnoRespuesta');
        });

        socket.on('respuestaIncorrecta', function (participante) {
            var estudianteSeleccionado = _.findWhere(usuarios, {'usuario':participante.usuario});
            socket.broadcast.to(estudianteSeleccionado.socketId).emit('respuestaEstudianteIncorrecta');
            socket.broadcast.to(socket.rooms[1]).emit('continuarPregunta', participante);
        });
        socket.on('respuestaCorrecta', function (participante) {
            var estudianteSeleccionado = _.findWhere(usuarios, {'usuario':participante.usuario});
            socket.broadcast.to(estudianteSeleccionado.socketId).emit('respuestaEstudianteCorrecta');
            socket.broadcast.to(socket.rooms[1]).emit('continuarSesion');
        });

        socket.on('finalizarSesion', function (data) {
            //avisar a los de la sala que la dejen porque se termino la sesion
            //yo dejo la sala
            io.to(data.sala).emit('finSesion',data);
        });
    });


};