'use strict';
crsApp.controller('PreguntasBibliotecaController', function ($scope, $stateParams, $timeout, PreguntasBibliotecaServices, CursosServices, ClasesServices, ModulosServices) {
    var asignaturas = CursosServices.obtenerCursosLocal();
   $scope.asignatura = _.findWhere(asignaturas,{'asignatura':$stateParams.nombre_asignatura});

    $scope._ = _;
    $scope.promesas = [];
    $scope.bibliotecaDePreguntas = [];

    var promesaPreguntasAsignatura = PreguntasBibliotecaServices.obtenerBibliotecaDePreguntas($scope.asignatura).then(function (response) {
        if(!response.error){
            $scope.bibliotecaDePreguntas = _.cloneDeep(response);
        }else{
            //alerta('danger','Error. "'+data.error.err.code+'"');
        }
    });
    $scope.promesas.push(promesaPreguntasAsignatura);

});
