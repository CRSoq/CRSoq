'use strict';
crsApp.controller('ActividadesController', function ($scope, $stateParams, $timeout, ActividadesServices, CursosServices ) {
    var asignaturas = CursosServices.obtenerCursosLocal();
    var asignatura = _.findWhere(asignaturas,{'asignatura':$stateParams.nombre_asignatura});
    $scope.curso = _.findWhere(asignatura.cursos, {'id_curso':Number($stateParams.id_curso)});

    $scope._ = _;
    $scope.promesas = [];
    $scope.actividadesDelcurso = [];

    var promesaActividades = ActividadesServices.obtenerActividadesCurso($scope.curso).then(function (response) {
        if(!response.error){
            $scope.actividadesDelcurso = _.cloneDeep(response);
        }else{
            //alerta('danger','Error. "'+data.error.err.code+'"');
        }
    });
    $scope.promesas.push(promesaActividades);

});
