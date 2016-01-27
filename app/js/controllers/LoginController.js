crsApp.controller('LoginController', function($scope, $state, LoginService, SessionServices, SocketServices){
    'use strict';
    $scope.login = function() {
        var usuario = {
            usuario : $scope.usuario,
            clave : $scope.clave
        };
        LoginService.logIn(usuario).then(function(data){
            if(data.error){
                console.log('alert login fail... '+data.err.code);
            }else{
                if(data.usuario.token != ""){
                    SocketServices.on('connection');
                    SessionServices.asignarToken(data.usuario).then(function (data) {
                        if(data.error){
                            console.log('error actualizar token '+data.err.code);
                        }else{
                            $state.transitionTo("crsApp");
                        }
                    });
                }else{
                    $state.transitionTo("crsApp.login");
                }
            }
        });

    };
    $scope.logOut = function(){
        SessionServices.destroyToken();
        $state.transitionTo("crsApp");
    };
});
