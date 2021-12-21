crsApp.controller('PreguntaSesionController', function ($scope, $rootScope, $state, $stateParams, $timeout, PreguntasServices, SocketServices, SessionServices, ClasesServices, EquiposServices, CursosServices, toastr) {
    $scope.listaParticipantes=[];
    //view control
    $scope.esperar = true; //mostar esperar por la pregunta
    $scope.preguntaRealizada = false; //mostrar pregunta hecha por el profesor
    $scope.participar = false; //mostrar boton participar
    $scope.participantes = false; //mostrar lista de participantes
    $scope.responder = false; //mostrar cuando le toca responder
    $scope.resultado = false; //mostrar si esta correcta o no la respuesta

    $scope.preguntaFinalizada = false;

    ClasesServices.obtenerEstadoSesion({id_clase:$stateParams.id_clase}).then(function (response) {
        if(response.success){
            if(response.result.estado_sesion=="cerrada"){
                $state.transitionTo('crsApp.asignatura.curso.clases', {
                    ano:$stateParams.ano,
                    semestre:$stateParams.semestre,
                    grupo_curso:$stateParams.grupo_curso,
                    nombre_asignatura:$stateParams.nombre_asignatura,
                    id_curso:$stateParams.id_curso});
            }
        }else{
            $state.transitionTo('crsApp.asignatura.curso.clases', {
                ano:$stateParams.ano,
                semestre:$stateParams.semestre,
                grupo_curso:$stateParams.grupo_curso,
                nombre_asignatura:$stateParams.nombre_asignatura,
                id_curso:$stateParams.id_curso});
        }
    });
    var infoSesion = {
        ano: Number($stateParams.ano),
        semestre: Number($stateParams.semestre),
        grupo_curso:$stateParams.grupo_curso,
        curso: $stateParams.nombre_asignatura,
        id_clase: Number($stateParams.id_clase),
        id_curso: Number($stateParams.id_curso),
        sala: $stateParams.ano+$stateParams.semestre+$stateParams.grupo_curso+$stateParams.nombre_asignatura+$stateParams.id_clase
    };

    SocketServices.emit('SolicitarEstado', infoSesion);

    $rootScope.$on('cargarEstadoEstudiante', function (event, data) {
        if(!_.isUndefined(data.pregunta)){
            $scope.pregunta = _.clone(data.pregunta);
            $scope.esperar = false;
            $scope.preguntaRealizada = true;
            if(data.pregunta.listaParticipantes.length>0){
                $scope.listaParticipantes = _.cloneDeep(data.pregunta.listaParticipantes);
                _.forEach($scope.listaParticipantes, function (estudiante) {
                    if(estudiante.turno){
                        estudiante.estado_part_preg = 'seleccionado';
                    }
                });
            }
            var dataUsuario = SessionServices.getSessionData();
            var indexUser = _.findIndex(data.pregunta.listaParticipantes,{id_user:dataUsuario.id_user});
            if(data.pregunta.participacion){
                $scope.participar = false;
                $scope.participantes = true;
                if(indexUser < 0){
                    EquiposServices.obtenerEquipoAlumno({id_curso: $stateParams.id_curso, id_user: dataUsuario.id_user})
                        .then(function (response) {
                            if(_.isEmpty(response.result)) {
                                $scope.participar = true;
                                $scope.participantes = false;
                                return;
                            } else {
                                $scope.equipoAlumno = response.result[0];
                            }
                            EquiposServices.obtenerAlumnos({id_equipo: $scope.equipoAlumno.id_equipo, id_curso: $stateParams.id_curso})
                                .then(function (response) {
                                    var estadosAlumnos = response.result;
                                    var indexNominado = _.findIndex(estadosAlumnos, function(alumno) {
                                        return alumno.estado_part == 'Nominado';
                                    });
                                    if(indexNominado >= 0) {
                                        if(estadosAlumnos[indexNominado].id_user == dataUsuario.id_user) {
                                            $scope.participar = true;
                                            $scope.participantes = false;
                                        }
                                    } else {
                                        var indexDisponible = _.findIndex(estadosAlumnos, function(alumno) {
                                            return alumno.estado_part == 'Disponible' && alumno.id_user == dataUsuario.id_user;
                                        });

                                        if(indexDisponible >= 0) {
                                            $scope.participar = true;
                                            $scope.participantes = false;
                                        }
                                    }
                                });
                            
                        });
                }
                
            }else{
                $scope.participar = false;
                $scope.participantes = true;
                if(data.pregunta.listaParticipantes[indexUser].turno == true){
                    $scope.esperar = false;
                    $scope.participar = false;
                    $scope.preguntaRealizada = true;
                    $scope.participantes = false;
                    $scope.responder = true;
                }
            }
        }
    });
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
        dataUsuario.id_pregunta = pregunta.id_pregunta;
        dataUsuario.estado_part_preg = 'noSeleccionado';
        dataUsuario.sala=$stateParams.ano+$stateParams.semestre+$stateParams.grupo_curso+$stateParams.nombre_asignatura+$stateParams.id_clase;
        CursosServices.obtenerAlumnoCurso({id_user:dataUsuario.id_user , id_curso: $stateParams.id_curso})
            .then(function (response){
                if(response.success) {
                    dataUsuario.puntos = response.result[0].puntos;
                    dataUsuario.errores = response.result[0].errores;

                    SocketServices.emit('responderPregunta', dataUsuario);
                    //PreguntasServices.participarEnPregunta(data);
                    $scope.participar = false;
                    $scope.participantes = true;
                } else {
                    toastr.error('no se pudo obtener los puntos y errores!', 'ERROR');
                }
            });
    };

    //actualizar la lista de participantes
    $rootScope.$on('actualizarListaParticipantes', function (event, data) {
        $scope.listaParticipantes=[];
        $scope.listaParticipantes = _.cloneDeep(data);
    });

    $rootScope.$on('turnoParaResponder', function () {
        $scope.esperar = false;
        $scope.participar = false;
        $scope.preguntaRealizada = true;
        $scope.participantes = false;
        $scope.responder = true;
    });

    $rootScope.$on('participanteSeleccionado', function (event, data) {
        var dataUsuario = SessionServices.getSessionData();

        if(dataUsuario.id_user != data.id_user){
            //toastr.success('Es el turno de '+data.nombre+' '+data.apellido);
            var estudiante = _.findWhere($scope.listaParticipantes, {id_user:data.id_user});
            if(!_.isUndefined(estudiante)){
                estudiante.estado_part_preg = 'seleccionado';
            }
        }
    });
    $rootScope.$on('respuestaIncorrectaContinuar', function (event, data) {
        $scope.esperar = false;
        $scope.participar = false;
        $scope.preguntaRealizada = true;
        $scope.participantes = true;
        var estudiante = _.findWhere($scope.listaParticipantes, {id_user:data.id_user});
        if(!_.isUndefined(estudiante)){
            estudiante.estado_part_preg = 'perdedor';
        }
    });
    $rootScope.$on('respuestaIncorrectaUserContinuar', function (event, data) {
        $scope.esperar = false;
        $scope.participar = false;
        $scope.preguntaRealizada = true;
        $scope.participantes = true;
        $scope.responder = false;
        var estudiante = _.findWhere($scope.listaParticipantes, {id_user:data.id_user});
        if(!_.isUndefined(estudiante)){
            estudiante.estado_part_preg = 'perdedor';
        }
        toastr.error('Tu respuesta es incorrecta', 'Lo siento',{
            iconClass: 'perdedor'
        });
    });
    $rootScope.$on('respuestaCorrectaContinuar', function (event, data) {
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
        var estudiante = _.findWhere($scope.listaParticipantes, {id_user:data.id_user});
        if(!_.isUndefined(estudiante)){
            toastr.success(estudiante.nombre+' '+estudiante.apellido+' Ha ganado un punto.', {
                closeButton: true,
                iconClass: 'ganador'
            });
        }

    });
    $rootScope.$on('respuestaCorrectaUserContinuar', function (event, data) {
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
        toastr.success('Haz ganado un punto.', '¡Felicitaciones!', {
            closeButton: true,
            iconClass: 'ganador'
        });

    });
    $rootScope.$on('mostrarResultadoIncorrecto', function (event, data) {
        $scope.esperar = false;
        $scope.participar = false;
        $scope.preguntaRealizada = true;
        $scope.participantes = false;
        $scope.responder = false;
        $scope.resultado = true;
        //$scope.msjResultado = "Lo siento, tu respuesta no es correcta.";
        var estudiante = _.findWhere($scope.listaParticipantes, {id_user:data.id_user});
        if(!_.isUndefined(estudiante)){
            estudiante.estado_part_preg = 'perdedor';
        }
    });
    $rootScope.$on('mostrarResultadoCorrecto', function (event, data) {
        $scope.esperar = false;
        $scope.participar = false;
        $scope.preguntaRealizada = true;
        $scope.participantes = false;
        $scope.responder = false;
        $scope.resultado = true;
        $scope.msjResultado = "Felicitaciones, respondiste de manera correcta, haz ganado un punto.";
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
        SocketServices.emit('SalirSala', data);
        $state.transitionTo('crsApp.asignatura.curso.clases', {
            ano:$stateParams.ano,
            semestre:$stateParams.semestre,
            grupo_curso:$stateParams.grupo_curso,
            nombre_asignatura:$stateParams.nombre_asignatura,
            id_curso:$stateParams.id_curso});
    });
});
