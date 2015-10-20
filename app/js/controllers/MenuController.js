crsApp.controller('MenuController', function($scope, $filter){
    $scope.menu = [
        {
            "nombre" : "2015 II",
            "cursos" : [
                {
                    "nombre" : "Programación II"
                },
                {
                    "nombre" : "I. Negocios"
                }
            ]
        },
        {
            "nombre" : "2015 I",
            "cursos" : [
                {
                    "nombre" : "Calculo II"
                },
                {
                    "nombre" : "Algebra II"
                }
            ]
        },
        {
            "nombre" : "2014 II",
            "cursos" : [
                {
                    "nombre" : "Programacion I"
                },
                {
                    "nombre" : "Base de Datos"
                }
            ]
        },
        {
            "nombre" : "2014 I",
            "cursos" : [
                {
                    "nombre" : "Cálculo I"
                },
                {
                    "nombre" : "Algebra I"
                }
            ]
        }
    ];
    $scope.mostrarSemestreLista = [];
    $scope.mostrarSemestre = function (variable){
        var item = {
            id: variable
        };
        var found = $filter('filter')($scope.mostrarSemestreLista,  {id:variable}, true)[0];
        if(!angular.isUndefined(found)){
            $scope.mostrarSemestreLista.splice($scope.mostrarSemestreLista.indexOf(found), 1);
        }else{
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
            $scope.mostrarCursosLista.push(item);
        }
    };
    $scope.buscarCurso = function (padre, indice){
        var found = $filter('filter')($scope.mostrarCursosLista, {parent:padre,id:indice});
        return found.length>0;
    };
    $scope.getClass = function(semestre, curso){
        console.log("clases de.."+curso+" para el semestre "+semestre);
    }
});