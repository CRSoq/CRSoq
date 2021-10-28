'use strict';
crsApp.controller('MenuController', function($scope, $rootScope, $stateParams, $state, $q, $mdSidenav, toastr, $localStorage, CursosServices, SessionServices){
    cargarMenu();
    $scope.menuCerrado = true;
    $rootScope.cerrar = $scope.menuCerrado;
    if(!_.isUndefined($localStorage.menuCerrado)){
        $scope.menuCerrado = $localStorage.menuCerrado;
        $rootScope.cerrar = $scope.menuCerrado; //a
    }

    $scope.listaCursos = [];
    $scope.mostrarSemestreLista = [];
    $scope.mostrarCursosLista = [];
    $scope.listaDeSemestres = [];
    $scope.listaDeAsignaturas = [];
    $scope.listaDeCursos = [];
    $scope.logOut = function(){
        SessionServices.destroySession();
        $state.transitionTo("crsApp.login");
    };
    $scope.cerrarMenu = function () {
        if($mdSidenav('left').isOpen()){
            $mdSidenav('left').toggle();
        }
    };
    $scope.bloquearMenu = function () {
        $scope.menuCerrado = !$scope.menuCerrado;
        $rootScope.cerrar = $scope.menuCerrado;
        if($mdSidenav('left').isOpen() && $scope.menuCerrado){
            $mdSidenav('left').toggle();
        }
        $localStorage.menuCerrado = $scope.menuCerrado;
    };
    //funciones para el manejo del menú del profesor.
    $scope.desplegarMenuAsignatura = function (asignatura) {
        var exist = _.findIndex($scope.listaDeAsignaturas,{'id_asignatura':asignatura.id_asignatura});
        if(exist>=0){
            $scope.listaDeAsignaturas.splice(exist,1);
            var cloneLista = _.cloneDeep($scope.listaDeCursos);
            _.forEach(cloneLista, function (item) {
                if(item.id_asignatura == asignatura.id_asignatura){
                    $scope.listaDeCursos.splice(_.findIndex($scope.listaDeCursos,{'id_asignatura':asignatura.id_asignatura}),1);
                }
            })
        }else{
            $scope.listaDeAsignaturas.push(asignatura);
        }
    };

    $scope.mostrarCursosAsignatura = function (curso) {
        var exist = _.findLastIndex($scope.listaDeAsignaturas, {'id_asignatura':curso.id_asignatura});
        return exist >= 0;
    };

    $scope.desplegarMenuCurso = function (curso) {
        var exist = _.findIndex($scope.listaDeCursos,{'id_curso':curso.id_curso});
        if(exist>=0){
            $scope.listaDeCursos.splice(exist,1);
        }else{
            $scope.listaDeCursos.push(curso);
        }
    };

    $scope.mostrarMenuCurso = function (curso) {
        var exist = _.findLastIndex($scope.listaDeCursos, {'id_curso':curso.id_curso});
        return exist >= 0;
    };
    //funciones para el manejo del menú del estudiante.
    $scope.desplegarMenuSemestre = function (semestre) {
        var exist = _.findIndex($scope.listaDeSemestres,{'nombre':semestre.nombre});
        if(exist>=0){
            $scope.listaDeSemestres.splice(exist,1);
            var cloneLista = _.cloneDeep($scope.listaDeCursos);
            _.forEach(cloneLista, function (item) {
                if(item.anoSemestre == semestre.nombre){
                    $scope.listaDeCursos.splice(_.findIndex($scope.listaDeCursos,{'anoSemestre':semestre.nombre}),1);
                }
            })
        }else{
            $scope.listaDeSemestres.push(semestre);
        }
    };

    $scope.mostrarCursosSemestre = function (curso) {
        var exist = _.findLastIndex($scope.listaDeSemestres, {'nombre':curso.anoSemestre});
        return exist >= 0;
    };

    $scope.mostrarMenu = function (curso) {
        var exist = _.findLastIndex($scope.listaDeCursos, {'id_curso':curso.id_curso});
        return exist >= 0;
    };

    $rootScope.$on('actualizarControladores', function () {
        cargarMenu();
    });

    function cargarMenu(){
        CursosServices.obtenerCursos(SessionServices.getSessionData()).then(
            function (response) {
                if(response.success){
                    $scope.menu= _.cloneDeep(response.result);
                    CursosServices.almacenarCursos($scope.menu);
                }else{
                    toastr.error('No se pudo obtener los cursos: '+response.err.code,'Error');
                }
            });
    }
    // en caso de pasar los parametros por la url
    // se hace una consulta local
    var curso = null;
    if (!_.isUndefined($rootScope.user)) {
        if (_.size($stateParams) > 0 && $rootScope.user.tipo == 'profesor') {
            if (!_.isUndefined($stateParams.nombre_asignatura)) {
                var asignaturas = CursosServices.obtenerCursosLocal();
                if (asignaturas.length > 0) {
                    var asignatura = _.findWhere(asignaturas, {'asignatura': $stateParams.nombre_asignatura});
                    $scope.desplegarMenuAsignatura(asignatura);
                    if (!_.isUndefined($stateParams.ano) && !_.isUndefined($stateParams.semestre) && !_.isUndefined($stateParams.grupo_curso) && !_.isUndefined($stateParams.id_curso)) {
                        curso = _.findWhere(asignatura.cursos, {'id_curso': Number($stateParams.id_curso)});
                        $scope.desplegarMenuCurso(curso);
                    }
                }
            }
        } else if (_.size($stateParams) > 0 && $rootScope.user.tipo == 'estudiante') {
            if (!_.isUndefined($stateParams.nombre_asignatura)) {
                var semestres = CursosServices.obtenerCursosLocal();
                if (!_.isUndefined($stateParams.ano) && !_.isUndefined($stateParams.semestre) && semestres.length > 0) {
                    var semestre = _.findWhere(semestres, {
                        'ano': Number($stateParams.ano),
                        'semestre': Number($stateParams.semestre),
                        'grupo_curso': String($stateParams.grupo_curso)
                    });
                    $scope.desplegarMenuSemestre(semestre);
                    if (!_.isUndefined($stateParams.id_curso)) {
                        curso = _.findWhere(semestre.cursos, {'id_curso': Number($stateParams.id_curso)});
                        $scope.desplegarMenuCurso(curso);
                    }
                }
                else {
                    console.log('error_reading_semester');
                }

            }
        } else if (_.size($stateParams) > 0 && $rootScope.user.tipo == 'admin') {
            //desplegar menu
        }
    }
});