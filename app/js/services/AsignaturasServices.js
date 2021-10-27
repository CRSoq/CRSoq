'use strict';
crsApp.factory('AsignaturasServices', function ($http, $q) {
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
        obtenerAsignaturas: function () {
            return postHelper('/asignaturas/obtenerAsignaturas');
        },
        crearAsignatura: function (asignatura) {
            return postHelper('/asignaturas/crearAsignatura', asignatura);
        },
        editarAsignatura: function (asignatura) {
            return postHelper('/asignaturas/editarAsignatura', asignatura);
        },
        obtenerListaCursosAsignatura: function (asignatura) {
            return postHelper('/asignaturas/obtenerListaCursosAsignatura', asignatura);
        }
    }
});