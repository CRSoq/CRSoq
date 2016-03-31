crsApp.controller('MenuController', function($scope, $rootScope, $stateParams, $filter, $localStorage,CursosServices,SessionServices){
    CursosServices.obtenerCursos(SessionServices.getSessionData()).then(function (data) {
        if(data.error){
            //error
        }else{
            $scope.menu=data;
            CursosServices.almacenarCursos(data);
        }
    });
    $scope.listaCursos = [];
    $scope.mostrarSemestreLista = [];
    $scope.mostrarCursosLista = [];

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
    if(!_.isUndefined($stateParams.ano) && !_.isUndefined($stateParams.semestre)){
        var cursos = CursosServices.obtenerCursosLocal();
        var index =  _.findIndex(cursos, function (item) {
            return (item.ano == $stateParams.ano && item.semestre == $stateParams.semestre);
        });
        $scope.mostrarSemestre(index);
    }
});