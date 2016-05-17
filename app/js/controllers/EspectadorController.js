crsApp.controller('EspectadorController', function($scope, $rootScope, $mdDialog, $stateParams, toastr, CursosServices, CalendarioServices, AsignaturasServices, SessionServices) {
    $scope.estado = 'Buscando sesión, espere por favor...';
    $scope.sesion_id = null;
    $scope.preguntaRealizada = false;
    $scope.participanteSeleccionado = false;

    $rootScope.$on('sesionEspectador', function (event, data) {
        $scope.estado = 'Realizando pregunta, espere por favor ...';
        cargarSesion(data);
    });

    var cargarSesion = function (sesion) {
        if(!_.isUndefined(sesion.pregunta)){
            $scope.pregunta = sesion.pregunta.pregunta;
            $scope.preguntaRealizada = true;
            $scope.listaParticipantes = _.cloneDeep(sesion.pregunta.listaParticipantes);
            if(sesion.pregunta.participacion){
                _.forEach($scope.listaParticipantes, function (estudiante) {
                    if(estudiante.turno){
                        $scope.participanteSeleccionado = true;
                        $scope.participacion = 'Responde: '+estudiante.nombre+' '+estudiante.apellido;
                        estudiante.estado_part_preg = 'seleccionado';
                    }
                })
            }
        }
    };

    $rootScope.$on('actualizarListaParticipantes', function (event, data) {
        $scope.listaParticipantes=[];
        $scope.listaParticipantes = _.cloneDeep(data);
    });

    $rootScope.$on('preguntaSesion', function (event, data) {
        $scope.pregunta = data.pregunta;
        $scope.preguntaRealizada = true;
    });

    $rootScope.$on('participanteSeleccionado', function (event, data) {
        //toastr.success('Es el turno de '+data.nombre+' '+data.apellido);
        $scope.participanteSeleccionado = true;
        var estudiante = _.findWhere($scope.listaParticipantes, {id_user:data.id_user});
        if(!_.isUndefined(estudiante)){
            $scope.participacion = 'Responde: '+estudiante.nombre+' '+estudiante.apellido;
            estudiante.estado_part_preg = 'seleccionado';
        }

    });
    $rootScope.$on('respuestaIncorrectaContinuar', function (event, data) {
        var estudiante = _.findWhere($scope.listaParticipantes, {id_user:data.id_user});
        if(!_.isUndefined(estudiante)){
            $scope.participacion = estudiante.nombre+' '+estudiante.apellido+' ha respondido de forma incorrecta, lo siento.';
        }
    });
    //
    //$rootScope.$on('finParticipacionEstudiantes', function () {
    //    $scope.preguntaRealizada = false;
    //});
    //
    //$rootScope.$on('continuarSesionPreguntas', function (event, data) {
    //    $scope.pregunta = null;
    //    $scope.listaParticipantes=null;
    //
    //    //view control
    //    $scope.esperar = true; //mostar esperar por la pregunta
    //    $scope.preguntaRealizada = false;
    //});
    //
    //$rootScope.$on('actualizarListaParticipantes', function (event, data) {
    //    $scope.listaParticipantes=[];
    //    $scope.listaParticipantes = _.cloneDeep(data);
    //});

});