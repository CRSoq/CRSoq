'use strict';
crsApp.controller('SocketController', function ($scope,$rootScope,toastr,SocketServices, SessionServices) {
    // .-
    var dataSesion = SessionServices.getSessionData();
    if(_.isNull(SocketServices.getSocket())){
        SocketServices.connect();

        if(!_.isUndefined(dataSesion.usuario)){
            SocketServices.emit('EnviarDatos', dataSesion);
        }
    }

    //-----
    SocketServices.on('sesionAbierta', function (data) {
        //avisar de que se abrio una sala
        toastr.success('En el curso de '+data.curso+' se ha iniciado una sesión de preguntas.','Sesión de preguntas');
        //cambia en el controlador el estado de la sesion
        $rootScope.$emit('activarSesion', data.id_clase);
    });

    SocketServices.on('agregarParticipante', function (dataUsuario) {
        if(dataSesion.tipo == 'profesor'){
            $rootScope.$emit('agregarEstudiante', dataUsuario);
            //emit to controller el usuario...
        }
    });
    SocketServices.on('Pregunta', function (data) {
        $rootScope.$emit('preguntaSesion', data);
    });

    SocketServices.on('finParticipacion', function () {
        $rootScope.$emit('finParticipacionEstudiantes');
    });

    SocketServices.on('turnoRespuesta', function () {
        $rootScope.$emit('turnoParaResponder');
    });

    SocketServices.on('respuestaEstudianteIncorrecta', function () {
        //respondi mal, mostrar mensaje.
        $rootScope.$emit('mostrarResultadoIncorrecto');
    });

    SocketServices.on('continuarPregunta', function (participante) {
        //cambiar estado de la lista eliminando el participante
        $rootScope.$emit('finParticipacionEstudiantes');
        $rootScope.$emit('actualizarEstadoLista', participante);
    });

    SocketServices.on('respuestaEstudianteCorrecta', function () {
        //respondi mal, mostrar mensaje.
        $rootScope.$emit('mostrarResultadoCorrecto');
    });

    SocketServices.on('continuarSesion', function () {
        //cambiar estado de la lista eliminando el participante
        $rootScope.$emit('continuarSesionPreguntas');
    });

    SocketServices.on('finSesion', function (data) {

        SocketServices.emit('SalirSala', data);
        $rootScope.$emit('SalirSesion');
    });
});