crsApp.controller('MenuController', function($scope, $rootScope, $stateParams, $filter, $localStorage,CursosServices,SessionServices){

    CursosServices.obtenerCursos(SessionServices.getSessionData()).then(
        function (response) {
            $scope.menu= _.cloneDeep(response.result);

            CursosServices.almacenarCursos($scope.menu);
    }, function (error) {
        //error
    });
    $scope.listaCursos = [];
    $scope.mostrarSemestreLista = [];
    $scope.mostrarCursosLista = [];

    $scope.listaDeSemestres = [];
    $scope.listaDeAsignaturas = [];
    $scope.listaDeCursos = [];
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


    $scope.mostrarSemestre = function (variable){
        var indexSemestre = _.findIndex($scope.mostrarSemestreLista, {'id':variable});
        if(indexSemestre>=0){
            $scope.mostrarSemestreLista.splice(indexSemestre, 1);
        }else{
            $scope.mostrarSemestreLista.splice(0, 1);
            $scope.mostrarSemestreLista.push({'id':variable});
        }
    };
    $scope.buscarSemestre = function (indice){
        var found = _.findWhere($scope.mostrarSemestreLista,{id:indice});
        return !_.isUndefined(found);
    };
    $scope.mostrarCurso = function (padre,indice){
        var indexCurso = _.findIndex($scope.mostrarSemestreLista, {parent:padre,id:indice});
        if(indexCurso>=0){
            $scope.mostrarCursosLista.splice(indexCurso, 1);
        }else{
            $scope.mostrarCursosLista.splice(0, 1);
            $scope.mostrarCursosLista.push({parent:padre, id:indice});
        }
    };
    $scope.buscarCurso = function (padre, indice){
        var found = _.findWhere($scope.mostrarCursosLista,{parent:padre,id:indice});
        return !_.isUndefined(found);
    };
    $scope.data = function(){
        var data = {
            usuario : $localStorage.usuario,
            tipo: $localStorage.tipo
        };
        if ($localStorage.usuario !='' && $localStorage.tipo != '' ){
            return data;
        }else{
            return false;
        }
    };

    $rootScope.$on('actualizarControladores', function () {
        cargarMenu();
    });

    function cargarMenu(){
        CursosServices.obtenerCursos(SessionServices.getSessionData()).then(function (data) {
            if(data.error){
            }else{
                $scope.menu=data;
            }
        });
    }
    // en caso de pasar los parametros por la url
    // se hace una consulta local
    if(_.size($stateParams)>0 && $rootScope.user=='profesor'){
        if(!_.isUndefined($stateParams.nombre_asignatura)){
            var asignaturas = CursosServices.obtenerCursosLocal();
            var asignatura = _.findWhere(asignaturas,{'asignatura':$stateParams.nombre_asignatura});
            $scope.desplegarMenuAsignatura(asignatura);
            if(!_.isUndefined($stateParams.ano) && !_.isUndefined($stateParams.semestre) && !_.isUndefined($stateParams.id_curso)){
                var curso = _.findWhere(asignatura.cursos, {'id_curso': Number($stateParams.id_curso)});
                $scope.desplegarMenuCurso(curso);
            }
        }
    }
});