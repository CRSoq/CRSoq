'use strict';
crsApp.controller('PreguntasController', function ($scope, $stateParams, $timeout, $q, $mdDialog, toastr, PreguntasServices, CursosServices, ClasesServices, ModulosServices, TopicosServices) {
    var asignaturas = CursosServices.obtenerCursosLocal();
    var asignatura = _.findWhere(asignaturas,{'asignatura':$stateParams.nombre_asignatura});
    var curso = _.findWhere(asignatura.cursos, {'id_curso':Number($stateParams.id_curso)});
//    var topicos = PreguntasServices.obtenerTopicosAsignatura(asignatura);
//    var topicos = TopicosServices.obtenerTopicos({'id_asignatura':'2'});
//    console.log(asignatura.id_asignatura);
    $scope.selectedTopico = "";
    $scope.selectedTema = "";
    $scope.curso = _.cloneDeep(curso);
    $scope._ = _;
    $scope.listaPreguntasCurso = [];
    $scope.listaPreguntasAsignatura = [];
    $scope.listaModulos = [];
    $scope.listaClases = [];
    $scope.alerts = [];
    $scope.titulo = curso.nombre_curso;
    $scope.asignatura = curso.id_asignatura;
    $scope.promesas = [];
//    console.log(topicos.$$state);

    $scope.promesas = PreguntasServices.obtenerPreguntasCurso(curso)
        .then(function (response) {
            $scope.listaPreguntasCurso = _.cloneDeep(response.result);
            _.forEach($scope.listaPreguntasCurso, function (pregunta) {
                pregunta.id_asignatura = curso.id_asignatura;
            });
        }, function (error) {
            toastr.error(error.err.code, 'Error al obtener preguntas del curso.');
        });

    $scope.promesas = PreguntasServices.obtenerPreguntasAsignatura(asignatura)
        .then(function (response) {
            $scope.listaPreguntasAsignatura = _.cloneDeep(response.result);
        }, function (error) {
            toastr.error(error.err.code, 'Error al obtener preguntas de la asignatura.');
        });

    var callbackClases = function (response) {
        var lista = _.cloneDeep(response.result);
        if(lista.length>0){
            _.forEach(lista, function (item) {
                if(_.isArray(item)){
                    _.forEach(item, function (elemento) {
                        elemento.fecha = new Date(elemento.fecha);
                        elemento.modulo = _.findWhere($scope.listaModulos,{'id_modulo': elemento.id_modulo}).nombre_modulo;
                        $scope.listaClases.push(elemento);
                    });
                }else{
                    item.fecha = new Date(item.fecha);
                    item.modulo = _.findWhere($scope.listaModulos,{'id_modulo': item.id_modulo}).nombre_modulo;
                    $scope.listaClases.push(item);
                }
            });
        }
        cargarInformacion();
    };

    var callbackClasesError = function (error) {
        toastr.error(error.err.code,'Error clases');
    };

    var callbackModulos = function (response) {
        $scope.listaModulos= _.cloneDeep(response.result);
        $scope.listaModulos= _.map(_.sortByOrder($scope.listaModulos,['posicion'],['asc']));

        if($scope.listaModulos.length>0){
            $scope.promesas = ClasesServices.obtenerClases($scope.listaModulos)
                .then(callbackClases, callbackClasesError);
        }
    };

    var callBackModulosError = function (error) {
        toastr.error(error.err.code,'Error módulos');
    };

    $scope.promesas = ModulosServices.obtenerModulos(curso)
        .then(callbackModulos, callBackModulosError);

    var cargarInformacion = function () {
        _.forEach($scope.listaPreguntasCurso, function (pregunta) {
            if(!_.isNull(pregunta.id_clase)){
                pregunta.clase = _.findWhere($scope.listaClases,{'id_clase': pregunta.id_clase}).descripcion;
            }
        });
    };

    $scope.agregarPregunta = function () {
        $mdDialog
            .show({
                templateUrl: '/partials/content/asignatura/curso/preguntas/modalAgregarPregunta.html',
                locals : {
                    id_curso : curso.id_curso,
                    id_asignatura: asignatura.id_asignatura
                },
                controller: 'ModalAgregarPreguntaCursoController'
            })
            .then(
            function (listaPreguntaSeleccionadas) {
                var promesas = [];
                _.forEach(listaPreguntaSeleccionadas, function (pregunta) {
                    var preguntaLocal =  {
                        pregunta: pregunta.b_pregunta,
                        id_b_pregunta: pregunta.id_b_pregunta,
                        id_clase: null,
                        id_curso: Number($stateParams.id_curso),
                        estado_pregunta:'sin_realizar'
                    };
                    var promesa = PreguntasServices.crearPreguntaCurso(preguntaLocal).then(function (response) {
                        if(response.success){
                            preguntaLocal.id_pregunta=response.id_pregunta;
                            $scope.listaPreguntasCurso.push(preguntaLocal);
                        }
                    });
                    promesas.push(promesa);
                });
                $q.all(promesas).then(function (response) {
                    toastr.success('Preguntas agregadas al curso.');
                });
            });
    };

    $scope.crearPregunta = function () {
        var pregunta = {
            'id_asignatura': curso.id_asignatura,
            'id_curso': curso.id_curso,
            'id_b_pregunta': null,
            'id_clase': null,
            'pregunta': null,
            'id_modulo':null,
            'nombre_modulo': null,
            'edicion': true,
            'archivar': false,
            'estado_pregunta':'sin_realizar',
            'nuevo': true
        };
        $scope.listaPreguntasCurso.push(pregunta);
    };

    $scope.parearModulo = function (modulo) {
        var lista = [];
        _.forEach($scope.listaClases, function (clase) {
            if(clase.modulo == modulo){
                lista.push(clase);
            }
        });
        return lista;
    };
    $scope.editarPregunta = function (pregunta) {
        pregunta.edicion = true;
    };
    $scope.eliminarPregunta = function (pregunta, $index) {
        $mdDialog
            .show({
                templateUrl: '/partials/content/asignatura/curso/preguntas/modalEliminarPregunta.html',
                locals : {
                    pregunta: pregunta
                },
                controller: 'ModalEliminarPreguntaController'
            })
            .then(
            function () {
                PreguntasServices.eliminarParticipacionPregunta(pregunta).then(function (response) {
                    if (response.success) {
                        PreguntasServices.eliminarPreguntaDelCurso(pregunta)
                            .then(function (response) {
                                if (response.success) {
                                    toastr.success('Pregunta eliminada del curso de forma exitosa.');
                                    $scope.listaPreguntasCurso.splice($index, 1);
                                } else {
                                    toastr.error('No se pudo eliminar la pregunta del curso: ' + response.err.code, 'Error');
                                }
                            });
                    } else {
                        toastr.error('No se pudo eliminar participación: '+response.err.code,'Error');
                    }
                });
            });
    };

    $scope.guardarPregunta = function (pregunta) {
        if(pregunta.pregunta!=null){
            if(pregunta.nuevo){
                $scope.promesas = PreguntasServices.crearPreguntaCurso(pregunta)
                    .then(function (response) {
                            pregunta.id_pregunta = response.id_pregunta;
                            if(!_.isNull(pregunta.id_clase)){
                                pregunta.clase = _.findWhere($scope.listaClases,{'id_clase':pregunta.id_clase}).descripcion;
                            }
                            delete pregunta['nuevo'];
                            pregunta.edicion = false;

                    }, function (error) {
                    toastr.error('No se pudo crear la pregunta."'+error.err.code+'"','Error');
                });

            }else{
                $scope.promesas = PreguntasServices.actualizarPregunta(pregunta)
                    .then(function (response) {
                        if(_.isNull(pregunta.id_clase)){
                            pregunta.clase = '';
                        }else{
                            pregunta.clase = _.findWhere($scope.listaClases,{'id_clase':pregunta.id_clase}).descripcion;
                        }
                        pregunta.edicion = false;

                    }, function (error) {
                        toastr.error('No se pudo actualizar la pregunta."'+error.err.code,'Error');
                    });
            }

        }else{
            toastr.error('Debe ingresar una pregunta','Error');
        }
    };


    $scope.archivarPregunta = function (pregunta) {
        $mdDialog
            .show({
                templateUrl: '/partials/content/asignatura/curso/preguntas/modalArchivarPregunta.html',
                locals : {
                    pregunta: pregunta,
		    id_tema: null
                },
                controller: 'ModalArchivarPreguntaController'
            })
            .then(
            function (pregunta) {
                toastr.success('Done');
	    });
    };

    /*$scope.archivarPregunta = function (pregunta) {
	pregunta.id_tema = 1;
        PreguntasServices.archivarPregunta(pregunta)
            .then(function (response) {
                if(response.success){
                    pregunta.id_b_pregunta = response.id_b_pregunta;
                    PreguntasServices.actualizarID_B_Pregunta(pregunta)
                        .then(function (response) {
                            if(response.success){
                                toastr.success('Pregunta agregada a la biblioteca de preguntas de la asignatura.');
                            }else{
                                toastr.error('No se pudo agregar pregunta a la biblioteca de preguntas de la asignatura: '+response.err.code,'Error');
                            }
                        });
                }else{

                }
            });
    };*/

    $scope.cancelarPregunta = function (pregunta, index) {
        if(!_.isUndefined(pregunta.nuevo)){
            $scope.listaPreguntasCurso.splice(index,1);
        }else{
            pregunta.edicion = false;
        }
    };

});

