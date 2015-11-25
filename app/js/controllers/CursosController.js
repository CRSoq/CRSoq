crsApp.controller('CursosController', function($scope, $rootScope, $filter, $stateParams, $modal, $timeout, CursosServices) {
    $scope.menu = CursosServices.getAllCursos();
    $scope.alerts = [];
    var found = $filter('filter')($scope.menu,  {'nombre':$stateParams.semestre}, true)[0];
    if(!angular.isUndefined(found)) {
        $scope.semestre = found;
    }
    $scope.crearCurso = function () {
        var modalInstance = $modal.open({
            animation   : true,
            templateUrl : '/partials/content/main/crearCursoModal.html',
            controller  : 'ModalCrearCursoController',
            size        : 'lg',
            backdrop    : 'static',
            resolve     : {
                /*items: function () {
                    return
                }*/
            }
        });

        modalInstance.result.then(function (curso){
            CursosServices.crearCurso(curso).then(function (data) {
                if(data.error){
                    var id_alert = $scope.alerts.length+1;
                    $scope.alerts.push({id: id_alert,type:'danger', msg:'No se pudo crear el curso "'+data.err+'"'});
                    closeAlertTime(id_alert);
                }else{
                    $rootScope.$emit('actualizarControladores');
                    var id_alert = $scope.alerts.length+1;
                    $scope.alerts.push({id: id_alert,type:'success', msg:'Curso creado'});
                    closeAlertTime(id_alert);
                }
            });
        });
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

crsApp.controller('ModalCrearCursoController', function ($scope, $timeout, $modalInstance, SessionServices) {
    $scope.alerts = [];
    $scope.aceptar = function () {
        var dataUsuario = SessionServices.getSessionData();
        var curso = {
            nombre      : $scope.nombre,
            ano         : $scope.ano,
            semestre    : $scope.semestre,
            estado      : 'creado',
            id_user     : dataUsuario.id_user
        };
        if(_.isEmpty(curso.nombre) || _.isEmpty(curso.ano) || _.isEmpty(curso.semestre) ){
            var id_alert = $scope.alerts.length+1;
            $scope.alerts.push({id: id_alert,type:'danger', msg:'Debe completar todos los campos.'});
            closeAlertTime(id_alert);
        }else{
            $modalInstance.close(curso);
        }
    };

    $scope.closeAlert = function(index) {
        $scope.alerts.splice(index, 1);
    };
    var closeAlertTime = function(id_alert) {
        $timeout(function(){
            $scope.alerts.splice(_.findIndex($scope.alerts,{id:id_alert}), 1);
        }, 3000);
    };
    $scope.cancelar = function () {
        $modalInstance.dismiss();
    }
});

crsApp.controller('CursoGralInfoController', function ($scope, $rootScope, $stateParams, $location, CursosServices) {
    obtenerInfo();
    $rootScope.$on('actualizarControladores', function () {
        obtenerInfo();
    });
    function obtenerInfo(){
        var ano_semestre=$location.path();
        ano_semestre=ano_semestre.substring(8,ano_semestre.length);
        ano_semestre=ano_semestre.substring(0,ano_semestre.indexOf('/'));
        //var algo =CursosServices.getCursoPorNombre(ano_semestre,$stateParams.curso);
        var cursos = CursosServices.getAllCursos();
        var positionSemestre = _.findIndex(cursos, {'nombre':ano_semestre});
        if(positionSemestre>=0){
            var positionCurso = _.findIndex(cursos[positionSemestre].cursos, {'nombre_curso':$stateParams.curso});
            if(!_.isUndefined(cursos[positionSemestre].cursos[positionCurso])){
                $scope.estado = cursos[positionSemestre].cursos[positionCurso].estado;
            }
        }else{
            return false;
        }
    }

});

crsApp.controller('ConfigCursoController', function ($scope, $rootScope, $state, $stateParams, CursosServices, ModulosServices, SessionServices, EstudiantesServices) {
    var curso = CursosServices.getCursoPorNombre($stateParams.semestre, $stateParams.curso);
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
                    if(curso.estado=='creado'){
                        CursosServices.cambiarEstado(curso.id_curso,'abierto').then(function (data) {
                            CursosServices.obtenerCursos(SessionServices.getSessionData()).then(function (data) {
                                if(data){
                                    $rootScope.$emit('actualizarControladores');
                                }
                            });
                        });
                    }
                    $state.transitionTo("crsApp.cursosSemestre.curso",{semestre:$stateParams.semestre,curso:$stateParams.curso});
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
        $state.transitionTo("crsApp.cursosSemestre.curso",{semestre:$stateParams.semestre,curso:$stateParams.curso});
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
        //llamar al servicio
        //error..ya existe mismo usuario
        //  mostrar sugerencias
        //  se envia la sugerencia
        EstudiantesServices.ObtenerEstudiante(estudiante).then(function (data) {
            if(data.error){
                console.log('error '+data.err);
            }else{
                if(data.estudiante.length==1){
                    //existe estudiante asigno al curso
                    estudiante.id_user = data.estudiante[0].id_user;
                    var EstudianteCurso = {
                        'id_user':estudiante.id_user,
                        'id_curso':estudiante.id_curso
                    };
                    EstudiantesServices.AsignarCursoAEstudiante(EstudianteCurso).then(function (data) {
                        if(data.error){
                            console.log('error asignar curso '+data.err);
                        }else{
                            console.log('data '+data.result);
                            delete estudiante['nuevo'];
                            estudiante.edicion = false;
                        }
                    });
                }else if(data.estudiante.length==0){
                    //no existe, creo estudiante, luego asigno al curso
                    EstudiantesServices.CrearEstudiante(estudiante).then(function (data) {
                        if(data.error){
                            console.log('error crear estud '+data.err);
                            if(data.err.code=='ER_DUP_ENTRY'){
                                //generar sugerencia de usuario
                            }
                        }else{
                            estudiante.id_user = data.id_user;
                            var EstudianteCurso = {
                                'id_user':estudiante.id_user,
                                'id_curso':estudiante.id_curso
                            };
                            EstudiantesServices.AsignarCursoAEstudiante(EstudianteCurso).then(function (data) {
                                if(data.error){
                                    console.log('error asignar curso '+data.err);
                                }else{
                                    console.log('data '+data.result);
                                    delete estudiante['nuevo'];
                                    estudiante.edicion = false;
                                }
                            });
                        }
                    });
                }else{
                    //error
                    console.log('error otro '+data);
                }
            }
        });
    };
});