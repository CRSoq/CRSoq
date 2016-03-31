crsApp.controller('CursosController', function($scope, $rootScope, $filter, $stateParams, $uibModal, $timeout, CursosServices, SessionServices) {
    $scope.menu = CursosServices.getAllCursos();
    $scope.alerts = [];
    var found = $filter('filter')($scope.menu,  {'nombre':$stateParams.semestre}, true)[0];
    if(!angular.isUndefined(found)) {
        $scope.semestre = found;
    }
    $scope.crearCurso = function () {
        var modalInstance = $uibModal.open({
            animation   : true,
            templateUrl : '/partials/content/main/crearCursoModal.html',
            controller  : 'ModalCrearCursoController',
            size        : 'lg',
            backdrop    : 'static'
        });

        modalInstance.result.then(function (curso){
            CursosServices.crearCurso(curso).then(function (data) {
                if(data.error){
                    alerta('danger', 'No se pudo crear el curso "'+data.err+'"');
                }else{
                    $rootScope.$emit('actualizarControladores');
                    alerta('success', 'Curso creado');
                }
            });
        });
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

crsApp.controller('ModalCrearCursoController', function ($scope, $timeout, $uibModalInstance, SessionServices, CalendarioServices, AsignaturasServices) {
    $scope.curso = {};
    $scope.alerts = [];
    $scope.asignaturas = [];
    $scope.anos = [];
    $scope.semestres = [];
    $scope.asignaturaSeleccionada = [];
    $scope.anoSeleccionado = [];
    $scope.semestreSeleccionado = [];
    $scope.calendario = [];
    $scope.cargandoAsignaturas=true;
    $scope.cargandoAno=true;
    $scope.cargandoSemestre=true;
    AsignaturasServices.obtenerAsignaturas().then(function (response) {
        if(!response.error){
            $scope.asignaturas = _.cloneDeep(response);
        }else{
            console.log(response.err.code);
        }
        $scope.cargandoAsignaturas=false;
    });
    CalendarioServices.obtenerCalendario().then(function (response) {
        if(!response.error){
            $scope.anos = _.cloneDeep(response);
            $scope.anos = _.chain($scope.anos)
                .groupBy('ano')
                .pairs()
                .map(function (item) {
                    return _.object(_.zip(['ano', 'semestres'], item));
                })
                .value();
            $scope.anos=_.map(_.sortByOrder($scope.anos, ['ano'], ['desc']));
        }else{
            console.log(response.err.code);
        }
        $scope.cargandoAno=false;
    });

    $scope.cargarSemestre = function (ano) {
        $scope.cargandoSemestre=false;
        $scope.semestres = _.cloneDeep(ano.semestres);
        $scope.semestres = _.chain($scope.semestres)
            .groupBy('semestre')
            .pairs()
            .map(function (item) {
                return _.object(_.zip(['semestre', 'calendario'], item));
            })
            .value();
        $scope.semestres=_.map(_.sortByOrder($scope.semestres, ['semestre'], ['desc']));
    };

    $scope.guardarCalendario = function (calendario) {
        if(!_.isUndefined(calendario)){
            $scope.calendario = _.cloneDeep(calendario[0]);
        }
    };

    $scope.aceptar = function () {
        var dataUsuario = SessionServices.getSessionData();
        $scope.curso = {
            nombre_curso    : $scope.asignaturaSeleccionada.nombre_asignatura,
            id_asignatura   : $scope.asignaturaSeleccionada.id_asignatura,
            id_calendario   : $scope.calendario.id_calendario,
            ano             : $scope.calendario.ano,
            semestre        : $scope.calendario.semestre,
            estado_curso    : 'creado',
            id_user         : dataUsuario.id_user
        };
        if(_.isUndefined($scope.curso.nombre_curso) || _.isUndefined($scope.curso.id_calendario) ){
            alerta('danger', 'Debe completar todos los campos.');
        }else{
            $uibModalInstance.close($scope.curso);
        }
    };

    $scope.cancelar = function () {
        $uibModalInstance.dismiss();
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

crsApp.controller('CursoGralInfoController', function ($scope, $rootScope, $stateParams, $location, CursosServices) {
    obtenerInfo();
    $rootScope.$on('actualizarControladores', function () {
        obtenerInfo();
    });
    function obtenerInfo(){
        var cursos = CursosServices.obtenerCursosLocal();
        var semestre = _.findWhere(cursos,{'ano': Number($stateParams.ano), 'semestre':Number($stateParams.semestre)})
        var curso = _.findWhere(semestre.cursos, {'nombre_curso': $stateParams.curso});
        $scope.estado_curso = curso.estado_curso;
    }
});

crsApp.controller('ConfigCursoController', function ($scope, $rootScope, $state, $stateParams, CursosServices, ModulosServices, SessionServices, EstudiantesServices) {
    var cursos = CursosServices.obtenerCursosLocal();
    var semestre = _.findWhere(cursos,{'ano': Number($stateParams.ano), 'semestre':Number($stateParams.semestre)})
    var curso = _.findWhere(semestre.cursos, {'nombre_curso': $stateParams.curso});
    $scope.config = [
        {
            'id_curso': curso.id_curso
        },
        {
            'modulos': []
        },
        {
            'modulosEliminados': []
        }
    ];
    $scope.modulos = [];
    $scope.listaModulos = [];
    $scope.modulosEliminados = [];
    ModulosServices.obtenerModulos(curso).then(function (data) {
        if(data){
            _.assign($scope.modulos,data);
            $scope.modulos=_.sortByOrder($scope.modulos,['posicion'],['asc']);
            _.assign($scope.listaModulos,data);
            _.sortByOrder($scope.listaModulos,['posicion'],['asc']);
        }else{
            var modulo = {
                'nombre_modulo': '',
                'posicion': $scope.modulos.length+1
            };
            $scope.modulos.push(modulo);
        }
    });

    $scope.agregarModulo = function () {
        var modulo = {
            'nombre_modulo': '',
            'posicion': $scope.modulos.length+1
        };
        $scope.modulos.push(modulo);
    };
    $scope.subirModulo = function (posicionModuloActual) {
        var posicionActual = posicionModuloActual-1;
        var moduloAux = {
            'nombre_modulo': $scope.modulos[posicionActual].nombre_modulo
        };
        $scope.modulos[posicionActual].nombre_modulo=$scope.modulos[posicionActual-1].nombre_modulo;
        $scope.modulos[posicionActual-1].nombre_modulo=moduloAux.nombre_modulo;
    };
    $scope.bajarmodulo = function (posicionModuloActual) {
        var posicionActual = posicionModuloActual - 1;
        var moduloAux = {
            'nombre_modulo': $scope.modulos[posicionActual].nombre_modulo
        };
        $scope.modulos[posicionActual].nombre_modulo = $scope.modulos[posicionActual + 1].nombre_modulo;
        $scope.modulos[posicionActual + 1].nombre_modulo = moduloAux.nombre_modulo;
    };
    $scope.eliminarModulo = function (posicionModulo) {
        var pos = posicionModulo-1;
        if(!_.isUndefined($scope.modulos[pos].id_modulo)){
            $scope.modulosEliminados.push($scope.modulos[pos]);
        }
        $scope.modulos.splice(pos,1);
        while(pos<$scope.modulos.length){
            $scope.modulos[pos].posicion--;
            pos++;
        }
    };
    $scope.guardarConfig = function () {
        $scope.config[1].modulos = [];
        $scope.config[2].modulosEliminados = [];
        _.assign($scope.config[1].modulos,$scope.modulos);
        _.assign($scope.config[2].modulosEliminados,$scope.modulosEliminados);
        if(campoVacio($scope.modulos)){
            ModulosServices.guardarModulos($scope.config).then(function (data) {
                if(data[0].insert.length==0 && data[1].update.length==0 && data[2].delete.length==0){
                    if(curso.estado_curso=='creado'){
                        CursosServices.cambiarEstado(curso.id_curso,'abierto').then(function (data) {
                            CursosServices.obtenerCursos(SessionServices.getSessionData()).then(function (data) {
                                if(data){
                                    $rootScope.$emit('actualizarControladores');
                                }
                            });
                        });
                    }
                    $state.transitionTo("crsApp.cursosSemestre.curso",{ano:$stateParams.ano,semestre:$stateParams.semestre,curso:$stateParams.curso});
                }
            });
        }else{
            $scope.cancelarConfig();
        }

        function campoVacio(lista){
            var i=0;
            while(i<lista.length){
                if(_.isEmpty(lista[i].nombre_modulo)){
                    return false;
                }
                i++;
            }
            return true;
        }

    };
    $scope.cancelarConfig = function () {
        $state.transitionTo("crsApp.cursosSemestre.curso",{ano:$stateParams.ano,semestre:$stateParams.semestre,curso:$stateParams.curso});
    };

    //alumnos
    $scope.generarUsuario = true;
    $scope.generarClave = true;
    //$scope.listaEstudiantes = [];
    EstudiantesServices.ObtenerListaEstudiantes(curso).then(function (data) {
        if(data.error){
            console.log('error get '+data.err.code);
        }else{
            $scope.listaEstudiantes= _.cloneDeep(data.estudiantes);
        }
    });
    $scope.agregarEstudiante = function () {
        var estudiante = {
            'id_curso': curso.id_curso,
            'nombre': null,
            'apellido': null,
            'rut': null,
            'usuario': null,
            'clave': null,
            'edicion': true,
            'nuevo': true
        };
        $scope.listaEstudiantes.push(estudiante);
    };

    $scope.generarUsuarioEstudiante = function (estudiante) {
        if($scope.generarUsuario){
            estudiante.usuario = estudiante.nombre.charAt(0)+estudiante.apellido;
        }
    };
    $scope.generarClaveEstudiante = function (estudiante) {
        if($scope.generarClave){
            estudiante.clave = estudiante.rut.replace(/\D+/g, '');
        }
    };
    $scope.formatoRut = function(estudiante){
        //darle formato al rut mientras escribe
        //XX.XXX.XXX-Y
        //console.log(rut);
    };
    $scope.guardarEstudiante = function (estudiante) {
        if(!_.isUndefined(estudiante.nuevo)) {
            EstudiantesServices.ObtenerEstudiante(estudiante).then(function (data) {
                if (data.error) {
                    console.log('error ' + data.err);
                } else {
                    if (data.estudiante.length == 1) {
                        //existe estudiante asigno al curso
                        estudiante.id_user = data.estudiante[0].id_user;
                        var EstudianteCurso = {
                            'id_user': estudiante.id_user,
                            'id_curso': estudiante.id_curso
                        };
                        EstudiantesServices.AsignarCursoAEstudiante(EstudianteCurso).then(function (data) {
                            if (data.error) {
                                console.log('error asignar curso ' + data.err);
                            } else {
                                console.log('data ' + data.result);
                                delete estudiante['nuevo'];
                                estudiante.edicion = false;
                            }
                        });
                    } else if (data.estudiante.length == 0) {
                        //no existe, creo estudiante, luego asigno al curso
                        EstudiantesServices.CrearEstudiante(estudiante).then(function (data) {
                            if (data.error) {
                                console.log('error crear estud ' + data.err);
                                if (data.err.code == 'ER_DUP_ENTRY') {
                                    //generar sugerencia de usuario
                                    console.log('ya existe el mismo usuario');
                                }
                            } else {
                                estudiante.id_user = data.id_user;
                                var EstudianteCurso = {
                                    'id_user': estudiante.id_user,
                                    'id_curso': estudiante.id_curso
                                };
                                EstudiantesServices.AsignarCursoAEstudiante(EstudianteCurso).then(function (data) {
                                    if (data.error) {
                                        console.log('error asignar curso ' + data.err);
                                    } else {
                                        //console.log('data ' + data.result);
                                        delete estudiante['nuevo'];
                                        estudiante.edicion = false;
                                    }
                                });
                            }
                        });
                    } else {
                        //error
                        console.log('error otro ' + data);
                    }
                }
            });
        }else{
            EstudiantesServices.ActualizarEstudiante(estudiante).then(function (data) {
                if(data.error){
                    console.log('error al actualizar '+data.err.code);
                }else{
                    estudiante.edicion = false;
                }
            });
        }
    };
    $scope.editarEstudiante = function (estudiante) {
        estudiante.edicion = true;
    };
    $scope.eliminarEstudianteDelCurso = function (estudiante, index) {
        EstudiantesServices.EliminarEstudianteDelCurso(estudiante).then(function (data) {
            if(data.error){
                console.log(data.err.code);
            }else{
                $scope.listaEstudiantes.splice(index,1);
            }
        });
    };
    $scope.cancelarEstudiante = function (estudiante, index) {
        if(!_.isUndefined(estudiante.nuevo)){
            $scope.listaEstudiantes.splice(index, 1);
        }else{
            estudiante.edicion = false;
        }
    };
});