crsApp.controller('ModalArchivarPreguntaController', function ($scope, $mdDialog, toastr, pregunta, id_tema, PreguntasServices){
    if(_.isNull(pregunta)){
	$scope.pregunta = {};
    }else{
	$scope.pregunta = _.clone(pregunta);
    }
    $scope.aceptar = function () {
	//pregunta.id_tema = id_tema;
	if(!_.isUndefined($scope.pregunta.id_tema)) {
	    pregunta.id_tema = $scope.pregunta.id_tema;
	    PreguntasServices.archivarPregunta(pregunta)
            .then(function (response) {
                if(response.success){
                    pregunta.id_b_pregunta = response.id_b_pregunta;
                    PreguntasServices.actualizarID_B_Pregunta(pregunta)
                        .then(function (response) {
                            if(response.success){
                                toastr.success('Pregunta agregada a la biblioteca de preguntas de la asignatura.');
				$mdDialog.cancel();
                            }else{
                                toastr.error('No se pudo agregar pregunta a la biblioteca de preguntas de la asignatura: '+response.err.code,'Error');
                            }
                        });
                }/*else{
                }*/
            });
	}else{
	    toastr.error('Debe ingresar todos los datos.','Error');
	}
    }
    $scope.cancelar = function () {
	$mdDialog.cancel();
    }
});

