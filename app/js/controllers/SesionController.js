crsApp.controller('SesionController', function($scope, $rootScope, $state, $stateParams, $uibModal, $timeout, SessionServices, CursosServices, ClasesServices, PreguntasServices, SocketServices){
    $scope.curso = $stateParams.curso;
    //obtener preguntas de la clase
    $scope.listaPreguntasClase=[];
    $scope.listaPreguntasClaseEdit=[];
    $scope.id_curso = null;
    CursosServices.obtenerCursos(SessionServices.getSessionData()).then(function (data) {
        if(!data.error){
            var semestre = _.findWhere(data, {nombre:$stateParams.semestre});
            $scope.id_curso = _.findWhere(semestre.cursos, {nombre_curso:$stateParams.curso}).id_curso;
        }
    });

    PreguntasServices.obtenerPreguntasClase({'id_clase':$stateParams.id_clase}).then(function (data) {
        if(data.error){
            console.log(data.err.code);
        }else{
            $scope.listaPreguntasClase= _.cloneDeep(data);
        }
    });
    //boton añadir pregunta de la biblioteca
    $scope.agregarPregunta = function () {
        //select preguntas sin id_clase
        //modal
        var modalInstance = $uibModal.open({
            animation   : true,
            templateUrl : '/partials/content/clases/sesion/_agregarPreguntaPartial.html',
            controller  : 'ModalAgregarPreguntaController',
            size        : 'lg',
            backdrop    : 'static',
            resolve     : {
                id_curso: function () {
                 return $scope.id_curso;
                 }
            }
        });

        modalInstance.result.then(function (listaPreguntaSeleccionadas){
            if(listaPreguntaSeleccionadas.length>0){
                var data = {
                    pregunta: listaPreguntaSeleccionadas,
                    id_clase: $stateParams.id_clase
                };
                PreguntasServices.asignarPreguntasClase(data).then(function (response) {
                    if(!response.error){
                        PreguntasServices.obtenerPreguntasClase({'id_clase':$stateParams.id_clase}).then(function (data) {
                            if(data.error){
                                console.log(data.err.code);
                            }else{
                                $scope.listaPreguntasClase= _.cloneDeep(data);
                            }
                        });
                    }else{
                        console.log(response.err.code);
                    }
                });
            }
        });
    };

    //boton crear pregunta (agregar automaticamente a la clase y al módulo)
    $scope.crearPregunta = function () {
        var pregunta = {
            'id_clase': $stateParams.id_clase,
            'pregunta': null,
            'id_user': null,
            'edicion': true,
            'estado':'sin_realizar',
            'nuevo': true
        };
        $scope.listaPreguntasClase.push(pregunta);
    };

    $scope.guardarPregunta = function (pregunta) {
        if(pregunta.pregunta!=null){
            if(pregunta.nuevo){
                pregunta['curso'] = $stateParams.curso;
                pregunta['semestre'] = $stateParams.semestre;
                PreguntasServices.crearPregunta(pregunta).then(function (data) {
                    if(!data.error){
                        pregunta.id_pregunta = data.id_pregunta;
                        pregunta.id_curso = data.id_curso;
                        delete pregunta['nuevo'];
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
                        pregunta.edicion = false;
                        $scope.listaPreguntasClaseEdit.splice(_.findIndex($scope.listaPreguntasClaseEdit,{'id_pregunta':pregunta.id_pregunta}),1);
                    }else{
                        var id_alert = $scope.alerts.length+1;
                        $scope.alerts.push({id: id_alert,type:'danger', msg:'Error al actualizar pregunta."'+data.error.err.code+'"'});
                        closeAlertTime(id_alert);
                        pregunta.edicion = false;
                    }
                });
            }

        }else{
            var id_alert = $scope.alerts.length+1;
            $scope.alerts.push({id: id_alert,type:'danger', msg:'Error. Debe ingresar la pregunta.'});
            closeAlertTime(id_alert);
        }
    };

    $scope.cancelarPregunta = function (pregunta) {
        if(pregunta.nuevo){
            $scope.listaPreguntasClase.splice(_.findIndex($scope.listaPreguntasClase,{'$$hashKey':pregunta.$$hashKey}),1);
        }else{
            pregunta.edicion = false;
            $scope.listaPreguntasClase[_.findIndex($scope.listaPreguntasClase,{'id_pregunta':pregunta.id_pregunta})].pregunta = _.findWhere($scope.listaPreguntasClaseEdit, {'id_pregunta':pregunta.id_pregunta}).pregunta;
            $scope.listaPreguntasClaseEdit.splice(_.findIndex($scope.listaPreguntasClaseEdit,{'id_pregunta':pregunta.id_pregunta}),1);
        }
    };

    $scope.editarPregunta = function (pregunta) {
        var pregunta_edit = _.clone(pregunta);
        $scope.listaPreguntasClaseEdit.push(pregunta_edit);
        pregunta.edicion = true;
    };

    //boton eliminar pregunta?
    $scope.eliminarPregunta = function (pregunta, $index) {
        if(pregunta.nuevo){
            $scope.listaPreguntasClase.splice(_.findIndex($scope.listaPreguntasClase,{'$$hashKey':pregunta.$$hashKey}),1);
        }else{
            PreguntasServices.eliminarPregunta(pregunta).then(function (data) {
               if(data.error){
                   var id_alert = $scope.alerts.length+1;
                   $scope.alerts.push({id: id_alert,type:'danger', msg:'Error al eliminar pregunta. "'+data.error.err.code+'"'});
                   closeAlertTime(id_alert);
               }else{
                   $scope.listaPreguntasClase.splice($index,1);
               }
            });
        }
    };

    //boton lanzar pregunta
    $scope.lanzarPregunta = function (pregunta) {
        $state.transitionTo('crsApp.cursosSemestre.clases.sesion.pregunta',{semestre:$stateParams.semestre,curso:$stateParams.curso,id_clase:$stateParams.id_clase,id_pregunta:pregunta.id_pregunta});
        var data = {
            'pregunta'  : pregunta,
            'sala'      : $stateParams.semestre+$stateParams.curso+$stateParams.id_clase
        };
        SocketServices.emit('RealizarPregunta', data);
    };
    //boton editar ganador
    $scope.editarGanadorPregunta = function (pregunta) {
        //modal
        var modalInstance = $uibModal.open({
            animation   : true,
            templateUrl : '/partials/content/clases/sesion/_editarGanadorPreguntaPartial.html',
            controller  : 'ModalEditarGanadorPreguntaController',
            size        : 'lg',
            backdrop    : 'static',
            resolve     : {
                id_curso: function () {
                    return $scope.id_curso;
                },
                pregunta: function () {
                    return pregunta;
                }
            }
        });

        modalInstance.result.then(function (ganadorSeleccionado){
            var data = {
                pregunta : pregunta,
                id_user  : ganadorSeleccionado.id_user
            };
            PreguntasServices.asignarGanador(data).then(function (response) {
                if(!response.error){
                    PreguntasServices.obtenerPreguntasClase({'id_clase':$stateParams.id_clase}).then(function (data) {
                        if(data.error){
                            var id_alert = $scope.alerts.length+1;
                            $scope.alerts.push({id: id_alert,type:'danger', msg:'Error. "'+data.error.err.code+'"'});
                            closeAlertTime(id_alert);
                        }else{
                            $scope.listaPreguntasClase= _.cloneDeep(data);
                            var id_alert = $scope.alerts.length+1;
                            $scope.alerts.push({id: id_alert,type:'success', msg:'Nuevo ganador asignado.'});
                            closeAlertTime(id_alert);
                        }
                    });
                }else{
                    var id_alert = $scope.alerts.length+1;
                    $scope.alerts.push({id: id_alert,type:'danger', msg:'No se pudo asignar ganador. "'+data.error.err.code+'"'});
                    closeAlertTime(id_alert);
                }
            });
        });
    };
    //boton finalizar sesion
    $scope.finalizarSesion = function () {
        var data ={
            nombreSala: $stateParams.semestre+$stateParams.curso+$stateParams.id_clase
        };
        SocketServices.emit('finalizarSesion', data);
        var dataClase = {
         'id_clase':$stateParams.id_clase,
          'estado_sesion':'cerrada'
        };
        ClasesServices.actualizarSesionClase(dataClase).then(function (data) {
            if(!data.error){
                $state.transitionTo('crsApp.cursosSemestre.clases', {semestre:$stateParams.semestre,curso:$stateParams.curso});
            }
        });
    };
    //boton proyectar sesion
    $scope.proyectarSesion = function () {

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


crsApp.controller('ModalAgregarPreguntaController', function ($scope, $uibModalInstance, $stateParams, CursosServices, SessionServices, PreguntasServices, id_curso) {
    $scope.listaPreguntaSeleccionadas = [];

    if(!_.isUndefined(id_curso)){
        PreguntasServices.obtenerPreguntasCurso({'id_curso':id_curso}).then(function (data) {
            if(!data.error){
                $scope.listaPreguntasDelCurso = _.cloneDeep(data, function (value) {
                    var listaPreguntas = [];
                    _.forEach(value, function (element) {
                        if(_.isNull(element.id_clase)){
                            listaPreguntas.push(element);
                        }
                    });
                    return listaPreguntas;
                });
            }else{
                console.log('error preguntas');
            }
        });
    }

    $scope.seleccionar = function (pregunta) {
        var indice_pregunta = _.findIndex($scope.listaPreguntaSeleccionadas, {id_pregunta:pregunta.id_pregunta});
        if(indice_pregunta>=0){
            $scope.listaPreguntaSeleccionadas.splice(indice_pregunta, 1);
        }else{
            $scope.listaPreguntaSeleccionadas.push(pregunta);
        }
    };
    $scope.aceptar = function () {
        $uibModalInstance.close($scope.listaPreguntaSeleccionadas, id_curso);
    };

    $scope.cancelar = function () {
        $uibModalInstance.dismiss();
    }
});

crsApp.controller('ModalEditarGanadorPreguntaController', function ($scope, $uibModalInstance, EstudiantesServices, PreguntasServices, id_curso, pregunta) {

    $scope.pregunta = pregunta;
    $scope.sin_ganador = {'id_user':null};
    EstudiantesServices.ObtenerListaEstudiantes({id_curso:id_curso}).then(function (data) {
        if(!data.error){
            $scope.listaEstudiantes = _.cloneDeep(data.estudiantes);
            if(!_.isNull(pregunta.id_user)){
                $scope.ganadorActual = _.findWhere($scope.listaEstudiantes,{id_user:pregunta.id_user});
                $scope.listaEstudiantes.ganador = _.cloneDeep($scope.ganadorActual);
            }
        }
    });
    $scope.aceptar = function () {
        $uibModalInstance.close(angular.fromJson($scope.listaEstudiantes.ganador));
    };

    $scope.cancelar = function () {
        $uibModalInstance.dismiss();
    }
});