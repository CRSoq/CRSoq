crsApp.controller('SesionController', function($scope, $rootScope, $state, $stateParams, $q, $timeout, $mdDialog, $localStorage, toastr, SessionServices, CursosServices, ClasesServices, PreguntasServices, SocketServices){
    $scope.listaPreguntasClase=[];
    $scope.listaPreguntasClaseEdit=[];
    $scope.id_curso = null;
    $scope.promesas = [];
    $scope._ = _;

    if(_.isUndefined($localStorage.sesion_id)){
        $scope.sesion_id = null;
    }else{
        $scope.sesion_id = $localStorage.sesion_id;
    }
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

    var infoSesion = {
        ano: Number($stateParams.ano),
        semestre: Number($stateParams.semestre),
        curso: $stateParams.nombre_asignatura,
        id_clase: Number($stateParams.id_clase),
        id_curso: Number($stateParams.id_curso),
        sala: $stateParams.ano+$stateParams.semestre+$stateParams.nombre_asignatura+$stateParams.id_clase
    };
    SocketServices.emit('SolicitarEstado', infoSesion);
    $rootScope.$on('cargarPregunta', function (event, data) {
        $state.transitionTo('crsApp.asignatura.curso.clases.sesion.pregunta',{nombre_asignatura:$stateParams.nombre_asignatura,ano:$stateParams.ano,semestre:$stateParams.semestre,id_curso:$stateParams.id_curso,id_clase:$stateParams.id_clase,id_pregunta:data.pregunta.id_pregunta});
        //$rootScope.$emit('cargarEstadoPregunta', data);
        event.stopPropagation();
    });
    //boton añadir pregunta de la biblioteca
    $scope.agregarPregunta = function () {
        $mdDialog
            .show({
                templateUrl: '/partials/content/asignatura/curso/preguntas/modalAgregarPregunta.html',
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
        $mdDialog
            .show({
                templateUrl: '/partials/content/asignatura/curso/clases/sesion/modalEliminarPregunta.html',
                locals : {
                    pregunta:pregunta
                },
                controller: 'modalEliminarPreguntaClaseController'
            })
            .then(
            function () {
                if(pregunta.nuevo){
                    $scope.listaPreguntasClase.splice(_.findIndex($scope.listaPreguntasClase,{'$$hashKey':pregunta.$$hashKey}),1);
                }else{
                    PreguntasServices.eliminarPreguntaDeLaClase(pregunta)
                        .then(function (response) {
                            toastr.success('Pregunta eliminada de la clase.');
                            $scope.listaPreguntasClase.splice($index,1);
                        }, function (error) {
                            toastr.error('No se pudo eliminar la pregunta: '+error.err.code, 'Error.');
                        });
                }
            });
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
        $mdDialog
            .show({
                templateUrl: '/partials/content/asignatura/curso/clases/sesion/modalEditarGanadorPregunta.html',
                locals:{
                    pregunta: pregunta,
                    id_curso: $stateParams.id_curso
                },
                controller: 'ModalEditarGanadorPreguntaController'
            })
            .then(
            function (listas) {
                if (listas.nueva.length>0) {
                    var promesas = [];
                    _.forEach(listas.nueva, function (estudiante) {
                        var estd_ant = _.findWhere(listas.back, {id_user: estudiante.id_user});
                        if (!_.isUndefined(estd_ant)) {
                            if (estd_ant.estado_part_preg != estudiante.estado_part_preg) {
                                var promesa = PreguntasServices.asignarEstadoParticipacionPregunta(estudiante);
                                promesas.push(promesa);
                            }
                        }
                    });
                    $q.all(promesas).then(function (response) {
                            toastr.success('La participación de la pregunta ha sido modificada.');
                    });
                }
            });
    };
    $scope.finalizarSesion = function () {
        var data ={
            sala: $stateParams.ano+$stateParams.semestre+$stateParams.nombre_asignatura+$stateParams.id_clase
        };
        SocketServices.emit('finalizarSesion', data);
        var dataClase = {
         id_clase:$stateParams.id_clase,
         estado_sesion:'cerrada'
        };
        ClasesServices.actualizarSesionClase(dataClase).then(function (response) {
            if(response.success){
                $state.transitionTo('crsApp.asignatura.curso.clases', {
                    ano:$stateParams.ano,
                    semestre:$stateParams.semestre,
                    nombre_asignatura:$stateParams.nombre_asignatura,
                    id_curso:$scope.curso.id_curso});
                SocketServices.emit('actualizarListaClase', curso);
                delete $localStorage.sesion_id;
            }else{
                toastr.error('No se pudo finalizar la sesión: '+response.err.code,'Error');
            }
        });
    };
    //boton proyectar sesion
    $scope.proyectarSesion = function () {
    //obtener id sesion y pasarlo
        if(_.isNull($scope.sesion_id)){
            $scope.sesion_id = _.random(1000,9999);
            $localStorage.sesion_id = $scope.sesion_id;
        }

        $mdDialog
            .show({
                templateUrl: '/partials/content/asignatura/curso/clases/sesion/modalProyectarSesion.html',
                locals:{
                    curso: $scope.curso,
                    sesion_id: $scope.sesion_id
                },
                controller: 'ModalProyectarSesionController'
            })
            .then(
            function () {
                SocketServices.emit('registrarIdEspectador',{
                    sala: $stateParams.ano+$stateParams.semestre+$stateParams.nombre_asignatura+$stateParams.id_clase,
                    sesion_id: $scope.sesion_id
                })
            });
    };

});

crsApp.controller('ModalEditarGanadorPreguntaController', function ($scope, $mdDialog, EstudiantesServices, PreguntasServices, id_curso, pregunta) {
    $scope.pregunta = pregunta;
    $scope.ganador = {'id_user':null};
    $scope.listaParticipantes = [];
    $scope.listaParticipantesBack = [];
    PreguntasServices.obtenerParticipantesPregunta({id_curso:id_curso}, pregunta).then(function (response) {
        if(response.success){
            if(!_.isUndefined(response.result) && response.result.length>0){
                $scope.listaParticipantes = _.cloneDeep(response.result);
                $scope.listaParticipantesBack = _.cloneDeep(response.result);
            }
        }
    });

    $scope.cambiarParticipacion = function (estudiante) {
        var index = _.findIndex($scope.listaParticipantes, {estado_part_preg:"ganador"});
        if(index>-1){
            if(estudiante.estado_part_preg=="perdedor"){
                estudiante.estado_part_preg="noSeleccionado"
            }else{
                estudiante.estado_part_preg="perdedor"
            }
        }else{
            if(estudiante.estado_part_preg=="perdedor"){
                estudiante.estado_part_preg="noSeleccionado"
            }else if(estudiante.estado_part_preg=="noSeleccionado"){
                estudiante.estado_part_preg="ganador"
            }else{
                estudiante.estado_part_preg="perdedor"
            }
        }
    };
    $scope.cancelar = function() {
        $mdDialog.cancel();
    };

    $scope.aceptar = function() {
        $mdDialog.hide({nueva:$scope.listaParticipantes,back:$scope.listaParticipantesBack});
    };
});
crsApp.controller('modalEliminarPreguntaClaseController', function ($scope, $mdDialog, pregunta) {
    $scope.pregunta = _.cloneDeep(pregunta);
    $scope.cancelar = function() {
        $mdDialog.cancel();
    };

    $scope.aceptar = function() {
        $mdDialog.hide();
    };
});
crsApp.controller('ModalProyectarSesionController', function ($scope, $mdDialog, curso, sesion_id, $location) {
    $scope.curso=curso;
    $scope.sesion_id=sesion_id;
    $scope.link = 'http://'+$location.host()+':'+$location.port()+'/#/espectador/'+curso.nombre_curso+'/'+sesion_id;
    $scope.cancelar = function() {
        $mdDialog.cancel();
    };

    $scope.aceptar = function() {
        $mdDialog.hide();
    };
});