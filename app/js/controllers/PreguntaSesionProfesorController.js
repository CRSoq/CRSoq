crsApp.controller('PreguntaSesionProfesorController', function ($scope, $rootScope, $mdDialog, $q, $state, $stateParams, $timeout, toastr, SocketServices, PreguntasServices, InformacionServices, EquiposServices, CursosServices) {
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

        CursosServices.obtenerAlumnoCurso({id_user: estudiante.id_user, id_curso: $stateParams.id_curso})
            .then(function (response){
                if(response.success) {
                    if(response.result[0].errores < 1) {
                        $q.when(CursosServices.actualizarErrores(
                            {
                                id_user: estudiante.id_user, 
                                id_curso: $stateParams.id_curso, 
                                errores: response.result[0].errores + 1
                            }))
                            .then(function (response){
                                if(response.success) {
                                    toastr.info('Error sumado al alumno!', 'Info');
                                } else {
                                    toastr.error('Error al actualizar errores!', 'Error');
                                }
                            });
                    } else {
                        $q.when(CursosServices.actualizarErrores(
                            {
                                id_user: estudiante.id_user, 
                                id_curso: $stateParams.id_curso, 
                                errores: response.result[0].errores + 1
                            }))
                            .then(function (response){
                                if(response.success) {
                                    EquiposServices.obtenerEquipoAlumno({id_curso: $stateParams.id_curso, id_user:estudiante.id_user})
                                        .then(function (response) {
                                            if(response.success){
                                                if(_.isEmpty(response.result)){
                                                    $scope.equipoAlumno = null;
                                                } else {
                                                    toastr.warning('El alumno ya tiene 2 errores, se le removera del equipo!', 'Errores');
                                                    $scope.equipoAlumno = _.isArray(response.result) ? response.result[0] : response.result;
                                                }
                                                
                                                EquiposServices.eliminarAlumnoEquipo({id_equipo: $scope.equipoAlumno.id_equipo, id_user: estudiante.id_user})
                                                    .then(function (response){
                                                        if(response.success) {
                                                            CursosServices.actualizarUltEquipo(
                                                                {
                                                                    id_user: estudiante.id_user, 
                                                                    id_curso:$stateParams.id_curso, 
                                                                    id_ult_equipo: $scope.equipoAlumno.id_equipo
                                                                })
                                                                .then(function(response){
                                                                    if(response.success) {
                                                                        console.log('Ultimo equipo actualizado correctamente!');
                                                                    } else {
                                                                        toastr.error('Error al actualizar ultimo equipo!', 'ERROR');
                                                                    }
                                                                });

                                                            toastr.warning('Alumno quitado del equipo por tener 2 errores', 'Intentos agotados');
                                                        } else {
                                                            toastr.error('Error al quitar de equipo!', 'Error');
                                                        }
                                                    });

                                                var data = {
                                                    equipo: $scope.equipoAlumno,
                                                    id_winner: estudiante.id_user,
                                                    id_curso: $stateParams.id_curso
                                                };
                                                $mdDialog.show({
                                                    templateUrl: '/partials/content/asignatura/curso/equipos/modalEdicionNominado.html',
                                                    locals : {
                                                        datos: data
                                                    },
                                                    controller: 'ModalEdicionNominadoController'
                                                })
                                                .then(function (response) {
                                                    if(response.alumno) {
                                                        var alumnoANominar = response.alumno;
                                                        console.log(response);
                                                        EquiposServices.actualizarEstadoEquipo({estado_part: 'Nominado', id_equipo: alumnoANominar.id_equipo, id_user: alumnoANominar.id_user})
                                                            .then(function(response){                                               
                                                                if(response.success){
                                                                    console.log('Estado del alumno actualizado');
                                                                } else {
                                                                    console.log('No se pudo actualizar el estado');
                                                                }
                                                            });
                                                    } else {
                                                        toastr.error('Error en la nominación! no se pudo quitar del equipo al alumno por falta de nominación', 'Error');
                                                    }
                                                });
                                            } else {
                                                toastr.error('Error al solicitar equipo alumno (r-incorrecta)', 'Error');
                                            }
                                        });
                                } else {
                                    toastr.error('Error al actualizar errores!', 'Error');
                                }
                            });
                    }
                } else {
                    toastr.error('Error al solicitar puntos y errores!', 'Error');
                }
            });
        

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
            $mdDialog.show({
                templateUrl: '/partials/content/asignatura/curso/equipos/modalEdicionNominado.html',
                locals : {
                    datos: data,
                },
                controller: 'ModalEdicionNominadoController'
            })
            .then(function (alumno) {
                EquiposServices.actualizarEstadoEquipo({estado_part: 'Nominado', id_equipo: alumno.alumno.id_equipo, id_user: alumno.alumno.id_user})
                    .then(function(response){                                               
                        if(response.success){
                            console.log('Estado del alumno actualizado');
                        } else {
                            console.log('No se pudo actualizar el estado');
                        }
                    })
            }).catch(function(error) {
                console.log('error en nominación:', error);
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
                        if(_.isEmpty(response.result)){
                            $scope.equipoAlumno = null;
                        } else {
                            $scope.equipoAlumno = _.isArray(response.result) ? response.result[0] : response.result;
                        }

                        if($scope.equipoAlumno == null) {
                            var proms = [];
                            proms.push($q.when(CursosServices.obtenerAlumnoCurso({id_user: $scope.listaParticipantes[index].id_user, id_curso: $stateParams.id_curso}))
                                .then(function (response){
                                    if(response.success) {
                                        var errores = response.result[0].errores;
                                        if(errores > 0) {
                                            $q.when(CursosServices.actualizarErrores(
                                                {
                                                    id_user: $scope.listaParticipantes[index].id_user, 
                                                    id_curso: $stateParams.id_curso, 
                                                    errores: errores - 1
                                                }))
                                                .then(function (response){
                                                    if(response.success) {
                                                    } else {
                                                        toastr.error('Error al actualizar errores!', 'Error');
                                                    }
                                                });
                                        }

                                        $q.when(CursosServices.actualizarPuntos(
                                            {
                                                id_user: $scope.listaParticipantes[index].id_user, 
                                                id_curso: $stateParams.id_curso, 
                                                puntos: response.result[0].puntos + 1
                                            }))
                                            .then(function (response) {
                                                toastr.success('Punto por ganar asignado correctamente!', 'Correcto');
                                            });


                                    } else {
                                        toastr.error('Error al solicitar puntos y errores!', 'Error');
                                    }
                                }));
                            
                            $q.all(proms).then(function () {
                                pregunta.estado_pregunta = 'realizada';
                                PreguntasServices.actualizarEstadoPregunta(pregunta);
                                var data = {
                                    equipo: $scope.equipoAlumno,
                                    id_winner: $scope.listaParticipantes[index].id_user,
                                    id_curso: $stateParams.id_curso
                                };
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
                            return $q.when(EquiposServices.obtenerAlumnos($scope.equipoAlumno))
                                .then(function (response){
                                    var proms = [];
                                    if(response.success){
                                        var idGanador = -1;
                                        _.forEach(response.result, function(alumno, id) {
                                            if(alumno.id_user == $scope.listaParticipantes[index].id_user) {  
                                                idGanador = id;
                                            }
                                        });
                                        _.forEach($scope.listaParticipantes, function (estudiante) {
                                            proms.push(
                                                PreguntasServices.participarEnPregunta(estudiante).then(function (response) {
                                                })
                                            );
                                        });

                                        proms.push(EquiposServices.actualizarEstadoEquipo(
                                            {
                                                estado_part: 'noDisponible',
                                                id_equipo: $scope.equipoAlumno.id_equipo,
                                                id_user: $scope.listaParticipantes[index].id_user
                                            })
                                            .then(function(response_dep){                                               
                                                if(response_dep.success){
                                                    console.log('Estado del alumno actualizado');
                                                    $scope.listaParticipantes[index].estado_part = 'noDisponible';
                                                    response.result[idGanador].estado_part = 'noDisponible';
                                                    var indexDisp = _.findIndex(response.result, function(alum) {
                                                        return alum.estado_part == 'Disponible';
                                                    });
                                                    if(indexDisp < 0) {
                                                        _.forEach(response.result, function (o, i) {
                                                            if(o.id_user != $scope.listaParticipantes[index].id_user) {
                                                                o.estado_part = 'Disponible';
                                                                proms.push(EquiposServices.actualizarEstadoEquipo(
                                                                    {
                                                                        estado_part: o.estado_part,
                                                                        id_equipo: $scope.equipoAlumno.id_equipo,
                                                                        id_user: o.id_user
                                                                    }
                                                                )
                                                                    .then(function (response) {
                                                                        if(response.success) {
                                                                        } else {
                                                                            console.log('Error actualizando estado');
                                                                        }
                                                                    }));
                                                            }
                                                        });
                                                    }
                                                } else {
                                                    console.log('No se pudo actualizar el estado');
                                                }
                                            }));

                                        $q.all(proms).then(function () {
                                            pregunta.estado_pregunta = 'realizada';
                                            PreguntasServices.actualizarEstadoPregunta(pregunta);
                                            var data = {
                                                equipo: $scope.equipoAlumno,
                                                alumnos: response.result,
                                                id_winner: $scope.listaParticipantes[index].id_user,
                                                sala: $stateParams.ano+$stateParams.semestre+$stateParams.grupo_curso+$stateParams.nombre_asignatura+$stateParams.id_clase
                                            };
                                            SocketServices.emit('abrirNominacionEquipo', data);
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
                                    
                                })
                        };
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

crsApp.controller('ModalEdicionNominadoController', function($scope, $mdDialog, $q, datos, toastr, EquiposServices) {
    console.log('nominado controller');
    $scope.equipo = _.cloneDeep(datos.equipo);
    $scope.listaAlumnos = [];
    $scope.AlumnosSel = 0;
    $scope.indexSeleccionado = -1;
    $q.when(EquiposServices.obtenerAlumnos($scope.equipo))
        .then(function (response){
            if(response.success){
                _.forEach(response.result, function (o) {
                    var item = o;
                    if(item.estado_part == 'noDisponible'){
                        return;
                    }else{
                        $scope.listaAlumnos.push(item);
                    }                  
                });
            } else {
                toastr.error('No se pudo obtener alumnos del equipo: '+response.err.code,'Error');
            }
        });

    $scope.toggleAlumno = function(index) {
        if($scope.indexSeleccionado == index) {
            $scope.indexSeleccionado = -1;
        } else {
            $scope.indexSeleccionado = index;
        }
        if($scope.listaAlumnos[index].selected) {
            $scope.listaAlumnos[index].selected = false;
            $scope.AlumnosSel--;
        } else {
            $scope.listaAlumnos[index].selected = true;
            $scope.AlumnosSel++;
            _.assign($scope.listaAlumnos[index], {id_equipo: datos.equipo.id_equipo})
        }
    };
    
    $scope.cancelar = function() {
        $mdDialog.cancel();
    };

    $scope.aceptar = function() {
        if($scope.indexSeleccionado >= 0) {
            $mdDialog.hide({alumno: $scope.listaAlumnos[$scope.indexSeleccionado]});
        } else {
            toastr.warning('Debe seleccionar un nominado!', 'error');
        }
    };
});