//este mono controla la pregunta activa durante la sesion
//por medio del service ingresa la pregunta
//                      devuelve ganador/null

crsApp.controller('PreguntaSesionProfesorController', function ($scope, $rootScope, $state, $stateParams, $timeout, SocketServices, PreguntasServices) {
    $scope.listaParticipantes=[];
    $scope.preguntaFinalizada = false;
    $scope.responder = false;
    PreguntasServices.obtenerPreguntaPorId($stateParams.id_pregunta).then(function (data) {
        if(data.error!=true){
            $scope.pregunta=data;
        }
    });

    $scope.cerrarParticipacion = function () {
        //emit fin de la pregunta
        SocketServices.emit('cerrarParticipacion');
        //activar opcion para seleccionar
        $scope.preguntaFinalizada = true;
        //$scope.responder = false;
    };

    $scope.finalizarPregunta = function () {
        $rootScope.$emit('continuarSesionPreguntas');
        $state.transitionTo('crsApp.cursosSemestre.clases.sesion', {semestre:$stateParams.semestre,curso:$stateParams.curso,id_clase:$stateParams.id_clase});
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
            'pregunta'  : pregunta,
            'id_user'   : $scope.estudianteSeleccionado.id_user
        };
        //para estudiantes cambiar estado a esperar por pregunta
        SocketServices.emit('respuestaCorrecta', $scope.estudianteSeleccionado);
        //update bd,$scope.estudianteSeleccionado.id_user add to table pregunta where id_pregunta = pregunta

        PreguntasServices.asignarGanador(data).then(function (data) {
            if(data.error!=true){
                $rootScope.$emit('continuarSesionPreguntas');
                $state.transitionTo('crsApp.cursosSemestre.clases.sesion', {semestre:$stateParams.semestre,curso:$stateParams.curso,id_clase:$stateParams.id_clase});
            }else{
                //error
            }
        });
        //cambiar ruta profesor, volver a preguntas
    };
    $scope.respuestaIncorrecta = function () {
        //volver a mostrar la lista profesor
        $scope.responder = false;
        //notificar al estudiante del resultado
        $scope.estudianteSeleccionado.seleccionado = true;
        SocketServices.emit('respuestaIncorrecta', $scope.estudianteSeleccionado);
        $scope.estudianteSeleccionado = null;
    };
});

crsApp.controller('PreguntaSesionController', function ($scope, $rootScope, $state, $stateParams, $timeout, SocketServices, SessionServices) {
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
    $scope.responderPregunta = function () {
        var dataUsuario = SessionServices.getSessionData();
        SocketServices.emit('responderPregunta', dataUsuario);
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
});