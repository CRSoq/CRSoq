crsApp.controller('SocketController', function ($scope,$rootScope,toastr,SocketServices, SessionServices) {
    // .-
    var dataSesion = SessionServices.getSessionData();
    if(_.isNull(SocketServices.getSocket())){
        SocketServices.connect();

        if(!_.isUndefined(dataSesion.usuario)){
            SocketServices.emit('EnviarDatos', dataSesion);
        }
    }
    $scope.entrar = function (data) {
        console.log(data);
    };
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
    });

    SocketServices.on('turnoRespuesta', function () {
        $rootScope.$emit('turnoParaResponder');
    });

    SocketServices.on('respuestaEstudianteIncorrecta', function () {
        //respondi mal, mostrar mensaje.
        toastr.error('Tu respuesta es incorrecta.', 'Lo siento', {
            iconClass: 'perdedor'
        });
        $rootScope.$emit('mostrarResultadoIncorrecto');
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
});