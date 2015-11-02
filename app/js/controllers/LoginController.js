crsApp.controller('LoginController', function($scope, LoginService, SessionService, $state){
    'use strict';
    $scope.login = function() {
        var usuario = {
            usuario : $scope.usuario,
            clave : $scope.clave
        };
        LoginService.logIn(usuario).then(function(data){
            if(data.token != ""){
                SessionService.setToken(data);
                $state.transitionTo("crsApp");
            }else{
                $state.transitionTo("crsApp.login");
            }
        });

    };
    $scope.logOut = function(){
        SessionService.destroyToken();
        $state.transitionTo("crsApp");
    };
});
