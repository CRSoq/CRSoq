crsApp.controller('MenuController', function($scope, $filter, $localStorage,CursosServices,SessionServices){
    $scope.listaCursos = [];
    CursosServices.obtenerCursos(SessionServices.getSessionData()).then(function (data) {
        //$scope.listaCursos=data;
        $scope.menu=data;
    });

    $scope.mostrarSemestreLista = [];
    $scope.mostrarSemestre = function (variable){
        var item = {
            id: variable
        };
        var found = $filter('filter')($scope.mostrarSemestreLista,  {id:variable}, true)[0];
        if(!angular.isUndefined(found)){
            $scope.mostrarSemestreLista.splice($scope.mostrarSemestreLista.indexOf(found), 1);
        }else{
            //splice para borrar el que habia antes de agregar el nuevo
            $scope.mostrarSemestreLista.splice(0, 1);
            $scope.mostrarSemestreLista.push(item);
        }
    };
    $scope.buscarSemestre = function (indice){
        var found = $filter('filter')($scope.mostrarSemestreLista, {id:indice});
        return found.length>0;
    };
    $scope.mostrarCursosLista = [];
    $scope.mostrarCurso = function (padre,indice){
        var item = {
            parent : padre,
            id     : indice
        };
        var found = $filter('filter')($scope.mostrarCursosLista,  {parent:padre,id:indice}, true)[0];
        if(!angular.isUndefined(found)){
            $scope.mostrarCursosLista.splice($scope.mostrarCursosLista.indexOf(found), 1);
        }else{
            //splice para borrar el que habia antes de agregar el nuevo
            $scope.mostrarCursosLista.splice(0, 1);
            $scope.mostrarCursosLista.push(item);
        }
    };
    $scope.buscarCurso = function (padre, indice){
        var found = $filter('filter')($scope.mostrarCursosLista, {parent:padre,id:indice});
        return found.length>0;
    };
    $scope.getClass = function(semestre, curso){
        console.log("clases de.."+curso+" para el semestre "+semestre);
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
});