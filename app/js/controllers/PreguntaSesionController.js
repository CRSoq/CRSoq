//este mono controla la pregunta activa durante la sesion
//por medio del service ingresa la pregunta
//                      devuelve ganador/null

crsApp.controller('PreguntaSesionProfesorController', function ($scope, $rootScope, $q, $state, $stateParams, $timeout, SocketServices, PreguntasServices) {
    $scope.listaParticipantes=[];
    $scope.preguntaFinalizada = false;
    $scope.responder = false;

    var deferred = $q.defer();
    $scope.cargando = deferred.promise;

    PreguntasServices.obtenerPreguntaPorId({'id_pregunta':$stateParams.id_pregunta})
        .then(function (response) {
            $scope.pregunta= _.cloneDeep(response.result);
        }, function (error) {
            //error
        });

    $scope.cerrarParticipacion = function () {
        //emit fin de la pregunta
        SocketServices.emit('cerrarParticipacion');
        //activar opcion para seleccionar
        $scope.preguntaFinalizada = true;
        //$scope.responder = false;
        deferred.resolve();
    };

    $scope.finalizarPregunta = function (pregunta) {
        pregunta.estado_pregunta = 'realizada';
        PreguntasServices.actualizarEstadoPregunta(pregunta)
            .then(function (response) {
                SocketServices.emit('FinalizarPregunta');
                $state.transitionTo('crsApp.asignatura.curso.clases.sesion', {
                    nombre_asignatura:$stateParams.nombre_asignatura,
                    semestre:$stateParams.semestre,
                    ano:$stateParams.ano,
                    id_curso:$stateParams.id_curso,
                    id_clase:$stateParams.id_clase});

            }, function (error) {
            //error
            });
        //cerrar pregunta dejar con o sin ganador
    };

    $scope.seleccionarEstudiante = function (participante) {
        $scope.estudianteSeleccionado = participante;
        SocketServices.emit('responderParticipante', participante);
        $scope.responder = true;
    };

    $rootScope.$on('agregarEstudiante', function (event, data) {
        if(_.findIndex($scope.listaParticipantes,{rut:data.rut})<0){
            $scope.listaParticipantes.push(data);
            SocketServices.emit('actualizarListaParticipantes', $scope.listaParticipantes);
        }
    });

    $scope.respuestaCorrecta = function (pregunta) {
        var data = {
            'id_pregunta'  : pregunta.id_pregunta,
            'id_user'   : $scope.estudianteSeleccionado.id_user,
            'estado_part_preg' : 'ganador'
        };
        //para estudiantes cambiar estado a esperar por pregunta
        SocketServices.emit('respuestaCorrecta', $scope.estudianteSeleccionado);

        PreguntasServices.asignarEstadoParticipacionPregunta(data)
            .then(function (response) {
                $rootScope.$emit('continuarSesionPreguntas');
                $state.transitionTo('crsApp.asignatura.curso.clases.sesion', {
                    nombre_asignatura:$stateParams.nombre_asignatura,
                    semestre:$stateParams.semestre,
                    ano:$stateParams.ano,
                    id_curso:$stateParams.id_curso,
                    id_clase:$stateParams.id_clase});
                pregunta.estado_pregunta= 'realizada';
                PreguntasServices.actualizarEstadoPregunta(pregunta)
                    .then(function (response) {

                    }, function (error) {
                        //error
                    });

            }, function (error) {
                //error
            });
        //cambiar ruta profesor, volver a preguntas
    };
    $scope.respuestaIncorrecta = function (pregunta) {
        var data = {
            'id_pregunta'  : pregunta.id_pregunta,
            'id_user'   : $scope.estudianteSeleccionado.id_user,
            'estado_part_preg' : 'perdedor'
        };

        PreguntasServices.asignarEstadoParticipacionPregunta(data)
            .then(function (response) {
                //volver a mostrar la lista profesor
                $scope.responder = false;
                //notificar al estudiante del resultado
                $scope.estudianteSeleccionado.seleccionado = true;
                SocketServices.emit('respuestaIncorrecta', $scope.estudianteSeleccionado);
                $scope.estudianteSeleccionado = null;
            }, function (error) {
                //error
            });
    };


});

