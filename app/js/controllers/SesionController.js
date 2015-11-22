crsApp.controller('SesionController', function($scope, $stateParams, SesionClasesService, CursosServices, ClasesServices){
    //$scope.titulo.Clase = $stateParams.clase;
    //$scope.titulo.Clase = $stateParams.modulo;
    //$scope.id_sesion = $stateParams.id_sesion;
    $scope.curso = $stateParams.curso;
    var curso = CursosServices.getCursoPorNombre($stateParams.semestre, $stateParams.curso);
    var sesion = {
        'id_sesion' : $stateParams.id_sesion
    };
    ClasesServices.obtenerClasePorIDSesion(sesion).then(function (data) {
        if(!data.error){
            $scope.clase = data.descripcion;
        }else{
            //error
        }
    });
    SesionClasesService.obtenerSesionPreguntas(sesion).then(function (data) {
        if(!data.error){
            $scope.sesion = data;
        }else{
            console.log('error al obtener sesion: '+data.err);
        }
    });
});