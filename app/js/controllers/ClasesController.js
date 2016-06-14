crsApp.controller('ClasesController', function($scope, $rootScope, $mdDialog, $q, $state, $stateParams, toastr, ClasesServices, ModulosServices, CursosServices, SessionServices, SocketServices){
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
     var promesaModulos = ModulosServices.obtenerModulos(curso)
        .then(function (response) {
             if(response.success){
                 $scope.listaModulos= _.cloneDeep(response.result);
                 $scope.listaModulos= _.map(_.sortByOrder($scope.listaModulos,['posicion'],['asc']));

                 if($scope.listaModulos.length>0){
                     ClasesServices.obtenerClases($scope.listaModulos)
                         .then(function (response) {
                             if(response.success){
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

                             }else{
                                 toastr.error('No se pudo obtener lista de clase: '+response.err.code,'Error');
                             }
                         });
                 }
             }else{
                 toastr.error('No se pudo obtener lista de módulos: '+response.err.code,'Error');
             }
         });
    $scope.promesas.push(promesaModulos);
    //se obtienen los módulos
    $q.all(promesaModulos).then(function (response) {

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
    $scope.editarClaseMin = function (clase, index) {
        var claseLocal = clase;
        if(_.isUndefined(claseLocal)){
            claseLocal = {
                'fecha': new Date(),
                'descripcion': '',
                'id_modulo':null,
                'estado_sesion':'noIniciada',
                'modulo': null,
                'edicion':true,
                'nuevo': true
            };
        }
        $mdDialog.show({
            templateUrl: '/partials/content/asignatura/curso/clases/modalEdicionClase.html',
            locals : {
                clase: claseLocal,
                listaModulos: $scope.listaModulos
            },
            controller: 'ModalEdicionClaseController'
        })
            .then(
            function (clase) {
                if(!_.isNull(clase.modulo)) {
                    clase.id_modulo = _.findWhere($scope.listaModulos,{'nombre_modulo':clase.modulo}).id_modulo;
                    if(_.isUndefined(clase.nuevo)){
                        $scope.promesas = ClasesServices.actualizarClase(clase)
                            .then(function (response) {
                                if(response.success){
                                    clase.edicion = false;
                                    toastr.success('Clase actualizada correctamente');
                                    SocketServices.emit('actualizarListaClase', curso);
                                    $scope.listaClases[index]= _.cloneDeep(clase);
                                }else{
                                    toastr.error('No se pudo actualizar la clase: '+response.err.code,'Error');
                                }
                            });
                    }else{
                        delete clase['nuevo'];
                        $scope.promesas = ClasesServices.crearClase(clase)
                            .then(function (response) {
                                if(response.success){
                                    clase.edicion = false;
                                    clase.id_clase = response.id_clase;
                                    SocketServices.emit('actualizarListaClase', curso);
                                    toastr.success('Clase creada correctamente');
                                    $scope.listaClases.push(clase);
                                }else{
                                    toastr.error('No se pudo crear la clase: '+response.err.code,'Error');
                                }
                            });
                    }
                }else{
                    toastr.error('Debe seleccionar un módulo para la clase.','Error');
                }
            });
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
                $scope.promesas = ClasesServices.actualizarClase(clase)
                    .then(function (response) {
                        if(response.success){
                            clase.edicion = false;
                            toastr.success('Clase actualizada correctamente');
                            SocketServices.emit('actualizarListaClase', curso);
                        }else{
                            toastr.error('No se pudo actualizar la clase: '+response.err.code,'Error');
                        }
                    });
            }else{
                delete clase['nuevo'];
                $scope.promesas = ClasesServices.crearClase(clase)
                    .then(function (response) {
                        if(response.success){
                            clase.edicion = false;
                            clase.id_clase = response.id_clase;
                            SocketServices.emit('actualizarListaClase', curso);
                            toastr.success('Clase creada correctamente');
                        }else{
                            toastr.error('No se pudo crear la clase: '+response.err.code,'Error');
                        }
                    });
            }
        }else{
            toastr.error('Debe seleccionar un módulo para la clase.','Error');
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
                        if(response.success){
                            toastr.success('Clase eliminada.');
                            SocketServices.emit('actualizarListaClase', curso);
                            $scope.listaClases.splice(_.findIndex($scope.listaClases,{'id_clase':clase.id_clase}), 1);
                        }else{
                            toastr.error('No se pudo eliminar la clase: '+response.err.code,'Error.');
                        }
                    }
                );
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
                if(response.success){
                    SocketServices.emit('iniciarSesion',infoSesion);
                    $state.transitionTo('crsApp.asignatura.curso.clases.sesion', {
                        nombre_asignatura:curso.nombre_curso,
                        ano:curso.ano,
                        semestre:curso.semestre,
                        id_curso:curso.id_curso,
                        id_clase:clase.id_clase});
                }else{
                    toastr.error('No se pudo iniciar sesión: '+response.err.code,'Error');
                }
            });

        }else if(clase.estado_sesion=='iniciada'){
            $state.transitionTo('crsApp.asignatura.curso.clases.sesion', {
                nombre_asignatura:curso.nombre_curso,
                ano:curso.ano,semestre:curso.semestre,
                id_curso:curso.id_curso,
                id_clase:clase.id_clase});
            SocketServices.emit('ContinuarSesion',infoSesion);

        }else if(clase.estado_sesion=='cerrada'){
            $mdDialog.show({
                templateUrl: '/partials/content/asignatura/curso/clases/modalSesionCerrada.html',
                controller: 'modalSesionCerradaController'
            }).then(
                function (respuesta) {
                    if(respuesta.opcion==1){
                        //abrir de nuevo
                        clase.estado_sesion = 'iniciada';
                        ClasesServices.actualizarSesionClase(clase).then(function (response) {
                            if(response.success){
                                SocketServices.emit('iniciarSesion',infoSesion);
                                $state.transitionTo('crsApp.asignatura.curso.clases.sesion', {
                                    nombre_asignatura:curso.nombre_curso,
                                    ano:curso.ano,
                                    semestre:curso.semestre,
                                    id_curso:curso.id_curso,
                                    id_clase:clase.id_clase});
                            }else{
                                toastr.error('No se pudo iniciar sesión: '+response.err.code,'Error');
                            }
                        });
                    }else{
                        $state.transitionTo('crsApp.asignatura.curso.clases.sesion', {
                            nombre_asignatura:curso.nombre_curso,
                            ano:curso.ano,
                            semestre:curso.semestre,
                            id_curso:curso.id_curso,
                            id_clase:clase.id_clase});
                    }
                });
        }else{
            toastr.error('No se pudo iniciar sesión.','Error');
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

    $rootScope.$on('actualizarListaDeClases', function () {
        if($rootScope.user.tipo=='estudiante'){
            $scope.listaClases = [];
            $scope.listaModulos = [];
            $scope.promesas = ModulosServices.obtenerModulos(curso)
                .then(function (response) {
                    $scope.listaModulos= _.cloneDeep(response.result);
                    $scope.listaModulos= _.map(_.sortByOrder($scope.listaModulos,['posicion'],['asc']));

                    if($scope.listaModulos.length>0){
                        $scope.promesas = ClasesServices.obtenerClases($scope.listaModulos)
                            .then(function (response) {
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
                            });
                    }
                });
        }

    });

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


crsApp.controller('modalSesionCerradaController',function($scope, $mdDialog){
    $scope.cancelar = function() {
        $mdDialog.cancel();
    };

    $scope.aceptar = function(opcion) {
        $mdDialog.hide(opcion);
    };
});
crsApp.controller('ModalEdicionClaseController',function($scope, $mdDialog, clase, listaModulos){
    $scope.clase= _.cloneDeep(clase);
    $scope.listaModulos = _.cloneDeep(listaModulos);
    $scope.cancelar = function() {
        $mdDialog.cancel();
    };

    $scope.aceptar = function() {
        $mdDialog.hide($scope.clase);
    };
});