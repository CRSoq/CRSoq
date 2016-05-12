var querystring = require('querystring');
var http        = require('http');
var _           = require('lodash');
var db          = require('./config');
var mysql       = require('mysql');
var connection  = mysql.createConnection(db.database);

module.exports = function (io) {
    var usuarios = [];
    _.extend(io,{sesiones:[]});
    io.on('connection', function(socket){
        //obtener cursos del usuario
        socket.on('EnviarDatos', function (req, res) {
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
                //console.log(usuarios.length);
                //console.log("");
                //console.log(usuarios);
            };

            if(req.tipo == 'profesor'){
                connection.query('SELECT id_curso, id_asignatura, id_calendario, ano, semestre, nombre_curso FROM curso WHERE id_user = ?',[req.id_user], function (error, rows) {
                    if(!error) {
                        ingresoUsuario(rows);
                    }
                });

            }else if(req.tipo == 'estudiante'){
                    connection.query('SELECT c.id_curso, c.nombre_curso, c.semestre, c.ano FROM pertenece ec INNER JOIN estudiante e ON ec.id_user=e.id_user INNER JOIN curso c ON ec.id_curso = c.id_curso WHERE e.id_user = ?',[req.id_user], function (error, rows) {
                        if (!error) {
                            ingresoUsuario(rows);
                        }
                    });
            }else if(req.tipo == 'administrador'){
                    //retornar todos los cursos disponibles
            }else{
                    //no se le permite el acceso
            }

        });

        //crear la sesion de preguntas (por el profesor)
        socket.on('iniciarSesion', function (data) {
            socket.join(data.sala);
            var i = 0;
            while(i<usuarios.length){
                if(socket.id != usuarios[i].socketId){
                    var user = _.findWhere(usuarios[i].cursos, {'id_curso':data.id_curso});
                    if(!_.isUndefined(user)){
                            //console.log(usuarios[i].usuario);
                            //emitir aviso de ingreso al usuario [i]
                            io.to(usuarios[i].socketId).emit('sesionAbierta', data);
                    }
                }
                i++;
            }
            io.sesiones.push(data);
        });

        //ingresar a la sala
        socket.on('IngresarASala', function (data) {
            socket.join(data.sala);
        });
        //profesor
        socket.on('ContinuarSesion', function (data) {
            socket.join(data.sala);
            var indexSesion = _.findIndex(io.sesiones, {sala:data.sala});
            if(indexSesion<0){
                io.sesiones.push(data);
            }
        });
        socket.on('SolicitarEstado', function (data) {
            var indexSesion = _.findIndex(io.sesiones, {sala:data.sala});
            if(indexSesion>=0){
                if(!_.isUndefined(io.sesiones[indexSesion].pregunta)){
                    io.to(socket.id).emit('SesionActiva', io.sesiones[indexSesion]);
                    if(_.isUndefined(socket.rooms[1])){
                        socket.join(data.sala);
                    }
                }
            }
        });
        socket.on('SolicitarEstadoPregunta', function (data) {
            var indexSesion = _.findIndex(io.sesiones, {sala:data.sala});
            if (indexSesion>=0) {
                var pregunta = _.findWhere(io.sesiones[indexSesion], {id_pregunta: data.id_pregunta});
                if (!_.isUndefined(pregunta)) {
                        io.to(socket.id).emit('EstadoPregunta', pregunta);
                }
            }
        });
        socket.on('SalirSala', function (data) {
            socket.leave(data.sala);
        });

        //realizar pregunta dentro de la sesion (por el profesor)
        socket.on('RealizarPregunta', function (data) {
            io.to(data.sala).emit('Pregunta', data.pregunta);
            var indexSesion = _.findIndex(io.sesiones, {sala:data.sala});
            data.pregunta.participacion = true;
            data.pregunta.listaParticipantes = [];
            _.extend(io.sesiones[indexSesion],{pregunta:data.pregunta});
        });

        socket.on('FinalizarPregunta', function (data) {
            io.to(socket.rooms[1]).emit('continuarSesion');
            var indexSesion = _.findIndex(io.sesiones, {sala:socket.rooms[1]});
            if(indexSesion>=0){
                delete io.sesiones[indexSesion].pregunta;
            }
        });
        //responder pregunta
        socket.on('responderPregunta', function (dataUsuario) {
            var indexSesion = _.findIndex(io.sesiones, {sala:socket.rooms[1]});
            if(indexSesion>=0){

                if (!_.isUndefined(io.sesiones[indexSesion].pregunta.listaParticipantes)) {
                    var miIndex = _.findIndex(io.sesiones[indexSesion].pregunta.listaParticipantes, {id_user: dataUsuario.id_user});
                    if (io.sesiones[indexSesion].pregunta.participacion == true && miIndex < 0) {
                        io.sesiones[indexSesion].pregunta.listaParticipantes.push(dataUsuario);
                    }
                    io.to(socket.rooms[1]).emit('listaParticipantes', io.sesiones[indexSesion].pregunta.listaParticipantes);
                }
            }
        });

        socket.on('cerrarParticipacion', function () {
            socket.broadcast.to(socket.rooms[1]).emit('finParticipacion');
            var indexSesion = _.findIndex(io.sesiones, {sala:socket.rooms[1]});
            if(indexSesion>=0){
                io.sesiones[indexSesion].pregunta.participacion = false;
            }
        });

        socket.on('responderParticipante', function (participante) {
            var estudianteSeleccionado = _.findWhere(usuarios, {'usuario':participante.usuario});
            socket.broadcast.to(estudianteSeleccionado.socketId).emit('turnoRespuesta');
            var indexSesion = _.findIndex(io.sesiones, {sala:socket.rooms[1]});
            if(indexSesion>=0){
                _.findWhere(io.sesiones[indexSesion].pregunta.listaParticipantes,{id_user:estudianteSeleccionado.id_user}).turno = true;
            }
        });

        socket.on('respuestaIncorrecta', function (participante) {
            var estudianteSeleccionado = _.findWhere(usuarios, {'usuario':participante.usuario});
            socket.broadcast.to(estudianteSeleccionado.socketId).emit('respuestaEstudianteIncorrecta');
            socket.broadcast.to(socket.rooms[1]).emit('continuarPregunta', participante);
            var indexSesion = _.findIndex(io.sesiones, {sala:socket.rooms[1]});
            if(indexSesion>=0){
                var estudianteSeleccionadoSesion = _.findWhere(io.sesiones[indexSesion].pregunta.listaParticipantes,{id_user:estudianteSeleccionado.id_user});
                if(!_.isUndefined(estudianteSeleccionadoSesion)){
                    estudianteSeleccionadoSesion.turno = false;
                    estudianteSeleccionadoSesion.estado_part_preg = "perdedor";
                }
            }
        });
        socket.on('respuestaCorrecta', function (participante) {
            var estudianteSeleccionado = _.findWhere(usuarios, {'usuario':participante.usuario});
            socket.broadcast.to(estudianteSeleccionado.socketId).emit('respuestaEstudianteCorrecta');
            socket.broadcast.to(socket.rooms[1]).emit('continuarSesion');
            var indexSesion = _.findIndex(io.sesiones, {sala:socket.rooms[1]});
            if(indexSesion>=0){
                var estudianteSeleccionadoSesion = _.findWhere(io.sesiones[indexSesion].pregunta.listaParticipantes,{id_user:estudianteSeleccionado.id_user});
                if(!_.isUndefined(estudianteSeleccionadoSesion)){
                    estudianteSeleccionadoSesion.turno = false;
                    estudianteSeleccionadoSesion.estado_part_preg = "ganador";
                }
            }

        });

        socket.on('finalizarSesion', function (data) {
            //avisar a los de la sala que la dejen porque se termino la sesion
            //yo dejo la sala
            io.to(data.sala).emit('finSesion',data);
            var indexSesion = _.findIndex(io.sesiones, {sala:data.sala});
            if(indexSesion>=0){
                io.sesiones.splice(indexSesion,1);
            }
        });
        socket.on('actualizarListaClase', function (curso) {
            //avisar a los de la sala que la dejen porque se termino la sesion
            //yo dejo la sala
            _.forEach(usuarios, function (usuario) {
                var user = _.findWhere(usuario.cursos,{'id_curso':curso.id_curso});
                if(!_.isUndefined(user)){
                    io.to(usuario.socketId).emit('actualizarListaClase');
                }
            });

        });
    });
};