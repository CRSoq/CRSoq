crsApp.controller('CursosController', function($scope, $filter, $stateParams, $modal, CursosServices, SessionServices) {
   /* CursosServies.obtenerCursos(SessionService.getSessionData()).then(function (data) {
        //$scope.listaCursos=data;
        $scope.menu=data;
        var found = $filter('filter')($scope.menu,  {'nombre':$stateParams.semestre}, true)[0];
        if(!angular.isUndefined(found)) {
            $scope.semestre = found;
        }
    });*/

    $scope.menu = CursosServices.getAllCursos();
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
            CursosServices.crearCurso(curso).then(function (data) {
                console.log(data);
            });
        });
    };
    //eliminarCurso?
});

crsApp.controller('ModalCrearCursoController', function ($scope, $modalInstance, SessionServices) {
    $scope.aceptar = function () {
        var dataUsuario = SessionServices.getSessionData();
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

crsApp.controller('CursoGralInfoController', function ($scope, $stateParams, $location, CursosServices) {
    var ano_semestre=$location.path();
    ano_semestre=ano_semestre.substring(8,ano_semestre.length);
    ano_semestre=ano_semestre.substring(0,ano_semestre.indexOf('/'));
    var algo =CursosServices.getCursoPorNombre(ano_semestre,$stateParams.curso);
    //comprueba si el curso se encuentra o no configurado
    if(!algo.isUndefined){
        $scope.estado = algo.estado;
    }

    //var pos = ;
    //console.log(algo[]);


});