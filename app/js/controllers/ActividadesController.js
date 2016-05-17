'use strict';
crsApp.controller('ActividadesController', function ($scope, $stateParams, $timeout, $q, $mdDialog, toastr, SocketServices, ModulosServices, ClasesServices, ActividadesServices, CursosServices ) {
    var asignaturas = CursosServices.obtenerCursosLocal();
    var asignatura = _.findWhere(asignaturas,{'asignatura':$stateParams.nombre_asignatura});
    $scope.curso = _.findWhere(asignatura.cursos, {'id_curso':Number($stateParams.id_curso)});

    $scope._ = _;
    $scope.promesas = [];
    $scope.actividadesDelcurso = [];
    $scope.listaModulos = [];
    $scope.listaClases = [];
    $scope.actividadesEditadas = [];
    $scope.promesas = ActividadesServices.obtenerActividadesCurso($scope.curso).then(
        function (response) {
            if(response.success){
                $scope.actividadesDelcurso = _.cloneDeep(response.result);
            }else{
                toastr.error('No se pudo obtener actividades del curso: '+response.err.code,'Error');
            }

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
        toastr.error('Error en la obtención de módulos del curso: '+error.err.code,'Error');
    };

    $scope.promesas = ModulosServices.obtenerModulos($scope.curso)
        .then(callbackModulos, callBackModulosError);

    var cargarInformacion = function () {
        _.forEach($scope.actividadesDelcurso, function (actividad) {
            if(!_.isNull(actividad.id_clase)){
                var clase =_.findWhere($scope.listaClases,{'id_clase': actividad.id_clase});
                if(!_.isUndefined(clase)){
                    actividad.clase = clase.descripcion;
                }
            }
        });
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

    $scope.agregarActividad = function () {
        var actividad = {
          'titulo_act':'',
            'estado_actividad':'iniciada',
            'id_clase':null,
            'id_curso':$scope.curso.id_curso,
            'edicion': true
        };
        $scope.actividadesDelcurso.push(actividad);
    };
    $scope.guardarActividad = function (actividad) {
        if(_.isUndefined(actividad.id_actividad)){
            actividad.id_curso  = $scope.curso.id_curso;
            ActividadesServices.crearActividad(actividad).then(
                function (response) {
                    if(response.success){
                        actividad.id_actividad = response.result;
                        if(!_.isNull(actividad.id_clase)){
                            actividad.clase = _.findWhere($scope.listaClases,{'id_clase':actividad.id_clase}).descripcion;
                        }
                        actividad.edicion = false;
                        toastr.success('Actividad creada satisfactoriamente.');
                    }else{
                        toastr.error('No se pudo crear actividad: '+response.err.code,'Error');
                    }

                }
           );
        }else{
            ActividadesServices.actualizarActividad(actividad).then(
                function (response) {
                    if (response.success) {
                        if (!_.isNull(actividad.id_clase)) {
                            actividad.clase = _.findWhere($scope.listaClases, {'id_clase': actividad.id_clase}).descripcion;
                        }
                        $scope.actividadesEditadas.splice(_.findIndex($scope.actividadesEditadas, {'id_actividad': actividad.id_actividad}), 1);
                        toastr.success('Actividad editada satisfactoriamente.');
                        actividad.edicion = false;
                    }else{
                        toastr.error('No se pudo editar la actividad: '+response.err.code,'Error');

                    }
                });
        }
    };
    $scope.eliminarActividad = function (actividad, indice) {
        $mdDialog
            .show({
                templateUrl: '/partials/content/asignatura/curso/actividades/modalEliminarActividad.html',
                locals : {
                    actividad : actividad
                },
                controller: 'ModalEliminarActiviadController'
            })
            .then(
            function () {
                ActividadesServices.eliminarParticipacionActividad(actividad).then(
                    function (response) {
                        if (response.success) {
                            ActividadesServices.eliminarActividad(actividad).then(function (response) {
                                if (response.success) {
                                    $scope.actividadesDelcurso.splice(indice, 1);
                                    toastr.success('Actividad eliminada.');
                                } else {
                                    toastr.error('No se pudo eliminar la actividad: ' + response.err.code, 'Error');
                                }
                            });
                        } else {
                            toastr.error('No se pudo quitar a los participantes de la actividad: '+response.err.code,'Error');
                        }
                    });
            });
    };
    $scope.cancelarCambios = function (actividad, indice) {
        if(_.isUndefined(actividad.id_actividad)){
            $scope.actividadesDelcurso.splice(indice,1);
        }else{
            var indexEdit = _.findIndex($scope.actividadesEditadas,{'id_actividad':actividad.id_actividad});
            actividad.titulo_act =$scope.actividadesEditadas[indexEdit].titulo_act;
            actividad.id_clase =$scope.actividadesEditadas[indexEdit].id_clase;
            actividad.edicion = false;
            $scope.actividadesEditadas.splice(indexEdit,1);
        }
    };
    $scope.editarActividad = function (actividad) {
        actividad.edicion = true;
        var tempAct = _.cloneDeep(actividad);
        $scope.actividadesEditadas.push(tempAct);
    };

    $scope.asignarGanadorActividad = function (actividad) {
        $mdDialog
            .show({
                templateUrl: '/partials/content/asignatura/curso/actividades/modalGanadoresActividad.html',
                locals : {
                    actividad : actividad,
                    curso: $scope.curso
                },
                controller: 'ModalGanadoresActiviadController'
            })
            .then(
            function (resultado) {
                $scope.listaDePromesas = [];
                _.forEach(resultado.estudiantes, function (participante, indice) {
                    var promesa;
                    var ganadorAnterior = _.findIndex(resultado.ganadoresBack,{'id_user':participante.id_user});
                    var ganadorActual = _.findIndex(resultado.ganadores,{'id_user':participante.id_user});
                    if(ganadorAnterior>-1){
                        if(ganadorActual<0){
                            promesa = ActividadesServices.eliminarParticipanteActividad(actividad, participante);
                            $scope.listaDePromesas.push(promesa);
                        }
                    }else{
                        if(ganadorActual>-1){
                            promesa = ActividadesServices.asignarParticipanteActividad(actividad, participante, 'ganador');
                            $scope.listaDePromesas.push(promesa);
                        }
                     }

                });
                $q.all($scope.listaDePromesas).then(function() {
                    toastr.success('Ganador(es) asignado(s) a la actividad de forma correcta.');
                }, function () {
                    toastr.error('No se pudo asignar a Ganador(es) de la actividad.','Error');
                });
           });
    };
});
crsApp.controller('ModalEliminarActiviadController', function ($scope, $mdDialog, actividad) {
    $scope.actividad = actividad;
    $scope.aceptar = function () {
        $mdDialog.hide();
    };

    $scope.cancelar = function () {
        $mdDialog.cancel();
    }
});
crsApp.controller('ModalGanadoresActiviadController', function ($scope, $mdDialog, toastr, actividad, curso, ActividadesServices, EstudiantesServices) {
    $scope.actividad = actividad;
    $scope.ganadores = [];
    $scope.ganadoresBack = [];
    $scope.estudiantes = [];
    EstudiantesServices.obtenerEstudiantesPorCurso(curso).then(function (response) {
        if(response.success){
            $scope.estudiantes = _.cloneDeep(response.result);
        }else{
            toastr.error('No se pudo obtener lista de estudiantes: '+response.err.code,'Error');
        }
    });
    $scope.promesa = ActividadesServices.obtenerParticipantesActividad(actividad).then(function (response) {
        if (response.success) {
            if(response.result.length>0){
                _.forEach(response.result, function (estudiante) {
                    if (estudiante.estado_part_act == 'ganador') {
                        var ganador = _.findWhere($scope.estudiantes, {id_user: estudiante.id_user});
                        ganador.estado_part_act = 'ganador';
                        $scope.ganadores.push(ganador);
                    }
                });
            }

            $scope.ganadoresBack = _.cloneDeep($scope.ganadores);
        } else {
            toastr.error('No se pudo obtener participantes de la actividad: '+response.err.code,'Error');
        }
    });
    $scope.cambiarParticipacion = function (estudiante) {
      if(estudiante.estado_part_act=='ganador'){
          estudiante.estado_part_act='';
          var index = _.findIndex($scope.ganadores,{id_user:estudiante.id_user});
          if(index>-1){
              $scope.ganadores.splice(index,1);
          }
      }else{
          estudiante.estado_part_act='ganador';
          $scope.ganadores.push(estudiante);
      }
    };
    $scope.aceptar = function () {
        $mdDialog.hide({'ganadores':$scope.ganadores, 'ganadoresBack':$scope.ganadoresBack,'estudiantes':$scope.estudiantes});
    };

    $scope.cancelar = function () {
        $mdDialog.cancel();
    }
});
crsApp.controller('ActividadesEstudianteController', function ($scope, $rootScope, $stateParams, $mdDialog, toastr, ActividadesServices, CursosServices, SessionServices, ClasesServices) {
    var estudiante = SessionServices.getSessionData();
    var semestres = CursosServices.obtenerCursosLocal();
    var semestre = _.findWhere(semestres,{'ano':Number($stateParams.ano),'semestre':Number($stateParams.semestre)});
    $scope.curso = _.findWhere(semestre.cursos, {'id_curso': Number($stateParams.id_curso)});
    $scope.promesas=[];
    $scope.listaActividades=[];
    var promesaActividad=ActividadesServices.obtenerActividadesCurso($scope.curso).then(function (response) {
        if(response.success){
            $scope.listaActividades= _.cloneDeep(response.result);
            obtenerParticipacion();
            cargarClases();
        }else{
            toastr.error('No se pudo obtener lista de actividades: '+response.err.code,'Error');
        }
    });
    $scope.promesas.push(promesaActividad);
    var obtenerParticipacion = function () {
        ActividadesServices.obtenerParticipacionPorEstudiante(estudiante).then(function (response) {
            if(response.success){
                _.forEach($scope.listaActividades, function (actividad) {
                    var actividadPart = _.findWhere(response.result,{id_actividad:actividad.id_actividad});
                    if(!_.isUndefined(actividadPart)){
                        actividad.estado_participacion = actividadPart.estado_part_act;
                    }
                });
            }
        });
    };

    var cargarClases = function () {
        _.forEach($scope.listaActividades, function (actividad) {
            if(!_.isNull(actividad.id_clase)){
                ClasesServices.obtenerClasesPorID({id_clase:actividad.id_clase}).then(function (response) {
                    if (response.success) {
                        actividad.clase = response.result[0].descripcion;
                    }
                });
            }

        });
    };
});