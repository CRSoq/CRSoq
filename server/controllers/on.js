var querystring = require('querystring');
var http        = require('http');
var _           = require('lodash');

module.exports = function (io) {
    var usuarios = [];
    io.on('connection', function(socket){

        //obtener cursos del usuario
        socket.on('EnviarDatos', function (data) {
            var body = JSON.stringify(data);
            var options = {
                host: '127.0.0.1',
                port: 3000,
                path: '/cursos/obtenerCursos',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json;charset=UTF-8',
                    "Content-Length": Buffer.byteLength(body)
                }
            };

            var req = new http.request(options, function(res) {
                //console.log('STATUS: ' + res.statusCode);
                //console.log('HEADERS: ' + JSON.stringify(res.headers));
                res.setEncoding('utf8');
                res.on('data', function (chunk) {
                    var datos = JSON.parse(chunk);
                    //console.log(datos);
                    var user = _.findWhere(usuarios, {'usuario': data.usuario});
                    if(_.isUndefined(user)){
                        usuarios.push({
                            'usuario'   :data.usuario,
                            'tipo'      :data.tipo,
                            'token'     :data.token,
                            'id_user'   :data.id_user,
                            'socketId'  :socket.client.id,
                            'cursos'    :datos
                        });
                    }else{
                        user.socketId   = socket.client.id;
                        user.cursos     = datos;
                    }
                });
            });

            req.on('error', function(e) {
                //console.log('problem with request: ' + e.message);
            });

            req.write(body);
            req.end();

            //registar usuario, socket, cursos
            }
        );

        //crear la sesion de preguntas (por el profesor)
        socket.on('iniciarSesion', function (data) {
            socket.join(data.nombreSala);
            var i = 0;
            while(i<usuarios.length){
                if(socket.id != usuarios[i].socketId){
                    var user = _.findWhere(usuarios[i].cursos, {'nombre':data.semestre});
                    if(!_.isUndefined(user)){
                        var user_curso = _.findWhere(user.cursos, {'nombre_curso':data.curso});
                        if(!_.isUndefined(user_curso)){
                            console.log(usuarios[i].usuario);
                            //emitir aviso de ingreso al usuario [i]
                            io.to(usuarios[i].socketId).emit('sesionAbierta', data);
                        }
                    }
                }
                i++;
            }
        });

        //ingresar a la sala
        socket.on('IngresarASala', function (data) {
            socket.join(data.nombreSala);
        });

        //realizar pregunta dentro de la sesion (por el profesor)
        socket.on('RealizarPregunta', function (data) {
            io.to(data.sala).emit('Pregunta', data.pregunta);
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
    });


};