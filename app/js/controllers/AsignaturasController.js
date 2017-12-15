crsApp.controller('ConfigAsignaturasController', function ($scope, $rootScope, $state, $stateParams, $q, $mdDialog, toastr, TopicosServices) {
    var asignatura = _.findWhere(asignaturas,{'asignatura':$stateParams.nombre_asignatura});
    $scope._ = _;
    $scope.topicos = [];
    $scope.topicosEditados = [];
    $scope.cambio = false;

    var normalize = (function() {
        var from = "ÃÀÁÄÂÈÉËÊÌÍÏÎÒÓÖÔÙÚÜÛãàáäâèéëêìíïîòóöôùúüûÑñÇç",
            to   = "AAAAAEEEEIIIIOOOOUUUUaaaaaeeeeiiiioooouuuunncc",
            mapping = {};

        for(var i = 0, j = from.length; i < j; i++ )
            mapping[ from.charAt( i ) ] = to.charAt( i );

        return function( str ) {
            var ret = [];
            for( var i = 0, j = str.length; i < j; i++ ) {
                var c = str.charAt( i );
                if( mapping.hasOwnProperty( str.charAt( i ) ) )
                    ret.push( mapping[ c ] );
                else
                    ret.push( c );
            }
            return ret.join( '' );
        }

    })();

    var callbackTopicos = function (response) {
            if(response.result.length>0){
                $scope.topicos= _.cloneDeep(response.result);
                $scope.topicos= _.map(_.sortByOrder($scope.topicos,['posicion'],['asc']));
            }else {
                $scope.agregarTopico();
            }
    };

    var callBackTopicossError = function (error) {
        toastr.error(error.err.code,'Error tópicos');
    };
    AsignaturasServices.obtenerTopicos(asignatura)
        .then(callbackModulos,callBackTopicossError);

    $scope.agregarModulo = function () {
        var topico = {
            'nombre': '',
            'id_asignatura': asignatura.id_asignatura,
            'nuevo':true,
            'edicion':true
        };
        $scope.topicos.push(topico);
    };

    $scope.guardarTopico = function (modulo) {
        if (!_.isEmpty(topico.nombre)) {
            if (_.isUndefined(topico.nuevo)) {
                TopicosServices.actualizarTopico(topico).then(
                    function (response) {
                        //hacer resplandor en el topico actualizado
                        toastr.success('Tópico actualizado de manera satisfactoria.');
                        topico.edicion = false;
                        $scope.topicos = _.map(_.sortByOrder($scope.topicos, ['posicion'], ['asc']));
                    }, function (error) {
                        toastr.error('No se pudo actualizar el tópico: ' + error.err.code, 'Error');
                    }
                );
            } else {
                TopicosServices.crearTopico(topico).then(
                    function (response) {
                        topico.id_topico = response.id_topico;
                        delete topico['nuevo'];
                        topico.edicion = false;
                        toastr.success('Tópico creado de manera satisfactoria.');
                        $scope.topicos = _.map(_.sortByOrder($scope.topicos, ['posicion'], ['asc']));
                        $rootScope.$emit('actualizarControladores');
                    }, function (error) {
                        toastr.error('No se pudo crear el tópico: ' + error.err.code, 'Error');
                    }
                );
            }
        }else{
            toastr.warning('Debe ingresar el nombre del tópico.');
        }
    };
    $scope.cancelarTopico = function (modulo, indice) {
        if(_.isUndefined(topico.nuevo)){
            $scope.topicos[indice] = _.cloneDeep(_.findWhere($scope.topicosEditados, {'id_topico':topico.id_topico}));
            $scope.topicosEditados.splice(indice,1);
            $scope.topicos[indice].edicion = false;
            $scope.topicos= _.map(_.sortByOrder($scope.topicos,['posicion'],['asc']));
        }else{
            $scope.topicosEditados.splice(indice,1);
            $scope.topicos.splice(indice,1);
        }
    };
});
