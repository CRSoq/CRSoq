'use strict';
crsApp.controller('SocketController', function ($scope,$rootScope,$timeout,SocketServices, SessionServices) {
    // manejo de alertas.-
    $scope.alerts = [];
    $scope.closeAlert = function(index) {
        $scope.alerts.splice(index, 1);
    };
    var closeAlert = function(id_alert) {
        $timeout(function(){
            $scope.alerts.splice(_.findIndex($scope.alerts,{id:id_alert}), 1);
        }, 3000);
    };

    var closeAlertTime= function(id_alert, mlsec) {
        $timeout(function(){
            $scope.alerts.splice(_.findIndex($scope.alerts,{id:id_alert}), 1);
        }, mlsec);
    };
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
        var id_alert = $scope.alerts.length+1;
        $scope.alerts.push({id: id_alert,type:'success', msg:'. '+data.semestre+' '+data.curso});
        //closeAlertTime(id_alert, 10000);
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
});