crsApp.controller('ModalAgregarPreguntaClaseController', function ($scope, $mdDialog, toastr, PreguntasServices, id_curso, id_asignatura) {
    $scope.promesas = [];
    $scope.listaPreguntasSeleccionadas = [];
    $scope.listaPreguntasDelCurso = [];

    $scope.promesas = PreguntasServices.obtenerPreguntasAsignatura({'id_asignatura':id_asignatura})
        .then(function (response) {
            var listaTempAsignatura = _.cloneDeep(response.result);
            _.forEach(listaTempAsignatura, function (pregunta) {
                pregunta.pregunta = pregunta.b_pregunta;
            });
            $scope.promesas = PreguntasServices.obtenerPreguntasCurso({'id_curso':id_curso})
                .then(function (response) {
                    var listaTempCurso = _.cloneDeep(response.result);
                    _.forEach(listaTempCurso, function (pregunta) {
                        if(_.isNull(pregunta.id_clase)){
                            $scope.listaPreguntasDelCurso.push(pregunta);
                        }
                    });
                    _.forEach(listaTempAsignatura, function (pregunta) {
                        if(_.findIndex(listaTempCurso,{'id_b_pregunta':pregunta.id_b_pregunta})<0){
                            $scope.listaPreguntasDelCurso.push(pregunta);
                        }
                    });
                }, function (error) {
                    toastr.error(error.err.code,'Error al obtener preguntas del curso.');
                });


        }, function (error) {
            toastr.error(error.err.code,'Error al obtener preguntas de la asignatura.');
        });

    $scope.aceptar = function () {
        $mdDialog.hide($scope.listaPreguntasSeleccionadas);
    };

    $scope.cancelar = function () {
        $mdDialog.cancel();
    }
});

