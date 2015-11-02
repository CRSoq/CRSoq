crsApp.controller('CursosController', function($scope, $filter, $stateParams, $modal, CursosServies, SessionService) {
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
    $scope.cursos = [
        {'id_curso' : '1', 'id_user': '1', 'nombre_curso': 'bd', 'semestre':'I', 'ano': '2015'},
        {'id_curso' : '3', 'id_user': '1', 'nombre_curso': 'bd1', 'semestre':'II', 'ano': '2015'},
        {'id_curso' : '2', 'id_user': '1', 'nombre_curso': 'bd2', 'semestre':'I', 'ano': '2015'},
        {'id_curso' : '8', 'id_user': '1', 'nombre_curso': 'bd3', 'semestre':'II', 'ano': '2014'},
        {'id_curso' : '7', 'id_user': '1', 'nombre_curso': 'bd4', 'semestre':'I', 'ano': '2014'},
        {'id_curso' : '6', 'id_user': '1', 'nombre_curso': 'bd5', 'semestre':'I', 'ano': '2013'},
        {'id_curso' : '4', 'id_user': '1', 'nombre_curso': 'bd6', 'semestre':'II', 'ano': '2012'}
    ];
    $scope.test = [];


    //CursosServies.obtenerCursos(SessionService.getSessionData()).then(function(data){
    //    console.log(data);
    //});
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

        modalInstance.result.then(function (curso){
            CursosServies.crearCurso(curso).then(function (data) {
                console.log(data);
            });
        });
    };
    //eliminarCurso?
});

crsApp.controller('ModalCrearCursoController', function ($scope, $modalInstance, SessionService) {
    $scope.aceptar = function () {
        var dataUsuario = SessionService.getSessionData();
        var curso = {
            nombre      : $scope.nombre,
            ano         : $scope.ano,
            semestre    : $scope.semestre,
            id_user : dataUsuario.id_user
        };
        $modalInstance.close(curso);
    };
    $scope.cancelar = function () {
        $modalInstance.dismiss();
    }
});