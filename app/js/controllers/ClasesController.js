crsApp.controller('ClasesController', function($scope, $rootScope, $timeout, $uibModal, $state, $stateParams, ClasesServices, ModulosServices, CursosServices, SocketServices){
    $scope.titulo = $stateParams.curso;
    $scope.listaClases = [];
    $scope.alerts = [];
    /*
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
    */
    //$scope.listaClases
    var curso = CursosServices.getCursoPorNombre($stateParams.semestre, $stateParams.curso);
    ModulosServices.obtenerModulos(curso).then(function (data) {
        $scope.listaModulos= _.cloneDeep(data);
        $scope.listaModulos= _.map(_.sortByOrder($scope.listaModulos,['posicion'],['asc']));
        ClasesServices.obtenerClases($scope.listaModulos).then(function (data) {
            var lista = _.cloneDeep(data);

            if(lista.length>1){
                _.forEach(lista, function(n){
                    var clasesModulo = _.cloneDeep(n);
                    _.forEach(clasesModulo, function(clase){
                        var posModulo = _.findIndex($scope.listaModulos,{'id_modulo': clase.id_modulo});
                        clase.modulo = $scope.listaModulos[posModulo].nombre_modulo;
                    });
                    var i = 0;
                    while(i<clasesModulo.length){
                        $scope.listaClases.push(clasesModulo[i]);
                        i++;
                    }
                });
            }else{
                _.forEach(lista, function(clase){
                    var posModulo = _.findIndex($scope.listaModulos,{'id_modulo': clase.id_modulo});
                    clase.modulo = $scope.listaModulos[posModulo].nombre_modulo;
                });
                var i = 0;
                while(i<lista.length){
                    $scope.listaClases.push(lista[i]);
                    i++;
                }
            }

        });
    });

    $scope.agregarClase = function () {
        var clase = {
            'fecha': new Date(),
            'descripcion': '',
            'id_modulo':null,
            'estado_sesion':'noIniciada',
            'modulo': null,
            'edicion':true,
            'nuevo': true
        };
        $scope.listaClases.push(clase);
    };

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
                        newAlert('danger', 'Error al actualizar cambios: "'+data.error.err.code+'"');
                    }else{
                        clase.edicion = false;
                    }
                });
            }else{
                delete clase['nuevo'];
                clase.id_modulo = $scope.listaModulos[posModulo].id_modulo;
                ClasesServices.crearClase(clase).then(function (data) {
                    if(data.error){
                        newAlert('danger', 'Error al crear clase: "'+data.error.err.code+'"');
                    }else{
                        clase.edicion = false;
                        clase.id_clase = data.id_clase;
                    }
                });
            }
        }else{
            newAlert('danger', 'Debe seleccionar un módulo.');
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
        var modalEliminarClaseInstance = $uibModal.open({
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
                    newAlert('danger', 'Error al eliminar clase: "'+data.error.err.code+'"');
                }else{
                    newAlert('success', 'Clase eliminada.');
                    $scope.listaClases.splice(_.findIndex($scope.listaClases,{'id_clase':clase.id_clase}), 1);
                }
            });
        });

    };
    $scope.iniciarSesion = function (clase) {
        var infoSesion = {
            semestre: $stateParams.semestre,
            curso: $stateParams.curso,
            id_clase: clase.id_clase,
            nombreSala: $stateParams.semestre+$stateParams.curso+clase.id_clase
        };
        if(clase.estado_sesion=='noIniciada'){
            //iniciar y cambiar estado a iniciado
            clase.estado_sesion = 'iniciada';
            ClasesServices.actualizarSesionClase(clase).then(function (data) {
                if(data.error){
                    newAlert('danger', 'Error al inciar sesión '+data.err.code);
                }else{
                    SocketServices.emit('iniciarSesion',infoSesion);
                    $state.transitionTo('crsApp.cursosSemestre.clases.sesion', {semestre:$stateParams.semestre,curso:$stateParams.curso,id_clase:clase.id_clase});
                }
            });
        }else if(clase.estado_sesion=='iniciada'){
            $state.transitionTo('crsApp.cursosSemestre.clases.sesion', {semestre:$stateParams.semestre,curso:$stateParams.curso,id_clase:clase.id_clase});
            SocketServices.emit('IngresarASala',infoSesion);
        }else if(clase.estado_sesion=='cerrada'){
            //avisar que la sesion esta cerrada
            //preguntar si se desea abrir la sesion nuevamente
        }else{
            //error al iniciar la sesion u obtenerla
        }
    };
    $scope.closeAlert = function(index) {
        $scope.alerts.splice(index, 1);
    };
    var closeAlertTime = function(id_alert) {
        $timeout(function(){
            $scope.alerts.splice(_.findIndex($scope.alerts,{id:id_alert}), 1);
        }, 3000);
    };

    var newAlert = function (type, msg) {
        var id_alert = $scope.alerts.length+1;
        $scope.alerts.push({id: id_alert,type:type, msg:msg});
        closeAlertTime(id_alert);
    };

    $rootScope.$on('activarSesion', function (event, data) {
        var clase = _.findWhere($scope.listaClases, {'id_clase':data});
        if(!_.isUndefined(clase)){
            clase.estado_sesion = 'iniciada';
        }
    });
    $scope.ingresarSesion = function (clase) {
        var data ={
            nombreSala: $stateParams.semestre+$stateParams.curso+clase.id_clase
        };
        SocketServices.emit('IngresarASala', data);
        $state.transitionTo('crsApp.cursosSemestre.clases.sesion', {semestre:$stateParams.semestre,curso:$stateParams.curso,id_clase:clase.id_clase});
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