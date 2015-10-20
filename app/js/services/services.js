'use strict';

crsApp.factory('LoginService', function ($http, $q) {
    return{
        logIn: function(data){
            var defered = $q.defer();
            var promise = defered.promise;

            $http.post('/login', data)
                .success(function(response){
                    defered.resolve(response);
                })
                .error(function(error){
                    defered.reject(error);
                });
            return promise;
        }
        //,
        //logOut: function(){
            //deberia destruir el token en la bd?
       // }
    }
});
crsApp.factory('SessionService', function($http, $q, $localStorage){
    return{
        setToken: function(token, usuario){
            $localStorage.token = token;
            $localStorage.usuario  = usuario;
            return true;
        },
        checkToken: function(){
            var data = {
                usuario: $localStorage.usuario,
                token: $localStorage.token
            };
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
            return true;
        }
    }
});