'use strict';
crsApp.controller('PreguntasController', function ($scope, $stateParams, $timeout, $mdDialog, toastr, PreguntasServices, CursosServices, ClasesServices, ModulosServices) {
    var asignaturas = CursosServices.obtenerCursosLocal();
    var asignatura = _.findWhere(asignaturas,{'asignatura':$stateParams.nombre_asignatura});
    var curso = _.findWhere(asignatura.cursos, {'id_curso':Number($stateParams.id_curso)});
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

        $scope.promesas = ClasesServices.obtenerClases($scope.listaModulos)
            .then(callbackClases, callbackClasesError);
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
                templateUrl: '/partials/content/asignatura/curso/preguntas/_agregarPreguntaPartial.html',
                locals : {
                    id_curso : curso.id_curso,
                    id_asignatura: asignatura.id_asignatura
                },
                controller: 'ModalAgregarPreguntaCursoController'
            })
            .then(
            function (listaPreguntaSeleccionadas) {
                //asignar al curso
            },function () {
                //error
            });
    };

    $scope.crearPregunta = function () {
        var pregunta = {
            'id_asignatura': curso.id_asignatura,
            'id_curso': curso.id_curso,
            'id_b_pregunta': null,
            'id_clase': null,
            'pregunta': null,
            'id_user': null,
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
    $scope.eliminarPregunta = function (pregunta) {
        PreguntasServices.eliminarPreguntaDelCurso(pregunta)
            .then(function (response) {
                PreguntasServices.obtenerPreguntasCurso(curso)
                    .then(function (response) {
                        $scope.listaPreguntasCurso = _.cloneDeep(response.result);
                        _.forEach($scope.listaPreguntasCurso, function(pregunta){
                            if(_.isNull(pregunta.id_clase)){
                                pregunta.clase = '';
                            } else{
                                pregunta.clase = _.findWhere($scope.listaClases,{'id_clase':pregunta.id_clase}).descripcion;
                            }
                        });

                    }, function (error) {
                        toastr.error('No se pudo obtener preguntas del curso: '+error.err.code,'Error');
                    });

            }, function (error) {
                toastr.error('No se pudo eliminar la pregunta: '+error.err.code,'Error');
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
        $scope.promesas = PreguntasServices.archivarPregunta(pregunta)
            .then(function (response) {
                _.findWhere($scope.listaPreguntasCurso, {'id_pregunta':pregunta.id_pregunta}).id_b_pregunta = response.id_b_pregunta;
                $scope.promesas = PreguntasServices.actualizarID_B_Pregunta(pregunta)
                    .then(function () {

                    }, function (error) {
                        toastr.error('No se pudo actualizar pregunta: '+error.err.code,'Error');
                    });

            }, function (error) {
                //erroralerta('danger','Error al archivar la pregunta en la Biblioteca del curso.');
            });
    };

    $scope.cancelarPregunta = function (pregunta, index) {
        if(!_.isUndefined(pregunta.nuevo)){
            $scope.listaPreguntasCurso.splice(index,1);
        }else{
            pregunta.edicion = false;
        }
    };

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