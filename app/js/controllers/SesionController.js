crsApp.controller('SesionController', function($scope, $rootScope, $state, $stateParams, $uibModal, $timeout, SessionServices, CursosServices, ClasesServices, PreguntasServices, SocketServices){
    $scope.curso = $stateParams.curso;
    //obtener preguntas de la clase
    $scope.listaPreguntasClase=[];
    $scope.listaPreguntasClaseEdit=[];
    $scope.id_curso = null;

    var cursos = CursosServices.obtenerCursosLocal();
    var semestre = _.findWhere(cursos,{'ano': Number($stateParams.ano), 'semestre':Number($stateParams.semestre)})
    var curso = _.findWhere(semestre.cursos, {'nombre_curso': $stateParams.curso});
    $scope.id_curso = curso.id_curso;

    PreguntasServices.obtenerPreguntasClase({'id_clase':$stateParams.id_clase}).then(function (data) {
        if(data.error){
            alerta('danger', 'Error al obtener preguntas. "'+data.err.code+'"');
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
                 },
                id_asignatura: function () {
                    return curso.id_asignatura;
                }
            }
        });

        modalInstance.result.then(function (listaPreguntaSeleccionadas){
            _.forEach(listaPreguntaSeleccionadas, function (pregunta) {
                if(_.isUndefined(pregunta.id_pregunta)){
                    pregunta.pregunta = pregunta.b_pregunta;
                    pregunta.id_curso = curso.id_curso;
                    pregunta.id_clase = $stateParams.id_clase;
                    pregunta.estado_pregunta = 'sin_realizar';
                    PreguntasServices.crearPreguntaCurso(pregunta).then(function (response) {
                        if(!response.error){
                            pregunta.id_pregunta = response.id_pregunta;
                        }else{
                            alerta('danger', 'Error. "'+response.err.code+'"');
                        }
                    });
                }else{
                    var data = {
                        pregunta: pregunta,
                        id_clase: $stateParams.id_clase
                    };
                    PreguntasServices.asignarPreguntaClase(data);
                }
            });
            PreguntasServices.obtenerPreguntasClase({'id_clase':$stateParams.id_clase}).then(function (data) {
                if(data.error){
                    alerta('danger', 'Error. "'+response.err.code+'"');
                }else{
                    $scope.listaPreguntasClase= _.cloneDeep(data);
                }
            });
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
                        alerta('danger', 'Error al crear pregunta. "'+data.error.err.code+'"');
                    }
                });
            }else{
                PreguntasServices.actualizarPregunta(pregunta).then(function (data) {
                    if(!data.error){
                        pregunta.edicion = false;
                        $scope.listaPreguntasClaseEdit.splice(_.findIndex($scope.listaPreguntasClaseEdit,{'id_pregunta':pregunta.id_pregunta}),1);
                    }else{
                        alerta('danger', 'Error al actualizar pregunta."'+data.error.err.code+'"');
                        pregunta.edicion = false;
                    }
                });
            }

        }else{
            alerta('danger', 'Error. Debe ingresar la pregunta.');
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
                   alerta('danger', 'Error al eliminar pregunta. "'+data.error.err.code+'"');
               }else{
                   $scope.listaPreguntasClase.splice($index,1);
               }
            });
        }
    };

    //boton lanzar pregunta
    $scope.lanzarPregunta = function (pregunta) {
        $state.transitionTo('crsApp.cursosSemestre.clases.sesion.pregunta',{ano:$stateParams.ano,semestre:$stateParams.semestre,curso:$stateParams.curso,id_clase:$stateParams.id_clase,id_pregunta:pregunta.id_pregunta});
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
                            alerta('danger', 'Error. "'+data.error.err.code+'"');
                        }else{
                            $scope.listaPreguntasClase= _.cloneDeep(data);
                            alerta('success', 'Nuevo ganador asignado.');
                        }
                    });
                }else{
                    alerta('danger', 'No se pudo asignar ganador. "'+data.error.err.code+'"');
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
                $state.transitionTo('crsApp.cursosSemestre.clases', {ano:$stateParams.ano,semestre:$stateParams.semestre,curso:$stateParams.curso});
            }
        });
    };
    //boton proyectar sesion
    $scope.proyectarSesion = function () {

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


crsApp.controller('ModalAgregarPreguntaController', function ($scope, $uibModalInstance, $stateParams, CursosServices, SessionServices, PreguntasServices, id_curso, id_asignatura) {
    $scope.listaPreguntaSeleccionadas = [];

    if(!_.isUndefined(id_curso)){

        PreguntasServices.obtenerPreguntasAsignatura({'id_asignatura':id_asignatura}).then(function (response) {
            if(!response.error){
                $scope.listaPreguntasDelCurso = _.cloneDeep(response);
                _.forEach($scope.listaPreguntasDelCurso, function (pregunta) {
                        pregunta.pregunta = pregunta.b_pregunta;
                 });

                PreguntasServices.obtenerPreguntasCurso({'id_curso':id_curso}).then(function (response) {
                    if(!response.error){
                        var listaPreguntasCurso = _.cloneDeep(response);
                        _.forEach(listaPreguntasCurso, function (pregunta) {
                            //no este asignada a una clase ni coincida los id_b_pregunta
                            if(_.isNull(pregunta.id_clase) && (_.findIndex($scope.listaPreguntasDelCurso, {'id_b_pregunta':pregunta.id_b_pregunta})<0)){
                                $scope.listaPreguntasDelCurso.push(pregunta);
                            }
                        });
                    }else{
                        //alerta('danger','Error. "'+data.error.err.code+'"');
                    }
                });

            }else{
                //alerta('danger','Error. "'+data.error.err.code+'"');
            }
        });
    }



        /*
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
        */

    /*
    PreguntasServices.obtenerPreguntasAsignatura({'id_asignatura':id_asignatura}).then(function (response) {
        if(!response.error){
            var listaPreguntasAsignatura = _.cloneDeep(response);
            _.forEach(listaPreguntasAsignatura, function (pregunta) {
                pregunta.pregunta = pregunta.b_pregunta;
                $scope.listaPreguntasDelCurso.push(pregunta);
            });
        }else{
            console.log('error preguntas');
        }
    });

*/
    $scope.seleccionar = function (pregunta) {
        var indice_pregunta = _.findIndex($scope.listaPreguntaSeleccionadas, {id_pregunta:pregunta.id_pregunta});
        if(indice_pregunta>=0){
            $scope.listaPreguntaSeleccionadas.splice(indice_pregunta, 1);
        }else{
            $scope.listaPreguntaSeleccionadas.push(pregunta);
        }
    };
    $scope.aceptar = function () {
        $uibModalInstance.close($scope.listaPreguntaSeleccionadas);
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