crsApp.controller('SesionController', function($scope, $rootScope, $state, $stateParams, $timeout, $mdDialog, toastr, SessionServices, CursosServices, ClasesServices, PreguntasServices, SocketServices){
    $scope.listaPreguntasClase=[];
    $scope.listaPreguntasClaseEdit=[];
    $scope.id_curso = null;
    $scope.promesas = [];
    $scope._ = _;

    var asignaturas = CursosServices.obtenerCursosLocal();
    var asignatura = _.findWhere(asignaturas,{'asignatura':$stateParams.nombre_asignatura});
    var curso = _.findWhere(asignatura.cursos, {'id_curso':Number($stateParams.id_curso)});
    $scope.curso = _.cloneDeep(curso);

    var callbackPreguntas = function (response) {
        $scope.listaPreguntasClase= _.cloneDeep(response.result);
    };
    var callbackErrorPreguntas = function (error) {
        toastr.error(error.err.code, 'Error al obtener preguntas.');
    };

    PreguntasServices.obtenerPreguntasClase({'id_clase':$stateParams.id_clase})
        .then(callbackPreguntas, callbackErrorPreguntas);

    //boton añadir pregunta de la biblioteca
    $scope.agregarPregunta = function () {

        $mdDialog
            .show({
                templateUrl: '/partials/content/asignatura/curso/preguntas/_agregarPreguntaPartial.html',
                locals : {
                    id_curso : curso.id_curso,
                    id_asignatura: asignatura.id_asignatura
                },
                controller: 'ModalAgregarPreguntaClaseController'
            })
            .then(
                function (listaPreguntaSeleccionadas) {
                    _.forEach(listaPreguntaSeleccionadas, function (pregunta) {
                        if(_.isUndefined(pregunta.id_pregunta)){
                            pregunta.pregunta = pregunta.b_pregunta;
                            pregunta.id_curso = curso.id_curso;
                            pregunta.id_clase = $stateParams.id_clase;
                            pregunta.estado_pregunta = 'sin_realizar';
                            PreguntasServices.crearPreguntaCurso(pregunta)
                                .then(function (response) {
                                        pregunta.id_pregunta = response.id_pregunta;
                                }, function (error) {
                                    toastr.error(error.err.code, 'Error al crear pregunta.');
                                });
                        }else{
                            var data = {
                                pregunta: pregunta,
                                id_clase: $stateParams.id_clase
                            };
                            PreguntasServices.asignarPreguntaClase(data);
                        }
                    });

                    PreguntasServices.obtenerPreguntasClase({'id_clase':$stateParams.id_clase})
                        .then(callbackPreguntas, callbackErrorPreguntas);
                },function () {
                //error
            });
    };

    $scope.crearPregunta = function () {
        var pregunta = {
            'id_asignatura': curso.id_asignatura,
            'id_curso': curso.id_curso,
            'id_b_pregunta': null,
            'id_clase': $stateParams.id_clase,
            'pregunta': null,
            'id_user': null,
            'id_modulo':null,
            'nombre_modulo': null,
            'edicion': true,
            'archivar': false,
            'estado_pregunta':'sin_realizar',
            'nuevo': true
        };
        $scope.listaPreguntasClase.push(pregunta);
    };

    $scope.guardarPregunta = function (pregunta) {
        if(pregunta.pregunta!=null){
            if(pregunta.nuevo){
                $scope.promesas = PreguntasServices.crearPreguntaCurso(pregunta)
                    .then(function (response) {
                        pregunta.id_pregunta = response.id_pregunta;
                        delete pregunta['nuevo'];
                        pregunta.edicion = false;

                    }, function (error) {
                        toastr.error('No se pudo crear la pregunta."'+error.err.code+'"','Error');
                    });

            }else{
                $scope.promesas = PreguntasServices.actualizarPregunta(pregunta)
                    .then(function (response) {
                        pregunta.edicion = false;

                    }, function (error) {
                        toastr.error('No se pudo actualizar la pregunta."'+error.err.code,'Error');
                    });
            }

        }else{
            toastr.error('Debe ingresar una pregunta','Error');
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
        //eliminar pregunta de la clase solamente
        if(pregunta.nuevo){
            $scope.listaPreguntasClase.splice(_.findIndex($scope.listaPreguntasClase,{'$$hashKey':pregunta.$$hashKey}),1);
        }else{
            PreguntasServices.eliminarPreguntaDeLaClase(pregunta)
                .then(function (response) {
                       $scope.listaPreguntasClase.splice($index,1);
                }, function (error) {
                    toastr.error('No se pudo eliminar la pregunta: '+error.err.code, 'Error.');
                });
        }
    };

    //boton lanzar pregunta
    $scope.lanzarPregunta = function (pregunta) {
        $state.transitionTo('crsApp.asignatura.curso.clases.sesion.pregunta',{nombre_asignatura:$stateParams.nombre_asignatura,ano:$stateParams.ano,semestre:$stateParams.semestre,id_curso:$stateParams.id_curso,id_clase:$stateParams.id_clase,id_pregunta:pregunta.id_pregunta});
        var data = {
            'pregunta'  : pregunta,
            'sala'      : $stateParams.ano+$stateParams.semestre+$stateParams.nombre_asignatura+$stateParams.id_clase
        };

        SocketServices.emit('RealizarPregunta', data);
    };
    //boton editar ganador
    $scope.editarGanadorPregunta = function (pregunta) {
        //modal
        //var modalInstance = $uibModal.open({
        //    animation   : true,
        //    templateUrl : '/partials/content/clases/sesion/_editarGanadorPreguntaPartial.html',
        //    controller  : 'ModalEditarGanadorPreguntaController',
        //    size        : 'lg',
        //    backdrop    : 'static',
        //    resolve     : {
        //        id_curso: function () {
        //            return $scope.id_curso;
        //        },
        //        pregunta: function () {
        //            return pregunta;
        //        }
        //    }
        //});
        //
        //modalInstance.result.then(function (ganadorSeleccionado){
        //    var data = {
        //        pregunta : pregunta,
        //        id_user  : ganadorSeleccionado.id_user
        //    };
        //    PreguntasServices.asignarGanador(data).then(function (response) {
        //        if(!response.error){
        //            PreguntasServices.obtenerPreguntasClase({'id_clase':$stateParams.id_clase}).then(function (data) {
        //                if(data.error){
        //                    alerta('danger', 'Error. "'+data.error.err.code+'"');
        //                }else{
        //                    $scope.listaPreguntasClase= _.cloneDeep(data);
        //                    alerta('success', 'Nuevo ganador asignado.');
        //                }
        //            });
        //        }else{
        //            alerta('danger', 'No se pudo asignar ganador. "'+data.error.err.code+'"');
        //        }
        //    });
        //});
    };
    //boton finalizar sesion
    $scope.finalizarSesion = function () {
        //var data ={
        //    nombreSala: $stateParams.semestre+$stateParams.curso+$stateParams.id_clase
        //};
        //SocketServices.emit('finalizarSesion', data);
        //var dataClase = {
        // 'id_clase':$stateParams.id_clase,
        //  'estado_sesion':'cerrada'
        //};
        //ClasesServices.actualizarSesionClase(dataClase).then(function (data) {
        //    if(!data.error){
        //        $state.transitionTo('crsApp.cursosSemestre.clases', {ano:$stateParams.ano,semestre:$stateParams.semestre,curso:$stateParams.curso});
        //    }
        //});
    };
    //boton proyectar sesion
    $scope.proyectarSesion = function () {
    //
    };

});

crsApp.controller('ModalEditarGanadorPreguntaController', function ($scope, $uibModalInstance, EstudiantesServices, PreguntasServices, id_curso, pregunta) {

    //$scope.pregunta = pregunta;
    //$scope.sin_ganador = {'id_user':null};
    //EstudiantesServices.ObtenerListaEstudiantes({id_curso:id_curso}).then(function (data) {
    //    if(!data.error){
    //        $scope.listaEstudiantes = _.cloneDeep(data.estudiantes);
    //        if(!_.isNull(pregunta.id_user)){
    //            $scope.ganadorActual = _.findWhere($scope.listaEstudiantes,{id_user:pregunta.id_user});
    //            $scope.listaEstudiantes.ganador = _.cloneDeep($scope.ganadorActual);
    //        }
    //    }
    //});
    //$scope.aceptar = function () {
    //    $uibModalInstance.close(angular.fromJson($scope.listaEstudiantes.ganador));
    //};
    //
    //$scope.cancelar = function () {
    //    $uibModalInstance.dismiss();
    //}
});