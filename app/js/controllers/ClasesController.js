crsApp.controller('ClasesController', function($scope, $rootScope, $timeout, $modal, $state, $stateParams, ClasesServices, ModulosServices, CursosServices, SesionClasesService){
    $scope.titulo = $stateParams.curso;
    $scope.listaClases = [];
    $scope.alerts = [];
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
            'descripcion': '',
            'id_modulo':null,
            'estado_sesion':'creada',
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
            var posModulo = _.findIndex($scope.listaModulos,{'nombre_modulo':clase.modulo});
            if(_.isUndefined(clase.nuevo)){
                clase.id_modulo = $scope.listaModulos[posModulo].id_modulo;
                ClasesServices.actualizarClase(clase).then(function (data) {
                    if(data.error){
                        var id_alert = $scope.alerts.length+1;
                        $scope.alerts.push({id: id_alert,type:'danger', msg:'Error al actualizar cambios: "'+data.error.err.code+'"'});
                        closeAlertTime(id_alert);
                    }else{
                        clase.edicion = false;
                    }
                });
            }else{
                delete clase['nuevo'];
                clase.id_modulo = $scope.listaModulos[posModulo].id_modulo;
                ClasesServices.crearClase(clase).then(function (data) {
                    if(data.error){
                        var id_alert = $scope.alerts.length+1;
                        $scope.alerts.push({id: id_alert,type:'danger', msg:'Error al crear clase: "'+data.error.err.code+'"'});
                        closeAlertTime(id_alert);
                    }else{
                        clase.edicion = false;
                        clase.id_clase = data.id_clase;
                    }
                });
            }
        }else{
            var id_alert = $scope.alerts.length+1;
            $scope.alerts.push({id: id_alert,type:'danger', msg:'Debe seleccionar un módulo.'});
            closeAlertTime(id_alert);
        }
    };
    $scope.cancelarClase = function (clase, index) {
        if(clase.modulo == null){
            $scope.listaClases.splice(index, 1);
        }else{
            if(!_.isUndefined(clase.nuevo)){
                $scope.listaClases.splice(index, 1);
            }else{
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
            size: 'md',
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
                    var id_alert = $scope.alerts.length+1;
                    $scope.alerts.push({id: id_alert,type:'danger', msg:'Error al eliminar clase: "'+data.error.err.code+'"'});
                    closeAlertTime(id_alert);
                }else{
                    var id_alert = $scope.alerts.length+1;
                    $scope.alerts.push({id: id_alert,type:'success', msg:'Clase eliminada.'});
                    closeAlertTime(id_alert);
                    $scope.listaClases.splice(_.findIndex($scope.listaClases,{'id_clase':clase.id_clase}), 1);
                }
            });
        });

    };
    $scope.iniciarSesion = function (clase) {
        SesionClasesService.obtenerSesion(clase).then(function (data) {
            $state.transitionTo("crsApp.cursosSemestre.clases.sesion",{semestre:$stateParams.semestre,curso:$stateParams.curso,id_sesion:data[0].id_sesion});
        });
    };
    $scope.closeAlert = function(index) {
        $scope.alerts.splice(index, 1);
    };
    var closeAlertTime = function(id_alert) {
        $timeout(function(){
            $scope.alerts.splice(_.findIndex($scope.alerts,{id:id_alert}), 1);
        }, 3000);
    };
});

crsApp.controller('ModalEliminarClaseController',function($scope, $modalInstance, titulo,clase){
    $scope.modalTitulo=titulo;
    $scope.fechaClase = clase.fecha;
    $scope.descripcionClase = clase.descripcion;
    $scope.moduloClase = clase.modulo;
    $scope.estado_sesion = clase.estado_sesion;
    $scope.cerrarModal = function(){
        $modalInstance.dismiss();
    };
    $scope.aceptarModal = function(){
         $modalInstance.close(clase);
    };
});