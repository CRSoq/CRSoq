'use strict';

crsApp.factory('ModulosServices', function ($http, $q) {
    return{
        obtenerModulos: function (curso) {
            var defered = $q.defer();
            var promise = defered.promise;
            $http.post('/cursos/obtenerModulos', curso)
                .success(function (response) {
                    defered.resolve(response);
                })
                .error(function (error) {
                    defered.reject(error);
                });
            return promise;
        },
        guardarModulos: function (modulos) {
            var defered = $q.defer();
            var promise = defered.promise;
            $http.post('/cursos/guardarModulos', modulos)
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

