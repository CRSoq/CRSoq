'use strict';
crsApp.factory('SessionServices', function($http, $q, $localStorage){
    return{
        setToken: function(data){
            $localStorage.token = data.token;
            $localStorage.usuario  = data.usuario;
            $localStorage.tipo = data.tipo;
            $localStorage.id_user = data.id_user;
            if(!_.isUndefined(data.nombre) && !_.isUndefined(data.apellido) && !_.isUndefined(data.rut)){
                $localStorage.nombre = data.nombre;
                $localStorage.apellido = data.apellido;
                $localStorage.rut = data.rut;
            }
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
        asignarToken: function (data) {
            var defered = $q.defer();
            var promise = defered.promise;
            this.setToken(data);
            $http.post('/login/asignarToken', data)
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
            if(!_.isUndefined($localStorage.nombre) && !_.isUndefined($localStorage.apellido) && !_.isUndefined($localStorage.rut)){
                delete  $localStorage.nombre;
                delete  $localStorage.apellido;
                delete  $localStorage.rut;
            }
            return true;
        },
        getSessionData: function () {
            var data = null;
            if(!_.isUndefined($localStorage.nombre) && !_.isUndefined($localStorage.apellido) && !_.isUndefined($localStorage.rut)){
                data = {
                    token : $localStorage.token,
                    usuario: $localStorage.usuario,
                    tipo: $localStorage.tipo,
                    id_user: $localStorage.id_user,
                    nombre: $localStorage.nombre,
                    apellido: $localStorage.apellido,
                    rut: $localStorage.rut
                };
            }else{
                data = {
                    token : $localStorage.token,
                    usuario: $localStorage.usuario,
                    tipo: $localStorage.tipo,
                    id_user: $localStorage.id_user
                };
            }
            return data;
        }
    }
});