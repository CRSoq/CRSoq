crsApp.controller('ClasesController', function($scope, $rootScope, $modal, $stateParams, $filter, ClasesServices, ModulosServices, CursosServices){
    $scope.titulo = $stateParams.curso;
    $scope.listaClases = [];

    var curso = CursosServices.getCursoPorNombre($stateParams.semestre, $stateParams.curso);
    ModulosServices.obtenerModulos(curso).then(function (data) {
        $scope.listaModulos= _.cloneDeep(data);
        $scope.listaModulos= _.map(_.sortByOrder($scope.listaModulos,['posicion'],['asc']));
        ClasesServices.obtenerClases($scope.listaModulos).then(function (data) {
            $scope.listaClases = _.cloneDeep(data);
            _.forEach($scope.listaClases, function(n){
                var posModulo = _.findIndex($scope.listaModulos,{'id_modulo': n.id_modulo});
                n.modulo = $scope.listaModulos[posModulo].nombre_modulo;
            });
        });
    });

    $scope.agregarClase = function () {
        var clase = {
            'fecha': new Date(),
            'descripcion': null,
            'id_modulo':null,
            'modulo': null,
            'edicion':true,
            'nuevo': true
        };
        $scope.listaClases.push(clase);
    };
    //
    $scope.editarClase = function (clase) {
        if(_.isNull(clase.fecha)){
            clase.fecha = new Date();
        }else{
            clase.fecha = new Date(clase.fecha);
        }
        clase.edicion=true;
    };
    $scope.guardarClase = function (clase) {
        if(clase.modulo!=null) {
            if(_.isUndefined(clase.nuevo)){
                var posicionClase = _.findIndex($scope.listaClases, {'id_clase': clase.id_clase});
                var posModulo = _.findIndex($scope.listaModulos,{'nombre_modulo':clase.modulo});
                $scope.listaClases[posicionClase].id_modulo = $scope.listaModulos[posModulo].id_modulo;
                ClasesServices.actualizarClase($scope.listaClases[posicionClase]).then(function (data) {
                    if(data.error){
                        //console.log(data.error);
                    }else{
                        $scope.listaClases[posicionClase].edicion = false;
                    }
                });
            }else{
                var posicionClase = _.findIndex($scope.listaClases, {'$$hashKey': clase.$$hashKey});
                delete $scope.listaClases[posicionClase]['nuevo'];
                var posModulo = _.findIndex($scope.listaModulos,{'nombre_modulo':clase.modulo});
                $scope.listaClases[posicionClase].id_modulo = $scope.listaModulos[posModulo].id_modulo;
                ClasesServices.crearClase($scope.listaClases[posicionClase]).then(function (data) {
                    if(data.error){
                        //console.log(data.error);
                    }else{
                        $scope.listaClases[posicionClase].edicion = false;
                        $scope.listaClases[posicionClase].id_clase = data.id_clase;
                    }
                });
            }
        }else{
            console.log('debe seleccionar un modulo para guardar la clase.');
        }
    };
    $scope.cancelarClase = function (clase) {

        if(clase.modulo == null){
            $scope.listaClases.splice(_.findIndex($scope.listaClases,{'id_clase':clase.id_clase}), 1);
        }else{
            if(!_.isUndefined(clase.nuevo)){
                //no se guardaran los cambios
                $scope.listaClases.splice(_.findIndex($scope.listaClases,{'id_clase':clase.id_clase}), 1);
            }else{
                //no se guardaran los cambios
                clase.edicion = false;
            }
        }
    };
    $scope.eliminarClase = function (clase) {
        var modalEliminarClaseInstance = $modal.open({
            animation: true,
            templateUrl: '/partials/content/clases/modalEliminarClase.html',
            controller: 'ModalEliminarClaseController',
            backdrop: 'static',
            size: 'sm',
            resolve: {
                titulo: function () {
                    return "esta seguro de eliminar la siguiente clase?";
                },
                clase: function(){
                    return clase;
                }
            }
        });

        modalEliminarClaseInstance.result.then(function (clase) {
            ClasesServices.eliminarClase(clase).then(function (data) {
                if(data.error){
                    //console.log("error");
                }else{
                    $scope.listaClases.splice(_.findIndex($scope.listaClases,{'id_clase':clase.id_clase}), 1);
                }
            });
        });

    };
    $scope.iniciarSesion = function (clase) {
        console.log('nueva sesion para: '+clase.id_clase);
    };
});

crsApp.controller('ModalEliminarClaseController',function($scope, $modalInstance, titulo,clase){
    $scope.modalTitulo=titulo;
    $scope.cerrarModal = function(){
        $modalInstance.dismiss();
    };
    $scope.aceptarModal = function(){
        $modalInstance.close(clase);
    };
});