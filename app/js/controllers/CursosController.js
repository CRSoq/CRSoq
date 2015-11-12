crsApp.controller('CursosController', function($scope, $filter, $stateParams, $modal, CursosServices, SessionServices) {
    $scope.menu = CursosServices.getAllCursos();
    var found = $filter('filter')($scope.menu,  {'nombre':$stateParams.semestre}, true)[0];
    if(!angular.isUndefined(found)) {
        $scope.semestre = found;
    }
    $scope.crearCurso = function () {
        //levantar modal
        var modalInstance = $modal.open({
            animation   : true,
            templateUrl : '/partials/content/main/crearCursoModal.html',
            controller  : 'ModalCrearCursoController',
            size        : 'lg',
            backdrop    : 'static',
            resolve     : {
                /*items: function () {
                    return
                }*/
            }
        });

        modalInstance.result.then(function (curso){
            CursosServices.crearCurso(curso).then(function (data) {
                console.log(data);
            });
        });
    };
    //eliminarCurso?
});

crsApp.controller('ModalCrearCursoController', function ($scope, $modalInstance, SessionServices) {
    $scope.aceptar = function () {
        var dataUsuario = SessionServices.getSessionData();
        var curso = {
            nombre      : $scope.nombre,
            ano         : $scope.ano,
            semestre    : $scope.semestre,
            id_user : dataUsuario.id_user
        };
        $modalInstance.close(curso);
    };
    $scope.cancelar = function () {
        $modalInstance.dismiss();
    }
});

crsApp.controller('CursoGralInfoController', function ($scope, $rootScope, $stateParams, $location, CursosServices) {
    obtenerInfo();
    $rootScope.$on('actualizarControladores', function () {
        obtenerInfo();
    });
    function obtenerInfo(){
        var ano_semestre=$location.path();
        ano_semestre=ano_semestre.substring(8,ano_semestre.length);
        ano_semestre=ano_semestre.substring(0,ano_semestre.indexOf('/'));
        //var algo =CursosServices.getCursoPorNombre(ano_semestre,$stateParams.curso);
        var cursos = CursosServices.getAllCursos();
        var positionSemestre = _.findIndex(cursos, {'nombre':ano_semestre});
        if(positionSemestre>=0){
            var positionCurso = _.findIndex(cursos[positionSemestre].cursos, {'nombre_curso':$stateParams.curso});
            if(!_.isUndefined(cursos[positionSemestre].cursos[positionCurso])){
                $scope.estado = cursos[positionSemestre].cursos[positionCurso].estado;
            }
        }else{
            return false;
        }
    }

});

crsApp.controller('ConfigCursoController', function ($scope, $rootScope, $state, $stateParams, CursosServices, ModulosServices, SessionServices) {
    var curso = CursosServices.getCursoPorNombre($stateParams.semestre, $stateParams.curso);
    $scope.config = [
        {
            'id_curso': curso.id_curso
        },
        {
            'modulos': []
        },
        {
            'modulosEliminados': []
        }
    ];
    $scope.modulos = [];
    $scope.listaModulos = [];
    $scope.modulosEliminados = [];
    ModulosServices.obtenerModulos(curso).then(function (data) {
        if(data){
            _.assign($scope.modulos,data);
            $scope.modulos=_.sortByOrder($scope.modulos,['posicion'],['asc']);
            _.assign($scope.listaModulos,data);
            _.sortByOrder($scope.listaModulos,['posicion'],['asc']);
        }else{
            var modulo = {
                'nombre_modulo': '',
                'posicion': $scope.modulos.length+1
            };
            $scope.modulos.push(modulo);
        }
    });

    $scope.agregarModulo = function () {
        var modulo = {
            'nombre_modulo': '',
            'posicion': $scope.modulos.length+1
        };
        $scope.modulos.push(modulo);
    };
    $scope.subirModulo = function (posicionModuloActual) {
        var posicionActual = posicionModuloActual-1;
        var moduloAux = {
            'nombre_modulo': $scope.modulos[posicionActual].nombre_modulo
        };
        $scope.modulos[posicionActual].nombre_modulo=$scope.modulos[posicionActual-1].nombre_modulo;
        $scope.modulos[posicionActual-1].nombre_modulo=moduloAux.nombre_modulo;
    };
    $scope.bajarmodulo = function (posicionModuloActual) {
        var posicionActual = posicionModuloActual - 1;
        var moduloAux = {
            'nombre_modulo': $scope.modulos[posicionActual].nombre_modulo
        };
        $scope.modulos[posicionActual].nombre_modulo = $scope.modulos[posicionActual + 1].nombre_modulo;
        $scope.modulos[posicionActual + 1].nombre_modulo = moduloAux.nombre_modulo;
    };
    $scope.eliminarModulo = function (posicionModulo) {
        var pos = posicionModulo-1;
        if(!_.isUndefined($scope.modulos[pos].id_modulo)){
            $scope.modulosEliminados.push($scope.modulos[pos]);
        }
        $scope.modulos.splice(pos,1);
        while(pos<$scope.modulos.length){
            $scope.modulos[pos].posicion--;
            pos++;
        }
    };
    $scope.guardarConfig = function () {
        $scope.config[1].modulos = [];
        $scope.config[2].modulosEliminados = [];
        _.assign($scope.config[1].modulos,$scope.modulos);
        _.assign($scope.config[2].modulosEliminados,$scope.modulosEliminados);
        if(campoVacio($scope.modulos)){
            ModulosServices.guardarModulos($scope.config).then(function (data) {
                if(data[0].insert.length==0 && data[1].update.length==0 && data[2].delete.length==0){
                    if(curso.estado=='sin_config'){
                        CursosServices.cambiarEstado(curso.id_curso,'disponible').then(function (data) {
                            CursosServices.obtenerCursos(SessionServices.getSessionData()).then(function (data) {
                                if(data){
                                    $rootScope.$emit('actualizarControladores');
                                }
                            });
                        });
                    }
                    $state.transitionTo("crsApp.cursosSemestre.curso",{semestre:$stateParams.semestre,curso:$stateParams.curso});
                }
            });
        }else{
            //sin modificacion
            $scope.cancelarConfig();
        }

        function campoVacio(lista){
            var i=0;
            while(i<lista.length){
                if(_.isEmpty(lista[i].nombre_modulo)){
                    return false;
                }
                i++;
            }
            return true;
        }

    };
    $scope.cancelarConfig = function () {
        $state.transitionTo("crsApp.cursosSemestre.curso",{semestre:$stateParams.semestre,curso:$stateParams.curso});
    };
});