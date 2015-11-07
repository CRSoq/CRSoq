crsApp.controller('LoginController', function($scope, LoginService, SessionServices, $state){
    'use strict';
    $scope.login = function() {
        var usuario = {
            usuario : $scope.usuario,
            clave : $scope.clave
        };
        LoginService.logIn(usuario).then(function(data){
            if(data.token != ""){
                SessionServices.setToken(data);
                $state.transitionTo("crsApp");
            }else{
                $state.transitionTo("crsApp.login");
            }
        });

    };
    $scope.logOut = function(){
        SessionServices.destroyToken();
        $state.transitionTo("crsApp");
    };
});
