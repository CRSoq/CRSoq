'use strict';
crsApp.controller('AdministracionController', function($scope, toastr, $mdDialog, CalendarioServices, AsignaturasServices, ProfesoresServices){
    $scope.promesas = [];
    //obtener asignaturas,calendario,profesores
    $scope.listaAsignaturas = [];
    $scope.listaCalendario = [];
    $scope.listaProfesores = [];

    CalendarioServices.obtenerCalendario().then(function (response) {
        if(response.success){
            $scope.listaCalendario = _.cloneDeep(response.result);
        }else{
            toastr.error('No se obtuvo el calendario: '+response.err.code,'Error');
        }
    });
    AsignaturasServices.obtenerAsignaturas().then(function (response) {
        if(response.success){
            $scope.listaAsignaturas = _.cloneDeep(response.result);
        }else{
            toastr.error('No se obtuvieron las asignaturas: '+response.err.code,'Error');
        }
    });
    ProfesoresServices.obtenerProfesores().then(function (response) {
        if(response.success){
            $scope.listaProfesores = _.cloneDeep(response.result);
        }else{
            toastr.error('No se obtuvo lista de profesores: '+response.err.code,'Error');
        }
    });
    $scope.agregarAsignatura = function () {
        $mdDialog
            .show({
                templateUrl: '/partials/content/administracion/modalAgregarAsignatura.html',
                controller: 'modalAgregarAsignaturaController',
                locals:{
                    titulo: 'Crear asignatura',
                    asignatura: null,
                    listaAsignaturas: $scope.listaAsignaturas
                }
            })
            .then(
            function (asignatura) {
                AsignaturasServices.crearAsignatura(asignatura).then(function (response) {
                    if(response.success){
                        asignatura.id_asignatura = response.id_asignatura;
                        $scope.listaAsignaturas.push(asignatura);
                        toastr.success('Asignatura creada.');
                    }else{
                        toastr.error('No se pudo crear la asignatura: '+response.err.code,'Error');
                    }
                });
            });
    };
    $scope.editarAsignatura = function (asignatura) {
        $mdDialog
            .show({
                templateUrl: '/partials/content/administracion/modalAgregarAsignatura.html',
                controller: 'modalAgregarAsignaturaController',
                locals:{
                    titulo: 'Editar asignatura',
                    asignatura: asignatura,
                    listaAsignaturas: $scope.listaAsignaturas
                }
            })
            .then(
            function (asignatura) {
                AsignaturasServices.editarAsignatura(asignatura).then(function (response) {
                    if(response.success){
                        _.findWhere($scope.listaAsignaturas,{id_asignatura:asignatura.id_asignatura}).nombre_asignatura=asignatura.nombre_asignatura;
                        toastr.success('Asignatura editada.');
                    }else{
                        toastr.error('No se pudo editar la asignatura: '+response.err.code,'Error');
                    }
                });
            });
    };
    $scope.nuevoAnoAcademico = function () {
        $mdDialog
            .show({
                templateUrl: '/partials/content/administracion/modalAgregarCalendario.html',
                controller: 'modalAgregarCalendarioController',
                locals:{
                    titulo: 'Crear año/semestre académico',
                    calendario: null,
                    listaCalendario: $scope.listaCalendario
                }
            })
            .then(
            function (calendario) {
                CalendarioServices.crearCalendario(calendario).then(function (response) {
                    if(response.success){
                        calendario.id_calendario = response.id_calendario;
                        $scope.listaCalendario.push(calendario);
                        toastr.success('Año/semestre agregados al calendario.');
                    }else{
                        toastr.error('No se pudo agregar año/semestre al calendario: '+response.err.code,'Error');
                    }
                });
            });
    };
    $scope.editarAnoAcademico = function (calendario) {
        $mdDialog
            .show({
                templateUrl: '/partials/content/administracion/modalAgregarCalendario.html',
                controller: 'modalAgregarCalendarioController',
                locals:{
                    titulo: 'Editar año/semestre académico',
                    calendario: calendario,
                    listaCalendario: $scope.listaCalendario
                }
            })
            .then(
            function (calendario) {
                CalendarioServices.editarCalendario(calendario).then(function (response) {
                    if(response.success){
                        var cal = _.findWhere($scope.listaCalendario,{id_calendario:calendario.id_calendario});
                        cal.ano = calendario.ano;
                        cal.semestre = calendario.semestre;
                        toastr.success('Año/semestre editados del calendario.');
                    }else{
                        toastr.error('No se pudo editar año/semestre al calendario: '+response.err.code,'Error');
                    }
                });
            });
    };
    $scope.nuevoProfesor = function () {
        $mdDialog
            .show({
                templateUrl: '/partials/content/administracion/modalAgregarProfesor.html',
                controller: 'modalAgregarProfesorController',
                locals:{
                    titulo: 'Agregar profesor',
                    profesor: null,
                    listaProfesores: $scope.listaProfesores
                }
            })
            .then(
            function (profesor) {
                ProfesoresServices.crearProfesor(profesor).then(function (response) {
                    if(response.success){
                        profesor.id_user = response.id_user;
                        $scope.listaProfesores.push(profesor);
                        toastr.success('Profesor agregado correctamente.');
                    }else{
                        toastr.error('No se pudo agregar al profesor: '+response.err.code,'Error');
                    }
                });
            });
    };
    $scope.editarProfesor = function (profesor) {
        $mdDialog
            .show({
                templateUrl: '/partials/content/administracion/modalAgregarProfesor.html',
                controller: 'modalAgregarProfesorController',
                locals:{
                    titulo: 'Editar profesor',
                    profesor: profesor,
                    listaProfesores: $scope.listaProfesores
                }
            })
            .then(
            function (profesor) {
                ProfesoresServices.editarProfesor(profesor).then(function (response) {
                    if(response.success){
                        var profe = _.findWhere($scope.listaProfesores,{id_user:profesor.id_user});
                        profe.nombre = profesor.nombre;
                        profe.apellido = profesor.apellido;
                        profe.usuario = profesor.usuario;
                        profe.clave = profesor.clave;
                        toastr.success('Profesor editado.');
                    }else{
                        toastr.error('No se pudo editar profesor: '+response.err.code,'Error');
                    }
                });
            });
    };
});

