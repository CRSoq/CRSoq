'use strict';

crsApp.factory('SesionClasesService', function ($http, $q,PreguntasServices) {
    return{
        crearSesion: function (sesion) {
            var defered = $q.defer();
            var promise = defered.promise;
            $http.post('/sesion/crearSesion', sesion)
                .success(function (response) {
                    defered.resolve(response);
                })
                .error(function (error) {
                    defered.reject(error);
                });
            return promise;
        },
        obtenerSesion: function (clase) {
            var defered = $q.defer();
            var promise = defered.promise;
            $http.post('/sesion/obtenerSesion', clase)
                .success(function (response) {
                    defered.resolve(response);
                })
                .error(function (error) {
                    defered.reject(error);
                });
            return promise;
        },
        obtenerSesionPreguntas: function (sesion) {
            var defered = $q.defer();
            var promise = defered.promise;
            PreguntasServices.obtenerPreguntasPorSesion(sesion).then(function (data) {
                if(!data.error){
                    defered.resolve(data);
                }else{
                    defered.reject(data.err);
                }
            });
            return promise;
        },
        actualizarSesion: function (sesion) {
            var defered = $q.defer();
            var promise = defered.promise;
            $http.post('/sesion/crearSesion', sesion)
                .success(function (response) {
                    defered.resolve(response);
                })
                .error(function (error) {
                    defered.reject(error);
                });
            return promise;
        },
        eliminarSesion: function (sesion) {
           var defered = $q.defer();
            var promise = defered.promise;
            $http.post('/sesion/crearSesion', sesion)
                .success(function (response) {
                    defered.resolve(response);
                })
                .error(function (error) {
                    defered.reject(error);
                });
            return promise;
        }
    };
});