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
        setToken: function(token, usuario, tipo){
            $localStorage.token = token;
            $localStorage.usuario  = usuario;
            $localStorage.tipo = tipo;
            return true;
        },
        checkToken: function(){
            var data = {
                usuario: $localStorage.usuario,
                token: $localStorage.token,
                tipo: $localStorage.tipo
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
            delete  $localStorage.tipo;
            return true;
        }
    }
});

crsApp.factory('DataService', function () {
    var info = {
        usuario : '',
        tipo : ''
    };

    return {
        getData: function () {
            return info;
        },
        setData: function ($scope, data) {
            info = data;
        }
    }
});

crsApp.factory('CursosServies', function ($http, $q) {
    return{
        crearCurso: function (curso) {
            var defered = $q.defer();
            var promise = defered.promise;
            $http.post('/cursos/crearCurso', curso)
                .success(function(response){
                    defered.resolve(response);
                })
                .error(function(error){
                    defered.reject(error);
                });
            return promise;
        },
        obtenerCursos: function () {
            $http.get('/cursos/obtenerCursos')
                .success(function (response) {
                    return response;
                })
                .error(function (error) {
                    return error;
                });
        }
    }
});