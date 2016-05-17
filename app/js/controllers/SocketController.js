crsApp.controller('SocketController', function ($scope,$rootScope,$location,toastr,SocketServices, SessionServices) {
    var dataSesion = SessionServices.getSessionData();
    if(_.isNull(SocketServices.getSocket())){
        SocketServices.connect();

        if(!_.isUndefined(dataSesion.usuario)){
            SocketServices.emit('EnviarDatos', dataSesion);
        }
    }
    //-----
    SocketServices.on('sesionAbierta', function (data) {
        toastr.warning('En '+data.curso+' se ha iniciado una sesión de preguntas.', 'Sesión abierta', {
            iconClass: 'nueva',
            timeOut: 0,
            extendedTimeOut: 0,
            tapToDismiss: false
        });
        $rootScope.$emit('activarSesion', data.id_clase);
    });

    SocketServices.on('agregarParticipante', function (dataUsuario) {
        if($rootScope.user.tipo == 'profesor'){
            $rootScope.$emit('agregarEstudiante', dataUsuario);
            //emit to controller el usuario...
        }
    });
    SocketServices.on('Pregunta', function (data) {
        $rootScope.$emit('preguntaSesion', data);
    });
    SocketServices.on('SesionActiva', function (data) {
        if($rootScope.user.tipo=='profesor'){
            $rootScope.$emit('cargarPregunta', data);
        }else if($rootScope.user.tipo=='estudiante'){
            $rootScope.$emit('cargarEstadoEstudiante', data);
        }
    });
    SocketServices.on('EstadoPregunta', function (data) {
        if($rootScope.user.tipo=='profesor'){
            $scope.$emit('cargarEstadoPregunta', data);
        }else if($rootScope.user.tipo=='estudiante'){
            //$rootScope.$emit('cargarSesion', data);
        }

    });
    SocketServices.on('finParticipacion', function () {
        $rootScope.$emit('finParticipacionEstudiantes');
        toastr.success('Participación cerrada');
    });

    SocketServices.on('turnoRespuesta', function () {
        $rootScope.$emit('turnoParaResponder');
    });
    SocketServices.on('participanteRespondiendo', function (data) {
        var dataUsuario = SessionServices.getSessionData();

        if(dataUsuario.id_user != data.id_user){
            toastr.success('Es el turno de '+data.nombre+' '+data.apellido);
            $rootScope.$emit('participanteSeleccionado', data);
        }else{
            $rootScope.$emit('turnoParaResponder');
        }
    });
    SocketServices.on('respuestaIncorrecta', function (data) {
        var dataUsuario = SessionServices.getSessionData();

        if(dataUsuario.id_user != data.id_user){
            $rootScope.$emit('respuestaIncorrectaContinuar', data);
        }else{
            $rootScope.$emit('respuestaIncorrectaUserContinuar', data);
        }
    });
    SocketServices.on('respuestaCorrecta', function (data) {
        var dataUsuario = SessionServices.getSessionData();

        if(dataUsuario.id_user != data.id_user){
            $rootScope.$emit('respuestaCorrectaContinuar', data);
        }else{
            $rootScope.$emit('respuestaCorrectaUserContinuar', data);
        }
    });
    SocketServices.on('continuarPregunta', function (participante) {
        //cambiar estado de la lista eliminando el participante
        $rootScope.$emit('finParticipacionEstudiantes');
        $rootScope.$emit('actualizarEstadoLista', participante);
    });
    SocketServices.on('listaParticipantes', function (listaParticipantes) {
        $rootScope.$emit('actualizarListaParticipantes', listaParticipantes);
    });
    SocketServices.on('respuestaEstudianteCorrecta', function () {
        toastr.success('Haz ganado un punto.', '¡Felicitaciones!', {
            closeButton: true,
            iconClass: 'ganador'
        });
        $rootScope.$emit('mostrarResultadoCorrecto');
    });

    SocketServices.on('continuarSesion', function () {
        //cambiar estado de la lista eliminando el participante
        $rootScope.$emit('continuarSesionPreguntas');
    });

    SocketServices.on('finSesion', function (data) {
        toastr.success('Sesión de preguntas finalizada');
        SocketServices.emit('SalirSala', data);
        $rootScope.$emit('SalirSesion', data);
    });
    SocketServices.on('actualizarListaClase', function (data) {
        $rootScope.$emit('actualizarListaDeClases');
    });

    SocketServices.on('actualizarSesion', function (data) {
        $rootScope.$emit('sesionEspectador', data);
    });

});