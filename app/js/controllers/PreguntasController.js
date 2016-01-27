'use strict';
crsApp.controller('PreguntasController', function ($scope, $stateParams, $timeout, PreguntasServices, CursosServices, ClasesServices, ModulosServices) {
    var curso = CursosServices.getCursoPorNombre($stateParams.semestre, $stateParams.curso);
    $scope.listaPreguntasCurso = [];
    $scope.listaPreguntasClase = [];
    $scope.listaModulos = [];
    $scope.listaClases = [];
    $scope.alerts = [];
    $scope.titulo = curso.nombre_curso;

    ModulosServices.obtenerModulos(curso).then(function (data) {
        $scope.listaModulos= _.cloneDeep(data);
        $scope.listaModulos= _.map(_.sortByOrder($scope.listaModulos,['posicion'],['asc']));
        ClasesServices.obtenerClases($scope.listaModulos).then(function (data) {
            var lista = _.cloneDeep(data);

            _.forEach(lista, function(n){
                var clasesModulo = _.cloneDeep(n);
                _.forEach(clasesModulo, function(clase){
                    var posModulo = _.findIndex($scope.listaModulos,{'id_modulo': clase.id_modulo});
                    clase.modulo = $scope.listaModulos[posModulo].nombre_modulo;
                });
                var i = 0;
                while(i<clasesModulo.length){
                    $scope.listaClases.push(clasesModulo[i]);
                    i++;
                }
            });
            PreguntasServices.obtenerPreguntasCurso(curso).then(function (data) {
                if(!data.error){
                    $scope.listaPreguntasCurso = _.cloneDeep(data);
                    _.forEach($scope.listaPreguntasCurso, function(pregunta){
                        if(_.isNull(pregunta.id_clase)){
                            pregunta.clase = '';
                        } else{
                            var index = _.findIndex($scope.listaClases,{'id_clase':pregunta.id_clase});
                            var descripcion = $scope.listaClases[index].descripcion;
                            pregunta.clase = descripcion;
                        }
                    });
                }else{
                    var id_alert = $scope.alerts.length+1;
                    $scope.alerts.push({id: id_alert,type:'danger', msg:'Error al obtener preguntas del curso.'});
                    closeAlertTime(id_alert);
                }
            });
        });
    });
    $scope.agregarPregunta = function () {
        var pregunta = {
            'id_curso': curso.id_curso,
            'id_clase': null,
            'clase':null,
            'pregunta': null,
            'id_user': null,
            'id_modulo':null,
            'nombre_modulo': null,
            'edicion': true,
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
                var id_alert = $scope.alerts.length+1;
                $scope.alerts.push({id: id_alert,type:'danger', msg:'Error al eliminar pregunta. "'+data.error.err.code+'"'});
                closeAlertTime(id_alert);
            }else{
                PreguntasServices.obtenerPreguntasCurso(curso).then(function (data) {
                    if(!data.error){
                        $scope.listaPreguntasCurso = _.cloneDeep(data);
                        _.forEach($scope.listaPreguntasCurso, function(pregunta){
                            if(_.isNull(pregunta.id_clase)){
                                pregunta.clase = '';
                            } else{
                                var index = _.findIndex($scope.listaClases,{'id_clase':pregunta.id_clase});
                                var descripcion = $scope.listaClases[index].descripcion;
                                pregunta.clase = descripcion;
                            }
                        });
                    }else{
                        var id_alert = $scope.alerts.length+1;
                        $scope.alerts.push({id: id_alert,type:'danger', msg:'Error al obtener preguntas del curso.'});
                        closeAlertTime(id_alert);
                    }
                });
            }
        });
    };
    $scope.guardarPregunta = function (pregunta) {
        if(pregunta.pregunta!=null){
            if(pregunta.nuevo){
                PreguntasServices.crearPregunta(pregunta).then(function (data) {
                    if(!data.error){
                        pregunta.id_pregunta = data.id_pregunta;
                        delete pregunta['nuevo'];
                        if(_.isNull(pregunta.id_clase)){
                            pregunta.clase = '';
                        }else{
                            var index = _.findIndex($scope.listaClases,{'id_clase':pregunta.id_clase});
                            var descripcion = $scope.listaClases[index].descripcion;
                            pregunta.clase = descripcion;
                        }
                        pregunta.edicion = false;
                    }else{
                        var id_alert = $scope.alerts.length+1;
                        $scope.alerts.push({id: id_alert,type:'danger', msg:'Error al crear pregunta. "'+data.error.err.code+'"'});
                        closeAlertTime(id_alert);
                    }
                });
            }else{
                PreguntasServices.actualizarPregunta(pregunta).then(function (data) {
                    if(!data.error){
                        if(_.isNull(pregunta.id_clase)){
                            pregunta.clase = '';
                        }else{
                            var index = _.findIndex($scope.listaClases,{'id_clase':pregunta.id_clase});
                            var descripcion = $scope.listaClases[index].descripcion;
                            pregunta.clase = descripcion;
                        }
                        pregunta.edicion = false;
                    }else{
                        var id_alert = $scope.alerts.length+1;
                        $scope.alerts.push({id: id_alert,type:'danger', msg:'Error al actualizar pregunta."'+data.error.err.code+'"'});
                        closeAlertTime(id_alert);
                    }
                });
            }

        }else{
            //abrir modal para que ingrese la pregunta al menos...
        }
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

    $scope.closeAlert = function(index) {
        $scope.alerts.splice(index, 1);
    };
    var closeAlertTime = function(id_alert) {
        $timeout(function(){
            $scope.alerts.splice(_.findIndex($scope.alerts,{id:id_alert}), 1);
        }, 3000);
    };
});
