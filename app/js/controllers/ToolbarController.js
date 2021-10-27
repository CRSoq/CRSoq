crsApp.controller('ToolbarController', function($scope, $rootScope, $stateParams, $location, $mdSidenav) {
    $scope._ = _;
    $scope.show = function () {
        $scope.actualizarToolbar();
      return $location.path() != '/';
    };
    $scope.actualizarToolbar = function () {
        $scope.nombre_asignatura = $stateParams.nombre_asignatura;
        $scope.ano = $stateParams.ano;
        $scope.semestre = $stateParams.semestre;
        $scope.grupo_curso = $stateParams.grupo_curso;
        if($location.path().search('/clases')>0){
            $scope.seccion = 'Clases';
            if($location.path().search('/sesion')>0){
                $scope.sesion = 'Sesi\u00F3n';
            }else{
                $scope.sesion = null;
            }
        }else if($location.path().search('/preguntas')>0){
            $scope.seccion = 'Preguntas';
            $scope.sesion = null;
        }else if($location.path().search('/actividades')>0){
            $scope.seccion = 'Actividades';
            $scope.sesion = null;
        }else if($location.path().search('/info')>0){
            $scope.seccion = 'Información';
            $scope.sesion = null;
        }else if($location.path().search('/config')>0){
            $scope.seccion = 'Configuración';
            $scope.sesion = null;
        }else if($location.path().search('/BibliotecaDePreguntas')>0){
            $scope.seccion = 'Biblioteca De Preguntas';
            $scope.sesion = null;
        }else{
            $scope.seccion = null;
            $scope.sesion  = null;
        }
    };
    $scope.mostrarMenu = function () {
        $mdSidenav('left').toggle();
    };
    $scope.$on('$stateChangeSuccess', function() {
        $scope.actualizarToolbar();
    });
});