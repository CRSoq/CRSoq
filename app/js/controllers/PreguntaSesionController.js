crsApp.controller('PreguntaSesionProfesorController', function ($scope, $rootScope, $q, $state, $stateParams, $timeout, SocketServices, PreguntasServices, InformacionServices) {
    $scope.listaParticipantes=[];
    $scope.preguntaFinalizada = false;
    $scope.responder = false;
    $scope.showMore = false;
    var deferred = $q.defer();
    $scope.cargando = deferred.promise;
    $scope._=_;

	// Necesario para Ordenar la tabla de participación
    $scope.sortType = 'index';
    $scope.sortReverse = false;
    $scope.sortWay = 'sesion';
    $scope.lastSort ='';

    $scope.setSortWay = function(value){
	$scope.sortWay = value;
	if(!$scope.lastSort==''){
	    $scope.sortType = value+'.'+$scope.lastSort;
	}
    }

    $scope.setSortTypeByWay = function(value){
	$scope.lastSort = value;
	if($scope.sortWay=='sesion'){
	    $scope.setSorting('sesion.'+value);
	}
	else if($scope.sortWay=='grupo_curso'){
	    $scope.setSorting('grupo_curso.'+value);
	}
    }
    $scope.setSorting = function(value){
	if($scope.sortType==value){
	    $scope.sortReverse = !$scope.sortReverse;
	}
	else{
	    $scope.sortType = value;
	    $scope.sortReverse = false;
	}
    }

    $scope.setSortType = function(value){
	$scope.lastSort='';
	$scope.setSorting(value);
    }

	// FIN_Ordenado

    PreguntasServices.obtenerPreguntaPorId({'id_pregunta':$stateParams.id_pregunta})
        .then(function (response) {
            $scope.pregunta= _.cloneDeep(response.result);
        });
    SocketServices.emit('SolicitarEstadoPregunta', {
        id_pregunta:Number($stateParams.id_pregunta),
        sala: $stateParams.ano+$stateParams.semestre+$stateParams.grupo_curso+$stateParams.nombre_asignatura+$stateParams.id_clase
    });
    $rootScope.$on('cargarEstadoPregunta', function (event, data) {
        if(data.listaParticipantes.length>0){
            _.forEach(data.listaParticipantes, function (participante) {
                cargarInformacionEstudiante(participante,{id_curso:$stateParams.id_curso},{id_clase:$stateParams.id_clase})
                    .then(function (response) {
                        $scope.listaParticipantes.push(_.cloneDeep(response));
                    });
            });
        }
        if(data.participacion == false){
            $scope.preguntaFinalizada = true;
            deferred.resolve();
            var estudianteRespondiendo = _.findWhere(data.listaParticipantes, {turno:true});
            if(!_.isUndefined(estudianteRespondiendo)){
                $scope.estudianteSeleccionado = estudianteRespondiendo;
                $scope.responder = true;
            }
        }

        //event.stopPropagation();
    });
    $rootScope.$on('actualizarListaParticipantes', function (event, data) {
        if(data.length>0){
            $scope.listaParticipantes=[];
            _.forEach(data, function (participante) {
                cargarInformacionEstudiante(participante,{id_curso:$stateParams.id_curso},{id_clase:$stateParams.id_clase})
                    .then(function (response) {
                        $scope.listaParticipantes.push(_.cloneDeep(response));
                    });
            });
        }
    });
    $scope.cerrarParticipacion = function () {
        var sala = $stateParams.ano+$stateParams.semestre+$stateParams.grupo_curso+$stateParams.nombre_asignatura+$stateParams.id_clase;
        SocketServices.emit('cerrarParticipacion', sala);
        $scope.preguntaFinalizada = true;
        deferred.resolve();
    };

    $scope.finalizarPregunta = function (pregunta) {
        pregunta.estado_pregunta = 'realizada';
        finDePregunta(pregunta);
    };

    $scope.seleccionarEstudiante = function (participante) {
        var data = {
            participante : participante,
            sala: $stateParams.ano+$stateParams.semestre+$stateParams.grupo_curso+$stateParams.nombre_asignatura+$stateParams.id_clase
        };
        $scope.estudianteSeleccionado = participante;
        SocketServices.emit('responderParticipante', data);
        $scope.responder = true;
    };
    var cargarInformacionEstudiante = function (estudiante, curso, clase) {
        var semestre = {};
        var sesion = {};
        var promesas = [];
        var defered = $q.defer();
        var promise = defered.promise;
        var estudianteLocal = _.cloneDeep(estudiante);
        promesas.push(InformacionServices.cantidadTotalPreguntasCurso(curso)
            .then(function (response) {
                semestre.totalPreguntas=response.result;
            }));
        promesas.push(InformacionServices.numeroParticipacionPreguntasCurso(curso, estudianteLocal)
            .then(function (response) {
                semestre.participa=response.result;
            }));
        promesas.push(InformacionServices.numeroCorrectasPreguntasCurso(curso, estudianteLocal)
            .then(function (response) {
                semestre.correctas=response.result;
            }));
        promesas.push(InformacionServices.numeroIncorrectasPreguntasCurso(curso, estudianteLocal)
            .then(function (response) {
                semestre.incorrectas=response.result;
            }));
        promesas.push(InformacionServices.numeroNoSeleccionadoPreguntasCurso(curso, estudianteLocal)
            .then(function (response) {
                semestre.noSeleccionado=response.result;
            }));
        promesas.push(InformacionServices.cantidadTotalPreguntasClase(clase)
            .then(function (response) {
                sesion.totalPreguntas=response.result;
            }));
        promesas.push(InformacionServices.numeroParticipacionPreguntasClase(clase, estudianteLocal)
            .then(function (response) {
                sesion.participa=response.result;
            }));
        promesas.push(InformacionServices.numeroCorrectasPreguntasClase(clase, estudianteLocal)
            .then(function (response) {
                sesion.correctas=response.result;
            }));
        promesas.push(InformacionServices.numeroIncorrectasPreguntasClase(clase, estudianteLocal)
            .then(function (response) {
                sesion.incorrectas=response.result;
            }));
        promesas.push(InformacionServices.numeroNoSeleccionadoPreguntasClase(clase, estudianteLocal)
            .then(function (response) {
                sesion.noSeleccionado=response.result;
            }));
        $q.all(promesas).then(function () {
            semestre.noParticipa = (semestre.totalPreguntas - semestre.participa);
            sesion.noParticipa = (sesion.totalPreguntas - sesion.participa);
            _.extend(estudianteLocal,{semestre:semestre});
            _.extend(estudianteLocal,{sesion:sesion});
            defered.resolve(estudianteLocal);
        });
        return promise;
    };
    $rootScope.$on('agregarEstudiante', function (event, data) {
        if(_.findIndex($scope.listaParticipantes,{rut:data.rut})<0){
            cargarInformacionEstudiante(data,{id_curso:$stateParams.id_curso},{id_clase:$stateParams.id_clase})
                .then(function (response) {
                    $scope.listaParticipantes.push(_.cloneDeep(response));
                    SocketServices.emit('actualizarListaParticipantes', $scope.listaParticipantes);
                });
        }
    });

    $scope.respuestaCorrecta = function (pregunta) {
        var estudiante = _.findWhere($scope.listaParticipantes, {id_user:$scope.estudianteSeleccionado.id_user});
        estudiante.estado_part_preg = 'ganador';
        //para estudiantes cambiar estado a esperar por pregunta
        var data = {
            participante: $scope.estudianteSeleccionado,
            sala:$stateParams.ano+$stateParams.semestre+$stateParams.grupo_curso+$stateParams.nombre_asignatura+$stateParams.id_clase
        };
        SocketServices.emit('respuestaCorrecta', data);
        finDePregunta(pregunta);
    };
    $scope.respuestaIncorrecta = function (pregunta) {
        var estudiante = _.findWhere($scope.listaParticipantes, {id_user:$scope.estudianteSeleccionado.id_user});
        estudiante.estado_part_preg = 'perdedor';
        $scope.responder = false;
        //notificar al estudiante del resultado
        var data = {
            participante: $scope.estudianteSeleccionado,
            sala:$stateParams.ano+$stateParams.semestre+$stateParams.grupo_curso+$stateParams.nombre_asignatura+$stateParams.id_clase
        };
        SocketServices.emit('respuestaIncorrecta', data);
        $scope.estudianteSeleccionado = null;

    };
    var finDePregunta = function (pregunta, continuar) {
        var promesas = [];
        _.forEach($scope.listaParticipantes, function (estudiante) {
            promesas.push(
                PreguntasServices.participarEnPregunta(estudiante).then(function (response) {
                })
            );
        });
        $q.all(promesas).then(function () {
            pregunta.estado_pregunta = 'realizada';
            PreguntasServices.actualizarEstadoPregunta(pregunta);
            if(continuar){
                $rootScope.$emit('continuarSesionPreguntas');
            }else{
                var sala = $stateParams.ano+$stateParams.semestre+$stateParams.grupo_curso+$stateParams.nombre_asignatura+$stateParams.id_clase;
                SocketServices.emit('FinalizarPregunta', sala);
            }

            $state.transitionTo('crsApp.asignatura.curso.clases.sesion', {
                nombre_asignatura:$stateParams.nombre_asignatura,
                grupo_curso:$stateParams.grupo_curso,
                semestre:$stateParams.semestre,
                ano:$stateParams.ano,
                id_curso:$stateParams.id_curso,
                id_clase:$stateParams.id_clase});
        });
    }
});

crsApp.controller('PreguntaSesionController', function ($scope, $rootScope, $state, $stateParams, $timeout, PreguntasServices, SocketServices, SessionServices, ClasesServices, toastr) {
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
        grupo_curso:String($stateParams.grupo_curso),
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
                $scope.participar = true;
                if(indexUser>=0){
                    $scope.participar = false;
                    $scope.participantes = true;
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
        SocketServices.emit('responderPregunta', dataUsuario);
        //PreguntasServices.participarEnPregunta(data);
        $scope.participar = false;
        $scope.participantes = true;
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
