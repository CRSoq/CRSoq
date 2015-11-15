'use strict';

crsApp.factory('ClasesServices', function ($http, $q) {
    //var clases = [];
    return{
        crearClase: function (clase) {
            var defered = $q.defer();
            var promise = defered.promise;
            $http.post('/clases/crearClase', clase)
                .success(function (response) {
                    defered.resolve(response);
                })
                .error(function (error) {
                    defered.reject(error);
                });
            return promise;
        },
        obtenerClases: function (listaModulos) {
            var defered = $q.defer();
            var promise = defered.promise;
            $http.post('/clases/obtenerClases', listaModulos)
                .success(function (response) {
                    defered.resolve(response);
                })
                .error(function (error) {
                    defered.reject(error);
                });
            return promise;
        },
        actualizarClase: function (clase) {
            var defered = $q.defer();
            var promise = defered.promise;
            $http.post('/clases/actualizarClase', clase)
                .success(function (response) {
                    defered.resolve(response);
                })
                .error(function (error) {
                    defered.reject(error);
                });
            return promise;
        },
        eliminarClase: function (clase) {
            var defered = $q.defer();
            var promise = defered.promise;
            $http.post('/clases/eliminarClase', clase)
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