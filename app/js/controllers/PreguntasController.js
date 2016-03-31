'use strict';
crsApp.controller('PreguntasController', function ($scope, $stateParams, $timeout, PreguntasServices, CursosServices, ClasesServices, ModulosServices) {
    var cursos = CursosServices.obtenerCursosLocal();
    var semestre = _.findWhere(cursos,{'ano': Number($stateParams.ano), 'semestre':Number($stateParams.semestre)})
    var curso = _.findWhere(semestre.cursos, {'nombre_curso': $stateParams.curso});
    $scope._ = _;
    $scope.listaPreguntasCurso = [];
    $scope.listaPreguntasAsignatura = [];
    $scope.listaModulos = [];
    $scope.listaClases = [];
    $scope.alerts = [];
    $scope.titulo = curso.nombre_curso;
    $scope.asignatura = curso.id_asignatura;

    PreguntasServices.obtenerPreguntasCurso(curso).then(function (response) {
        if(!response.error){
            $scope.listaPreguntasCurso = _.cloneDeep(response);
            _.forEach($scope.listaPreguntasCurso, function (pregunta) {
                pregunta.id_asignatura = curso.id_asignatura;
            });
        }else{
            alerta('danger','Error. "'+data.error.err.code+'"');
        }
    });

    PreguntasServices.obtenerPreguntasAsignatura(curso).then(function (response) {
        if(!response.error){
            $scope.listaPreguntasAsignatura = _.cloneDeep(response);
        }else{
            alerta('danger','Error. "'+data.error.err.code+'"');
        }
    });

    ModulosServices.obtenerModulos(curso).then(function (data) {
        $scope.listaModulos= _.cloneDeep(data);
        $scope.listaModulos= _.map(_.sortByOrder($scope.listaModulos,['posicion'],['asc']));

        ClasesServices.obtenerClases($scope.listaModulos).then(function (response) {
            if(response.error){
                alerta('danger','Error. "'+data.error.err.code+'"');
            }else{
                var lista = _.cloneDeep(response);
                if(lista.length>0){
                    _.forEach(lista, function (item) {
                        if(_.isArray(item)){
                            _.forEach(item, function (elemento) {
                                elemento.modulo = _.findWhere($scope.listaModulos,{'id_modulo': elemento.id_modulo}).nombre_modulo;
                                $scope.listaClases.push(elemento);
                            });
                        }else{
                            item.modulo = _.findWhere($scope.listaModulos,{'id_modulo': item.id_modulo}).nombre_modulo;
                            $scope.listaClases.push(item);
                        }
                    });
                }
                cargarInformacion();
            }
        });
    });

    var cargarInformacion = function () {
        _.forEach($scope.listaPreguntasCurso, function (pregunta) {
            if(!_.isNull(pregunta.id_clase)){
                pregunta.clase = _.findWhere($scope.listaClases,{'id_clase': pregunta.id_clase}).descripcion;
            }
        });
    };

    $scope.agregarPregunta = function () {
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
    $scope.editarPregunta = function (pregunta) {
        pregunta.edicion = true;
    };
    $scope.eliminarPregunta = function (pregunta) {
        PreguntasServices.eliminarPregunta(pregunta).then(function (data) {
            if(data.error){
                alerta('danger','Error al eliminar pregunta. "'+data.error.err.code+'"');
            }else{
                PreguntasServices.obtenerPreguntasCurso(curso).then(function (data) {
                    if(!data.error){
                        $scope.listaPreguntasCurso = _.cloneDeep(data);
                        _.forEach($scope.listaPreguntasCurso, function(pregunta){
                            if(_.isNull(pregunta.id_clase)){
                                pregunta.clase = '';
                            } else{
                                pregunta.clase = _.findWhere($scope.listaClases,{'id_clase':pregunta.id_clase}).descripcion;
                            }
                        });
                    }else{
                        alerta('danger','Error al obtener preguntas del curso.');
                    }
                });
            }
        });
    };
    $scope.guardarPregunta = function (pregunta) {
        if(pregunta.pregunta!=null){
            if(pregunta.nuevo){
                PreguntasServices.crearPreguntaCurso(pregunta).then(function (response) {
                    if(_.isUndefined(response.error)){
                        pregunta.id_pregunta = response.id_pregunta;

                        if(!_.isNull(pregunta.id_clase)){
                            pregunta.clase = _.findWhere($scope.listaClases,{'id_clase':pregunta.id_clase}).descripcion;
                        }
                        delete pregunta['nuevo'];
                        pregunta.edicion = false;
                    }else{
                        alerta('danger','Error al crear pregunta. "'+response.error.err.code+'"');
                    }
                });
            }else{
                PreguntasServices.actualizarPregunta(pregunta).then(function (data) {
                    if(!data.error){
                        if(_.isNull(pregunta.id_clase)){
                            pregunta.clase = '';
                        }else{
                            pregunta.clase = _.findWhere($scope.listaClases,{'id_clase':pregunta.id_clase}).descripcion;
                        }
                        pregunta.edicion = false;
                    }else{
                        alerta('danger','Error al actualizar pregunta."'+data.error.err.code+'"');
                    }
                });
            }

        }else{
            alerta('danger','Debe ingresar la pregunta.');
        }
    };

    $scope.archivarPregunta = function (pregunta) {
        PreguntasServices.archivarPregunta(pregunta).then(function (response) {
            if(!response.error){
                _.findWhere($scope.listaPreguntasCurso, {'id_pregunta':pregunta.id_pregunta}).id_b_pregunta = response.id_b_pregunta;
                PreguntasServices.actualizarID_B_Pregunta(pregunta);
                PreguntasServices.obtenerPreguntasAsignatura(curso).then(function (response) {
                    if(!response.error){
                        $scope.listaPreguntasAsignatura = _.cloneDeep(response);
                    }else{
                        alerta('danger','Error. "'+data.error.err.code+'"');
                    }
                });
            }else{
                alerta('danger','Error al archivar la pregunta en la Biblioteca del curso.');
            }
        });
    };
/*
    $scope.seleccionaModulo = function (id_modulo) {
        if(!_.isNull(id_modulo)) {
            $scope.listaClases = [];
            $scope.listaClases = _.cloneDeep($scope.listaClasesAux);
            _.remove($scope.listaClases, function (clase) {
                return clase.id_modulo != id_modulo;
            });
        }else{
            $scope.listaClases = [];
            $scope.listaClases = _.cloneDeep($scope.listaClasesAux);
        }
    };
    $scope.seleccionaClase = function (id_clase) {
        if(!_.isNull(id_clase)) {
            var id_modulo = $scope.listaClases[_.findIndex($scope.listaClases,{'id_clase':id_clase})].id_modulo;
            $scope.listaModulos = [];
            $scope.listaModulos = _.cloneDeep($scope.listaModulosAux);
            _.remove($scope.listaModulos, function (modulo) {
                return modulo.id_modulo != id_modulo;
            });
        }else{
            $scope.listaModulos = [];
            $scope.listaModulos = _.cloneDeep($scope.listaModulosAux);
        }
    };*/
    $scope.cancelarPregunta = function (pregunta) {
        $scope.listaPreguntasCurso.splice(_.findIndex($scope.listaPreguntasCurso,{'$$hashKey':pregunta.$$hashKey}),1);
    };

    var alerta = function (tipo, mensaje) {
        var id_alert = $scope.alerts.length+1;
        $scope.alerts.push({id: id_alert,type:tipo, msg:mensaje});
        $timeout(function(){
            $scope.alerts.splice(_.findIndex($scope.alerts,{id:id_alert}), 1);
        }, 3000);
    };

    $scope.closeAlert = function(index) {
        $scope.alerts.splice(index, 1);
    };
});
