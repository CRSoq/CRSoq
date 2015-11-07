'use strict';
crsApp.factory('SessionServices', function($http, $q, $localStorage){
    return{
        setToken: function(data){
            $localStorage.token = data.token;
            $localStorage.usuario  = data.usuario;
            $localStorage.tipo = data.tipo;
            $localStorage.id_user = data.id_user;
            return true;
        },
        checkToken: function(){
            var data = this.getSessionData();
            var defered = $q.defer();
            var promise = defered.promise;
            $http.post('/login/checkToken', data)
                .success(function(response){
                    defered.resolve(response);
                })
                .error(function(error){
                    defered.reject(error);
                });
            return promise;
        },
        destroyToken: function(){
            delete  $localStorage.token;
            delete  $localStorage.usuario;
            delete  $localStorage.tipo;
            delete  $localStorage.id_user;
            return true;
        },
        getSessionData: function () {
            var data = {
                token : $localStorage.token,
                usuario: $localStorage.usuario,
                tipo: $localStorage.tipo,
                id_user: $localStorage.id_user
            };
            return data;
        }
    }
});