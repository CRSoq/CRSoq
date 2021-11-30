crsApp.controller('PreguntaSesionProfesorController', function ($scope, $rootScope, $mdDialog, $q, $state, $stateParams, $timeout, SocketServices, PreguntasServices, InformacionServices, EquiposServices) {
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

    $rootScope.$on('abrirNominacion', function (event, data) {
        if($rootScope.user.tipo == 'profesor') {
            $q.when(EquiposServices.obtenerAlumnos(data.equipo))
                .then(function (response) {
                    $mdDialog.show({
                        templateUrl: '/partials/content/asignatura/curso/equipos/modalEdicionNominado.html',
                        locals : {
                            id_curso: $stateParams.id_curso,
                            equipo: data.equipo
                        },
                        controller: 'ModalEdicionNominadoController'
                    })
                        .then(function (response) {
                            
                        });
                });
        }
    });

    var finDePregunta = function (pregunta, continuar) {
        var promesas = [];

        var index = _.findIndex($scope.listaParticipantes, function(ganador) {
            return ganador.estado_part_preg == 'ganador';
        });

        if(index > -1) {
            $q.when(EquiposServices.obtenerEquipoAlumno({id_curso: $stateParams.id_curso, id_user:$scope.listaParticipantes[index].id_user}))
                .then(function (response) {
                    if(response.success){
                        $scope.equipoAlumno = _.isArray(response.result) ? response.result[0] : response.result;
                        return $q.when(EquiposServices.obtenerAlumnos($scope.equipoAlumno))
                            .then(function (response){
                                var proms = [];
                                if(response.success){
                                    _.forEach(response.result, function(alumno, id) {
                                        if(id == index) {
                                            return;
                                        }
                                        _.assign(alumno, {id_pregunta: $scope.listaParticipantes[index].id_pregunta});
                                        _.assign(alumno, {estado_part_preg: 'ganador'});
                                        proms.push(
                                            PreguntasServices.participarEnPregunta(alumno).then(function (response) {
                                                if(response.success){
                                                    console.log(response);
                                                } else {
                                                    console.log('no se pudo añadir');
                                                }
                                            })
                                        );

                                    });
                                    _.forEach($scope.listaParticipantes, function (estudiante) {
                                        proms.push(
                                            PreguntasServices.participarEnPregunta(estudiante).then(function (response) {
                                            })
                                        );
                                    });

                                    $q.all(proms).then(function () {
                                        console.log('finished_winners');
                                        pregunta.estado_pregunta = 'realizada';
                                        PreguntasServices.actualizarEstadoPregunta(pregunta);
                                        var data = {
                                            equipo: $scope.equipoAlumno,
                                            alumnos: response.result
                                        };
                                        $rootScope.$emit('abrirNominacion', data);
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

                                } else {
                                    toastr.error('No se pudo obtener alumnos del equipo del alumno: '+response.err.code,'Error');
                                }

                                return proms;
                                
                            });
                    }else{
                        toastr.error('No se pudo obtener el equipo del alumno: '+response.err.code,'Error');
                    }
                });
        } else {
            _.forEach($scope.listaParticipantes, function (estudiante) {
                promesas.push(
                    PreguntasServices.participarEnPregunta(estudiante).then(function (response) {
                    })
                );
            });

            $q.all(promesas).then(function () {
                console.log('finished_winners');
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
    }
});

crsApp.controller('ModalEdicionNominadoController', function($scope, $mdDialog, $q, id_curso, equipo, toastr, EquiposServices) {
    $scope.equipo = _.cloneDeep(equipo);
    
    $scope.cancelar = function() {
        $mdDialog.cancel();
    };

    $scope.aceptar = function() {
        $mdDialog.hide({ equipo: $scope.equipo});
    };
});