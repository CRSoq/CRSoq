'use strict';

crsApp.factory('TemassServices', function ($http, $q) {
    var postHelper = function(ruta, data){
        var defered = $q.defer();
        var promise = defered.promise;
        $http.post(ruta,data)
        /*
            .success(function (response) {
                defered.resolve(response);
            })
            .error(function (error) {
                defered.reject(error);
            });
        */
            .then(function onSuccess(response){
                defered.resolve(response.data);
            }, function onError(response){
                defered.reject(response.data)
            });
        return promise;
    };
    return{
        obtenerTemas: function (asignatura) {
            return postHelper('/asignaturas/obtenerTemas',asignatura);
        },
        crearTopico: function (topico) {
            return postHelper('/asignaturas/crearTema',tema);
        },
        actualizarTopico: function (topico) {
            return postHelper('/asignaturas/actualizarTema',topico);
        },
        eliminarTopico: function (topico) {
            return postHelper('/asignaturas/eliminarTema',topico);
        },
    }
});
