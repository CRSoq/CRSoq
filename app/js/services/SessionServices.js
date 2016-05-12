'use strict';
crsApp.factory('SessionServices', function($http, $q, $localStorage){
    return{
        setToken: function(data){
            $localStorage.token = data.token;
            $localStorage.usuario  = data.usuario;
            $localStorage.tipo = data.tipo;
            $localStorage.id_user = data.id_user;
            if(!_.isUndefined(data.nombre)){
                $localStorage.nombre = data.nombre;
            }
            if(!_.isUndefined(data.apellido)){
                $localStorage.apellido = data.apellido;
            }
            if(!_.isUndefined(data.rut)){
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
        destroySession: function(){
            delete  $localStorage.token;
            delete  $localStorage.usuario;
            delete  $localStorage.tipo;
            delete  $localStorage.id_user;
            if(!_.isUndefined($localStorage.nombre)){
                delete  $localStorage.nombre;
            }
            if(!_.isUndefined($localStorage.apellido)){
                delete  $localStorage.apellido;
            }
            if(!_.isUndefined($localStorage.rut)){
                delete  $localStorage.rut;
            }
            return true;
        },
        getSessionData: function () {
            var data = null;
            if(!_.isUndefined($localStorage.nombre) && !_.isUndefined($localStorage.apellido)){
                data = {
                    token : $localStorage.token,
                    usuario: $localStorage.usuario,
                    tipo: $localStorage.tipo,
                    id_user: $localStorage.id_user,
                    nombre: $localStorage.nombre,
                    apellido: $localStorage.apellido
                };
                if(!_.isUndefined($localStorage.rut)){
                    data.rut = $localStorage.rut;
                }
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