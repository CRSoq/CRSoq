crsApp.controller('SesionController', function($scope, $rootScope, $state, $stateParams, $timeout, SessionServices, CursosServices, ClasesServices, PreguntasServices, SocketServices){
    $scope.curso = $stateParams.curso;
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

        $state.transitionTo('crsApp.cursosSemestre.clases.sesion.pregunta',{semestre:$stateParams.semestre,curso:$stateParams.curso,id_clase:$stateParams.id_clase,id_pregunta:pregunta.id_pregunta});
        var data = {
            'pregunta'  : pregunta,
            'sala'      : $stateParams.semestre+$stateParams.curso+$stateParams.id_clase
        };
        SocketServices.emit('RealizarPregunta', data);
    };
    //boton editar ganador
    $scope.editarGanadorPregunta = function (pregunta) {

    };
    //boton finalizar sesion
    $scope.finalizarSesion = function () {
        //emit fin de sesion
        //  cambiar estado en el front
        //cambiar estado en la bd
        //mover de la ruta
    };
    //boton proyectar sesion
    $scope.proyectarSesion = function () {

    };
});
