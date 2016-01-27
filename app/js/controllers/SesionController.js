crsApp.controller('SesionController', function($scope, $rootScope, $state, $stateParams, $timeout, SessionServices, CursosServices, ClasesServices, PreguntasServices, SocketServices){
    $scope.curso = $stateParams.curso;
    //obtener preguntas de la clase
    $scope.pregunta = null;
    $scope.listaPreguntasClase=[];
    $scope.listaParticipantes=[];

    //view control
    $scope.esperar = true; //mostar esperar por la pregunta
    $scope.preguntaRealizada = false; //mostrar pregunta hecha por el profesor
    $scope.participar = false; //mostrar boton participar
    $scope.participantes = false; //mostrar lista de participantes
    $scope.responder = false; //mostrar cuando le toca responder
    $scope.resultado = false; //mostrar si esta correcta o no la respuesta

    $scope.preguntaFinalizada = false;
    PreguntasServices.obtenerPreguntasClase({'id_clase':$stateParams.id_clase}).then(function (data) {
        if(data.error){
            console.log(data.err.code);
        }else{
            $scope.listaPreguntasClase= _.cloneDeep(data);
        }
    });
    //boton añadir pregunta de la biblioteca
    $scope.agregarPregunta = function (pregunta) {

    };
    //boton crear pregunta (agregar automaticamente a la clase y al módulo)
    $scope.crearPregunta = function (pregunta) {

    };
    //boton eliminar pregunta?
    $scope.eliminarPregunta = function (pregunta) {

    };
    //boton lanzar pregunta
    $scope.lanzarPregunta = function (pregunta) {

        $state.transitionTo('crsApp.cursosSemestre.clases.sesion.pregunta',{semestre:$stateParams.semestre,curso:$stateParams.curso,id_clase:$stateParams.id_clase,id_pregunta:pregunta.id_pregunta});
        var data = {
            'pregunta'  : pregunta,
            'sala'      : $stateParams.semestre+$stateParams.curso+$stateParams.id_clase
        };
        $scope.pregunta = pregunta;
        SocketServices.emit('RealizarPregunta', data);
    };
    //boton editar ganador
    $scope.editarGanadorPregunta = function (pregunta) {

    };
    //boton finalizar sesion
    $scope.finalizarSesion = function () {
        //emit fin de sesion
        //  cambiar estado en el front
        //cambiar estado en la bd
        //mover de la ruta
    };
    //boton proyectar sesion
    $scope.proyectarSesion = function () {

    };

    $scope.cerrarParticipacion = function () {
        //emit fin de la pregunta
        SocketServices.emit('cerrarParticipacion');
        //activar opcion para seleccionar
        $scope.preguntaFinalizada = true;
    };

    $scope.finalizarPregunta = function () {
        //
        $rootScope.$emit('continuarSesionPreguntas');
        $state.transitionTo('crsApp.cursosSemestre.clases.sesion', {semestre:$stateParams.semestre,curso:$stateParams.curso,id_clase:$stateParams.id_clase});
    };

    //boton responder pregunta
    $scope.responderPregunta = function () {
        var dataUsuario = SessionServices.getSessionData();
        SocketServices.emit('responderPregunta', dataUsuario);
        $scope.participar = false;
        $scope.participantes = true;

    };

    SocketServices.on('Pregunta', function (data) {
        $scope.pregunta = data;
        $scope.esperar = false;
        $scope.participar = true;
        $scope.preguntaRealizada = true;
    });

    $rootScope.$on('agregarEstudiante', function (event, data) {
        if(_.findIndex($scope.listaParticipantes,{rut:data.rut})<0){
            $scope.listaParticipantes.push(data);
            SocketServices.emit('actualizarListaParticipantes', $scope.listaParticipantes);
        }
    });

    SocketServices.on('listaParticipantes', function (listaParticipantes) {
        $scope.listaParticipantes = listaParticipantes;
    });


    $rootScope.$on('finParticipacionEstudiantes', function (event, data) {
        $scope.esperar = false;
        $scope.participar = false;
        $scope.preguntaRealizada = true;
        $scope.participantes = true;
    });

    $scope.seleccionarEstudiante = function (participante) {
        $scope.estudianteSeleccionado = participante;
        SocketServices.emit('responderParticipante', participante);
        $scope.responder = true;
    };

    $rootScope.$on('turnoParaResponder', function (event, data) {
        $scope.esperar = false;
        $scope.participar = false;
        $scope.preguntaRealizada = true;
        $scope.participantes = false;
        $scope.responder = true;
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
            if(data){
                $rootScope.$emit('continuarSesionPreguntas');
                $state.transitionTo('crsApp.cursosSemestre.clases.sesion', {semestre:$stateParams.semestre,curso:$stateParams.curso,id_clase:$stateParams.id_clase});
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
    $rootScope.$on('actualizarEstadoLista', function (event, data) {
        var participante = _.findWhere($scope.listaParticipantes, {'usuario':data.usuario});
        participante.seleccionado = true;
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