crsApp.controller('ModalAgregarPreguntaCursoController', function ($scope, $mdDialog, toastr, PreguntasServices, id_curso, id_asignatura) {
    $scope.promesas = [];
    $scope.listaPreguntasSeleccionadas = [];
    $scope.listaPreguntasDelCurso = [];

    $scope.promesas = PreguntasServices.obtenerPreguntasAsignatura({'id_asignatura':id_asignatura})
        .then(function (response) {
            var listaTempAsignatura = _.cloneDeep(response.result);
            _.forEach(listaTempAsignatura, function (pregunta) {
                pregunta.pregunta = pregunta.b_pregunta;
            });

            $scope.promesas = PreguntasServices.obtenerPreguntasCurso({'id_curso':id_curso})
                .then(function (response) {
                    var listaTempCurso = _.cloneDeep(response.result);
                    _.forEach(listaTempAsignatura, function (pregunta) {
                        if(_.findIndex(listaTempCurso,{'id_b_pregunta':pregunta.id_b_pregunta})<0){
                            $scope.listaPreguntasDelCurso.push(pregunta);
                        }
                    });
                }, function (error) {
                    toastr.error(error.err.code,'Error al obtener preguntas del curso.');
                });

        }, function (error) {
            toastr.error(error.err.code,'Error al obtener preguntas de la asignatura.');
        });

    $scope.aceptar = function () {
        $mdDialog.hide($scope.listaPreguntasSeleccionadas);
    };

    $scope.cancelar = function () {
        $mdDialog.cancel();
    }
});
crsApp.controller('ModalEliminarPreguntaController', function ($scope, $mdDialog, pregunta) {
    $scope.pregunta = _.cloneDeep(pregunta);
    $scope.cancelar = function() {
        $mdDialog.cancel();
    };

    $scope.aceptar = function() {
        $mdDialog.hide();
    };
});
crsApp.controller('PreguntasEstudianteController', function ($scope, $stateParams, $mdDialog, toastr, PreguntasServices, CursosServices, ClasesServices, SessionServices) {
    var semestres = CursosServices.obtenerCursosLocal();
    var estudiante = SessionServices.getSessionData();
    var semestre = _.findWhere(semestres,{'ano':Number($stateParams.ano),'semestre':Number($stateParams.semestre),'grupo_curso':String($stateParams.grupo_curso)});
    $scope.curso = _.findWhere(semestre.cursos, {'id_curso': Number($stateParams.id_curso)});

    //preguntas curso
    $scope.listaPreguntasCurso = [];
    //mis preguntas
    $scope.misParticipaciones = [];

    $scope.promesas = [];

    var promesaPreguntas = PreguntasServices.obtenerPreguntasRealizadas($scope.curso).then(function (response) {
        if(response.success){
            $scope.listaPreguntasCurso = _.cloneDeep(response.result);
            cargarClases();
            obtenerParticipacion();
        }else{
            toastr.error('No se pudieron obtener las preguntas del curso: '+response.err.code,'Error');
        }
    });
    $scope.promesas.push(promesaPreguntas);
    var cargarClases = function () {
        _.forEach($scope.listaPreguntasCurso, function (pregunta) {
            if(!_.isNull(pregunta.id_clase)){
                ClasesServices.obtenerClasesPorID({id_clase:pregunta.id_clase}).then(function (response) {
                    if (response.success) {
                        pregunta.clase = response.result[0].descripcion;
                    }
                });
            }

        });
    };
    var obtenerParticipacion = function () {
        PreguntasServices.obtenerParticipacionesXEstudiante(estudiante).then(function (response) {
            if(response.success){
                _.forEach($scope.listaPreguntasCurso, function (pregunta) {
                    var preguntaPart = _.findWhere(response.result,{id_pregunta:pregunta.id_pregunta});
                    if(!_.isUndefined(preguntaPart)){
                        if(preguntaPart.estado_part_preg=='noSeleccionado'){
                            pregunta.estado_participacion = 'participante';
                        }else{
                            pregunta.estado_participacion = preguntaPart.estado_part_preg;
                        }
                    }else{
                        pregunta.estado_participacion = 'Sin participación';
                    }
                });
            }
        });
    };
});
