'use strict';

crsApp.factory('TopicosServices', function ($http, $q) {
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
        obtenerTopicos: function (asignatura) {
            return postHelper('/asignaturas/obtenerTopicos',asignatura);
        },
	obtenerTemas: function (asignatura) {
            return postHelper('/asignaturas/obtenerTemas',asignatura);
        },
        crearTopico: function (topico) {
            return postHelper('/asignaturas/crearTopico',topico);
        },
	crearTema: function (tema) {
	    return postHelper('/asignaturas/crearTema',tema);
	},
        editarTopico: function (topico) {
            return postHelper('/asignaturas/editarTopico',topico);
        },
        eliminarTopico: function (topico) {
            return postHelper('/asignaturas/eliminarTopico',topico);
        },
        editarTema: function (tema) {
            return postHelper('/asignaturas/editarTema',tema);
        },
        eliminarTema: function (tema) {
            return postHelper('/asignaturas/eliminarTema',tema);
        }
    }
});
