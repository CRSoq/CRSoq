crsApp.controller('CursosController', function($scope, $filter, $stateParams) {
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


    var found = $filter('filter')($scope.menu,  {'nombre':$stateParams.semestre}, true)[0];
    if(!angular.isUndefined(found)) {
        $scope.semestre = found;
    }

});