crsApp.controller('SesionController', function($scope, $state, $stateParams, SesionClasesService, CursosServices, ClasesServices, PreguntasServices){
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
    $scope.pregunta = null;
    $scope.listaPreguntasClase=[];
    PreguntasServices.obtenerPreguntasClase({'id_clase':$stateParams.id_clase}).then(function (data) {
        if(data.error){
            console.log(data.err.code);
        }else{
            $scope.listaPreguntasClase= _.cloneDeep(data);
        }
    });
    //boton añadir pregunta de la biblioteca
    $scope.agregarPregunta = function (pregunta) {

    };
    //boton crear pregunta (agregar automaticamente a la clase y al módulo)
    $scope.crearPregunta = function (pregunta) {

    };
    //boton eliminar pregunta?
    $scope.eliminarPregunta = function (pregunta) {

    };
    //boton lanzar pregunta
    $scope.lanzarPregunta = function (pregunta) {
        $scope.pregunta = pregunta.pregunta;
        $state.transitionTo('crsApp.cursosSemestre.clases.sesion.pregunta',{semestre:$stateParams.semestre,curso:$stateParams.curso,id_clase:$stateParams.id_clase,id_pregunta:pregunta.id_pregunta});
    };
    //boton editar ganador
    $scope.editarGanadorPregunta = function (pregunta) {

    };
    //boton finalizar sesion
    $scope.finalizarSesion = function () {

    };
    //boton proyectar sesion
    $scope.proyectarSesion = function () {

    };
});