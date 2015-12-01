'use strict';

crsApp.factory('PreguntasServices', function($http, $q){
    var postHelper = function(ruta, data){
        var defered = $q.defer();
        var promise = defered.promise;
        $http.post(ruta,data)
            .success(function (response) {
                defered.resolve(response);
            })
            .error(function (error) {
                defered.reject(error);
            });
        return promise;
    };
    return{
        obtenerPreguntasClase: function (clase) {
            return postHelper('/preguntas/obtenerPreguntasClase',clase);
        },
        crearPregunta: function (pregunta) {
            var defered = $q.defer();
            var promise = defered.promise;
            $http.post('/preguntas/crearPregunta',pregunta)
                .success(function (response) {
                    defered.resolve(response);
                })
                .error(function (error) {
                    defered.reject(error);
                });
            return promise;
        },
        obtenerPreguntasCurso: function (curso) {
            var defered = $q.defer();
            var promise = defered.promise;
            $http.post('/preguntas/obtenerPreguntasCurso',curso)
                .success(function (response) {
                    defered.resolve(response);
                })
                .error(function (error) {
                    defered.reject(error);
                });
            return promise;
        },
        obtenerPreguntasPorSesion: function (sesion) {
            var defered = $q.defer();
            var promise = defered.promise;
            $http.post('/preguntas/obtenerPreguntasPorSesion',sesion)
                .success(function (response) {
                    defered.resolve(response);
                })
                .error(function (error) {
                    defered.reject(error);
                });
            return promise;
        },
        actualizarPregunta: function (pregunta) {
            var defered = $q.defer();
            var promise = defered.promise;
            $http.post('/preguntas/actualizarPregunta',pregunta)
                .success(function (response) {
                    defered.resolve(response);
                })
                .error(function (error) {
                    defered.reject(error);
                });
            return promise;
        },
        eliminarPregunta: function (pregunta) {
            var defered = $q.defer();
            var promise = defered.promise;
            $http.post('/preguntas/eliminarPregunta',pregunta)
                .success(function (response) {
                    defered.resolve(response);
                })
                .error(function (error) {
                    defered.reject(error);
                });
            return promise;
        }
    }
});