'use strict';
crsApp.controller('PreguntasBibliotecaController', function ($scope, $stateParams, toastr, PreguntasBibliotecaServices, CursosServices, ClasesServices, ModulosServices) {
    var asignaturas = CursosServices.obtenerCursosLocal();
   $scope.asignatura = _.findWhere(asignaturas,{'asignatura':$stateParams.nombre_asignatura});

    $scope._ = _;
    $scope.promesas = [];
    $scope.bibliotecaDePreguntas = [];

    var promesaPreguntasAsignatura = PreguntasBibliotecaServices.obtenerBibliotecaDePreguntas($scope.asignatura).then(
        function (response) {
            if (response.success) {
                $scope.bibliotecaDePreguntas = _.cloneDeep(response.result);
            } else {
                toastr.error('No se pudo obtener biblioteca de preguntas: '+response.err.code,'Error');
            }
        });
    $scope.promesas.push(promesaPreguntasAsignatura);

    $scope.crearPregunta = function () {
        var pregunta = {
            id_asignatura : $scope.asignatura.id_asignatura,
            b_pregunta : '',
            edicion: true
        };
        $scope.bibliotecaDePreguntas.push(pregunta);
    };
    $scope.guardarPregunta = function (pregunta) {
        PreguntasBibliotecaServices.crearPreguntaBibliotecaDePreguntas($scope.asignatura, pregunta).then(
            function (response) {
                if (response.success) {
                    pregunta.id_b_pregunta = response.result;
                    toastr.success('Pregunta creada correctamente.');
                    pregunta.edicion = false;
                } else {
                    toastr.error('No se pudo crear la pregunta.'+response.err.code,'Error');

                }
            });
    }
});
