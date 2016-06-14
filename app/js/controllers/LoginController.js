'use strict';
crsApp.controller('LoginController', function($scope, $state, $stateParams, toastr, LoginService, SessionServices, SocketServices){
    $scope.login = function() {
        var usuario = {
            usuario : $scope.usuario,
            clave : $scope.clave
        };
        LoginService.logIn(usuario).then(function(response){
            if (response.success) {
                if (response.usuario.token != "") {
                    SessionServices.asignarToken(response.usuario).then(
                        function (response) {
                            if (response.success) {
                                var dataSesion = SessionServices.getSessionData();
                                if(_.isNull(SocketServices.getSocket())){
                                    SocketServices.connect();
                                    if(!_.isUndefined(dataSesion.usuario)){
                                        SocketServices.emit('EnviarDatos', dataSesion);
                                    }
                                }else{
                                    if(!_.isUndefined(dataSesion.usuario)){
                                        SocketServices.emit('EnviarDatos', dataSesion);
                                    }
                                }

                                $state.transitionTo("crsApp", $stateParams, {
                                    reload: true, inherit: false, notify: true
                                });
                            }
                        });
                } else {
                    toastr.error('No se pudo asignar token.', 'Error');
                    $state.transitionTo("crsApp.login");
                }
            } else {
                toastr.error('Usuario o contraseña incorrecta.','Error');
            }
        });
    };
});
