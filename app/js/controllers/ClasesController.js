crsApp.controller('ClasesController', function($scope, $rootScope, $mdDialog, $filter, $timeout, $state, $stateParams, toastr, ClasesServices, ModulosServices, CursosServices, SessionServices, SocketServices){
    $scope.listaClases = [];
    $scope.promesas = [];


    if($rootScope.user.tipo=='profesor'){
        var asignaturas = CursosServices.obtenerCursosLocal();
        var asignatura = _.findWhere(asignaturas,{'asignatura':$stateParams.nombre_asignatura});
        var curso = _.findWhere(asignatura.cursos, {'id_curso':Number($stateParams.id_curso)});
    }else if($rootScope.user.tipo='estudiante'){
        var semestres = CursosServices.obtenerCursosLocal();
        var semestre = _.findWhere(semestres,{'ano':Number($stateParams.ano),'semestre':Number($stateParams.semestre)});
        var curso = _.findWhere(semestre.cursos, {'id_curso': Number($stateParams.id_curso)});
    }
    $scope.curso = _.cloneDeep(curso);
    $scope.selected = [];
    var callbackClases = function (response) {
        var lista = _.cloneDeep(response.result);
        if(lista.length>0){
            _.forEach(lista, function (item) {
                if(_.isArray(item)){
                    _.forEach(item, function (elemento) {
                        elemento.fecha = new Date(elemento.fecha);
                        elemento.modulo = _.findWhere($scope.listaModulos,{'id_modulo': elemento.id_modulo}).nombre_modulo;
                        $scope.listaClases.push(elemento);
                    });
                }else{
                    item.fecha = new Date(item.fecha);
                    item.modulo = _.findWhere($scope.listaModulos,{'id_modulo': item.id_modulo}).nombre_modulo;
                    $scope.listaClases.push(item);
                }
            });
        }
    };

    var callbackClasesError = function (error) {
        toastr.error(error.err.code,'Error clases');
    };

    var callbackModulos = function (response) {
        $scope.listaModulos= _.cloneDeep(response.result);
        $scope.listaModulos= _.map(_.sortByOrder($scope.listaModulos,['posicion'],['asc']));

        if($scope.listaModulos.length>0){
            $scope.promesas = ClasesServices.obtenerClases($scope.listaModulos)
                .then(callbackClases, callbackClasesError);
        }

    };

    var callBackModulosError = function (error) {
        toastr.error(error.err.code,'Error módulos');
    };

    $scope.promesas = ModulosServices.obtenerModulos(curso)
        .then(callbackModulos, callBackModulosError);



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
        if(!_.isNull(clase.modulo)) {
            clase.id_modulo = _.findWhere($scope.listaModulos,{'nombre_modulo':clase.modulo}).id_modulo;
            if(_.isUndefined(clase.nuevo)){
                $scope.promesas = ClasesServices.actualizarClase(clase).then(function () {
                    clase.edicion = false;
                }, function (error) {
                    toastr.error(error.err.code,'Error al actualizar clase');
                });
            }else{
                delete clase['nuevo'];
                $scope.promesas = ClasesServices.crearClase(clase).then(function (response) {
                        clase.edicion = false;
                        clase.id_clase = response.id_clase;
                }, function (error) {
                    toastr.error(error.err.code,'Error al crear clase');
                });
            }
        }else{
            toastr.warning('Debe seleccionar un módulo para la clase.','Advertencia');
        }
    };

    $scope.cancelarClase = function (clase, index) {
        if(_.isNull(clase.modulo)){
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
        $mdDialog.show({
            templateUrl: '/partials/content/asignatura/curso/clases/modalEliminarClase.html',
            locals : {
                fecha: clase.fecha,
                modulo: clase.modulo,
                descripcion: clase.descripcion,
                estado_sesion: clase.estado_sesion
            },
            controller: 'ModalEliminarClaseController'
            })
            .then(
            function () {
                ClasesServices.eliminarClase(clase).then(
                    function (response) {
                        toastr.success('Clase eliminada.');
                        $scope.listaClases.splice(_.findIndex($scope.listaClases,{'id_clase':clase.id_clase}), 1);
                    },
                    function (error) {
                        toastr.error(error.err.code,'Error al eliminar clase.');
                    }
                );
            },function () {
            });
    };

    $scope.iniciarSesion = function (clase) {
        var infoSesion = {
            ano: Number($stateParams.ano),
            semestre: Number($stateParams.semestre),
            curso: $stateParams.nombre_asignatura,
            id_clase: clase.id_clase,
            id_curso: Number($stateParams.id_curso),
            sala: $stateParams.ano+$stateParams.semestre+$stateParams.nombre_asignatura+clase.id_clase
        };
        //iniciar y cambiar estado a iniciado
        if(clase.estado_sesion=='noIniciada'){

            clase.estado_sesion = 'iniciada';
            ClasesServices.actualizarSesionClase(clase).then(function (response) {
                SocketServices.emit('iniciarSesion',infoSesion);
                $state.transitionTo('crsApp.asignatura.curso.clases.sesion', {nombre_asignatura:curso.nombre_curso,ano:curso.ano,semestre:curso.semestre,id_curso:curso.id_curso,id_clase:clase.id_clase});
            }, function (error) {
                toastr.error('Motivo: '+error.err.code,'Error al iniciar sesión.');
            });

        }else if(clase.estado_sesion=='iniciada'){

            $state.transitionTo('crsApp.asignatura.curso.clases.sesion', {nombre_asignatura:curso.nombre_curso,ano:curso.ano,semestre:curso.semestre,id_curso:curso.id_curso,id_clase:clase.id_clase});
            SocketServices.emit('IngresarASala',infoSesion);

        }else if(clase.estado_sesion=='cerrada'){

            $mdDialog
                .show({

                })
                .then(
                    function () {

                    },function () {
                    //error
                });

            /*
            var modalAbrirSesionCerrada = $uibModal.open({
                animation: true,
                templateUrl: '/partials/content/clases/_sesioncerradaPartial.html',
                controller: 'ModalAbrirSesionCerradaController',
                backdrop: 'static',
                size: 'md',
                resolve: {
                    titulo: function () {
                        return "Sesión de preguntas cerrada";
                    },
                    clase: function(){
                        return clase;
                    }
                }
            });

            modalAbrirSesionCerrada.result.then(function () {

            });
            */
             //modal
            //preguntar si se desea abrir la sesion nuevamente
        }else{
            toastr.error('Error al iniciar sesión.');
        }
    };

    $rootScope.$on('activarSesion', function (event, data) {
        var clase = _.findWhere($scope.listaClases, {'id_clase':data});
        if(!_.isUndefined(clase)){
            clase.estado_sesion = 'iniciada';
        }
    });
    $scope.ingresarSesion = function (clase) {
        var data ={
            sala: $stateParams.ano+$stateParams.semestre+$stateParams.nombre_asignatura+clase.id_clase
        };
        SocketServices.emit('IngresarASala', data);
        $state.transitionTo('crsApp.asignatura.curso.clases.sesion', {nombre_asignatura:curso.nombre_curso,ano:curso.ano,semestre:curso.semestre,id_curso:curso.id_curso,id_clase:clase.id_clase});
    };

});

crsApp.controller('ModalEliminarClaseController',function($scope, $mdDialog, ClasesServices, fecha, descripcion, modulo, estado_sesion){
    $scope.fecha=fecha;
    $scope.descripcion=descripcion;
    $scope.modulo=modulo;
    $scope.estado_sesion=estado_sesion;

    $scope.cancelar = function() {
        $mdDialog.cancel();
    };

    $scope.aceptar = function() {
        $mdDialog.hide();
    };
});


crsApp.controller('ModalAbrirSesionCerradaController',function($scope, $uibModalInstance, titulo, clase){
    $scope.modalTitulo=titulo;

    $scope.cerrarModal = function(){
        $uibModalInstance.dismiss();
    };
    $scope.aceptarModal = function(){
        $uibModalInstance.close();
    };
});