crsApp.controller('PreguntaSesionController', function ($scope, $rootScope, $state, $stateParams, $timeout, PreguntasServices, SocketServices, SessionServices) {
    $scope.listaParticipantes=[];
    //view control
    $scope.esperar = true; //mostar esperar por la pregunta
    $scope.preguntaRealizada = false; //mostrar pregunta hecha por el profesor
    $scope.participar = false; //mostrar boton participar
    $scope.participantes = false; //mostrar lista de participantes
    $scope.responder = false; //mostrar cuando le toca responder
    $scope.resultado = false; //mostrar si esta correcta o no la respuesta

    $scope.preguntaFinalizada = false;

    $rootScope.$on('preguntaSesion', function (event, data) {
        $scope.pregunta = data;
        $scope.esperar = false;
        $scope.participar = true;
        $scope.preguntaRealizada = true;
    });

    $rootScope.$on('finParticipacionEstudiantes', function () {
        $scope.esperar = false;
        $scope.participar = false;
        $scope.preguntaRealizada = true;
        $scope.participantes = true;
    });

    //boton responder pregunta
    $scope.responderPregunta = function (pregunta) {
        var dataUsuario = SessionServices.getSessionData();
        SocketServices.emit('responderPregunta', dataUsuario);
        var data = {
            'id_pregunta'  : pregunta.id_pregunta,
            'id_user'   : dataUsuario.id_user,
            'estado_part_preg' : 'noSeleccionado'
        };

        PreguntasServices.participarEnPregunta(data)
            .then(function (response) {
                //correct
            }, function (error) {
                //error
            });
        $scope.participar = false;
        $scope.participantes = true;

    };

    //actualizar la lista de participantes
    SocketServices.on('listaParticipantes', function (listaParticipantes) {
        $scope.listaParticipantes = listaParticipantes;
    });

    $rootScope.$on('actualizarEstadoLista', function (event, data) {
        var participante = _.findWhere($scope.listaParticipantes, {'usuario':data.usuario});
        participante.seleccionado = true;
    });

    $rootScope.$on('turnoParaResponder', function () {
        $scope.esperar = false;
        $scope.participar = false;
        $scope.preguntaRealizada = true;
        $scope.participantes = false;
        $scope.responder = true;
    });

    $rootScope.$on('mostrarResultadoIncorrecto', function (event, data) {
        $scope.esperar = false;
        $scope.participar = false;
        $scope.preguntaRealizada = true;
        $scope.participantes = false;
        $scope.responder = false;
        $scope.resultado = true;
        $scope.msjResultado = "Lo siento, tu respuesta no es correcta.";
    });
    $rootScope.$on('mostrarResultadoCorrecto', function (event, data) {
        $scope.esperar = false;
        $scope.participar = false;
        $scope.preguntaRealizada = true;
        $scope.participantes = false;
        $scope.responder = false;
        $scope.resultado = true;
        $scope.msjResultado = "Tu respuesta no es correcta !!";
    });

    $rootScope.$on('continuarSesionPreguntas', function (event, data) {
        $scope.pregunta = null;
        $scope.listaParticipantes=null;

        //view control
        $scope.esperar = true; //mostar esperar por la pregunta
        $scope.preguntaRealizada = false; //mostrar pregunta hecha por el profesor
        $scope.participar = false; //mostrar boton participar
        $scope.participantes = false; //mostrar lista de participantes
        $scope.responder = false; //mostrar cuando le toca responder
        $scope.resultado = false; //mostrar si esta correcta o no la respuesta
        $scope.preguntaFinalizada = false;
    });

    $rootScope.$on('SalirSesion', function (event, data) {
        $state.transitionTo('crsApp.cursosSemestre.clases', {semestre:$stateParams.semestre,curso:$stateParams.curso});
    });
});