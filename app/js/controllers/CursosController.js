crsApp.controller('CursosController', function($scope, $filter, $stateParams, $modal) {
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

    $scope.crearCurso = function () {
        //levantar modal
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

        modalInstance.result.then(function (){

        });
    };
    //addCurso
    //eliminarCurso?
});

crsApp.controller('ModalCrearCursoController', function ($scope, $modalInstance) {

    $scope.aceptar = function () {
        $modalInstance.close();
    };
    $scope.cancelar = function () {
        $modalInstance.dismiss();
    }
});