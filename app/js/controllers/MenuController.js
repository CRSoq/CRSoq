crsApp.controller('MenuController', function($scope, $rootScope, $filter, $localStorage,CursosServices,SessionServices){

    CursosServices.obtenerCursos(SessionServices.getSessionData()).then(function (data) {
        if(data.error){
            //error
        }else{
            $scope.menu=data;
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
});