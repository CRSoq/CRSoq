'use strict';

crsApp.factory('ModulosServices', function ($http, $q) {
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
        obtenerModulos: function (curso) {
            return postHelper('/cursos/obtenerModulos',curso);
        },
        crearModulo: function (modulo) {
            return postHelper('/cursos/crearModulo',modulo);
        },
        actualizarModulo: function (modulo) {
            return postHelper('/cursos/actualizarModulo',modulo);
        },
        eliminarModulo: function (modulo) {
            return postHelper('/cursos/eliminarModulo',modulo);
        }

    }
});