crsApp.controller('modalAgregarAsignaturaController', function($scope, toastr, $mdDialog, asignatura, titulo, listaAsignaturas){
    var listaAsig = _.cloneDeep(listaAsignaturas);
    $scope.titulo=titulo;
    if(_.isNull(asignatura)){
        $scope.asignatura = {};
    }else{
        $scope.asignatura = _.clone(asignatura);
    }
    $scope.aceptar = function () {
        if(!_.isUndefined($scope.asignatura.nombre_asignatura)){
            var index = _.findIndex(listaAsig, function (asignatura) {
                if(asignatura.nombre_asignatura == $scope.asignatura.nombre_asignatura
                && asignatura.id_asignatura != $scope.asignatura.id_asignatura){
                   return true;
                }
            });
            if(index<0){
                $mdDialog.hide($scope.asignatura);
            }else{
                toastr.error('Ya existe esta asignatura.','Error');
            }
        }else{
            toastr.error('Debe ingresar el nombre de la asignatura','Error');
        }
    };

    $scope.cancelar = function () {
        $mdDialog.cancel();
    }
});
crsApp.controller('modalAgregarCalendarioController', function($scope, toastr, $mdDialog, calendario, titulo, listaCalendario){
    $scope.titulo=titulo;
    var listaCal = _.cloneDeep(listaCalendario);
    if(_.isNull(calendario)){
        $scope.calendario = {};
    }else{
        $scope.calendario = _.clone(calendario);
    }
    $scope.aceptar = function () {
        if(!_.isUndefined($scope.calendario.ano) && !_.isUndefined($scope.calendario.semestre)){
            var index = _.findIndex(listaCal, function (calendario) {
                if(calendario.ano == $scope.calendario.ano
                && calendario.semestre == $scope.calendario.semestre
                && calendario.id_calendario != $scope.calendario.id_calendario){
                    return true;
                }
            });
            if(index<0){
                $mdDialog.hide($scope.calendario);
            }else{
                toastr.error('Ya existe esta combinación año/semestre.','Error');
            }
        }else{
            toastr.error('Debe ingresar el año y semestre.','Error');
        }
    };

    $scope.cancelar = function () {
        $mdDialog.cancel();
    }
});
crsApp.controller('modalAgregarProfesorController', function($scope, toastr, $mdDialog, profesor, titulo, listaProfesores){
    $scope.titulo=titulo;
    var listaPro = _.cloneDeep(listaProfesores);
    if(_.isNull(profesor)){
        $scope.profesor = {};
    }else{
        $scope.profesor = _.clone(profesor);
    }
    $scope.aceptar = function () {
        if(!_.isUndefined($scope.profesor.nombre) && !_.isUndefined($scope.profesor.apellido) && !_.isUndefined($scope.profesor.usuario) && !_.isUndefined($scope.profesor.clave)){
            var index = _.findIndex(listaPro, function (profesor) {
                if(profesor.usuario == $scope.profesor.usuario && profesor.id_user != $scope.profesor.id_user){
                   return true;
                }
            });
            if(index<0){
                $mdDialog.hide($scope.profesor);
            }else{
                toastr.error('Ya existe este usuario','Error');
            }
        }else{
            toastr.error('Debe ingresar todos los datos.','Error');
        }
    };
    $scope.cancelar = function () {
        $mdDialog.cancel();
    }
});
crsApp.controller('ContentAdmin', function($scope, $state, $location, $mdSidenav, SessionServices){
    $scope.actualizarToolbar = function () {
        if($location.path().search('/profesores')>0){
            $scope.titulo_seccion = 'Profesores';
        }else if($location.path().search('/asignaturas')>0){
            $scope.titulo_seccion = 'Asignaturas';
        }else if($location.path().search('/calendario')>0){
            $scope.titulo_seccion = 'Calendario';
        }else{
            $scope.titulo_seccion = null;
        }
    };
    $scope.mostrarMenu = function () {
        $mdSidenav('left').toggle();
    };

    $scope.$on('$stateChangeSuccess', function() {
        $scope.actualizarToolbar();
    });
    $scope.logOut = function(){
        SessionServices.destroySession();
        $state.transitionTo("crsApp.login");
    };
});