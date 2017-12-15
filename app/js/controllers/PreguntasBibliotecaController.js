'use strict';
crsApp.controller('PreguntasBibliotecaController', function ($scope, $mdDialog, $stateParams, toastr, PreguntasBibliotecaServices, CursosServices, ClasesServices, ModulosServices) {
    var asignaturas = CursosServices.obtenerCursosLocal();
   $scope.asignatura = _.findWhere(asignaturas,{'asignatura':$stateParams.nombre_asignatura});

    $scope._ = _;
    $scope.promesas = [];
    $scope.bibliotecaDePreguntas = [];

    var promesaPreguntasAsignatura = PreguntasBibliotecaServices.obtenerBibliotecaDePreguntas2($scope.asignatura).then(
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
    $scope.nuevaPregunta = function () {
        $mdDialog
            .show({
                templateUrl: 'partials/content/asignatura/modalAgregarPregunta.html',
                controller: 'modalAgregarPreguntaController',
                locals:{
                    titulo: 'Pregunta biblioteca',
                    pregunta: null,
                    bibliotecaDePreguntas: $scope.bibliotecaDePreguntas
                }
            })
            .then(
            function (pregunta) {
               // pregunta.id_topico = $scope.topico.id_topico
                PreguntasBibliotecaServices.crearPreguntaBibliotecaDePreguntas($scope.asignatura, pregunta).then(function (response) {
           	    if (response.success) {
                   	pregunta.id_b_pregunta = response.result;
			$scope.bibliotecaDePreguntas.push(pregunta);
                    	toastr.success('Pregunta creada correctamente.');
                    	pregunta.edicion = false;
               	    } else {
                    	toastr.error('No se pudo crear la pregunta.'+response.err.code,'Error');
		    }
                });
            });
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
    };
});
crsApp.controller('modalAgregarPreguntaController', function($scope, toastr, $mdDialog, pregunta, titulo, bibliotecaDePreguntas) {
    $scope.titulo=titulo;
    var listaPreg = _.cloneDeep(bibliotecaDePreguntas);
    if(_.isNull(pregunta)){
        $scope.pregunta = {};
    }else{
        $scope.pregunta = _.clone(pregunta);
    }
    $scope.aceptar = function () {
        if(!_.isUndefined(!_.isUndefined($scope.pregunta.b_pregunta))) {
            var index = _.findIndex(bibliotecaDePreguntas, function (pregunta) {
                if(pregunta.id_pregunta != $scope.pregunta.id_pregunta) {
                   return true;
                }
            });
            if(index<0){
                $mdDialog.hide($scope.pregunta);
            }else{
                toastr.error('Ya existe esta pregunta','Error');
            }
        }else{
                toastr.error('Debe ingresar todos los datos.','Error');
        }
    };
    $scope.cancelar = function () {
        $mdDialog.cancel();
    }
});
