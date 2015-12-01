crsApp.controller('SesionController', function($scope, $stateParams, SesionClasesService, CursosServices, ClasesServices, PreguntasServices){
    $scope.curso = $stateParams.curso;
    //$scope.id_sesion = $stateParams.id_sesion;
    /*
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
    */
    //obtener preguntas de la clase
    $scope.listaPreguntasClase=[];
    PreguntasServices.obtenerPreguntasClase({'id_clase':$stateParams.id_clase}).then(function (data) {
        if(data.error){
            console.log(data.err.code);
        }else{
            $scope.listaPreguntasClase= _.cloneDeep(data);
        }
    });
    //boton añadir pregunta de la biblioteca
    //boton crear pregunta (agregar automaticamente a la clase y al módulo)
    //boton eliminar pregunta?
    //boton lanzar pregunta
    //boton finalizar sesion
    //
});