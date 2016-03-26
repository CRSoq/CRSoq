'use strict';

crsApp.factory('AsignaturasServices', function ($http, $q) {
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
        obtenerAsignaturas: function () {
            return postHelper('/asignaturas/obtenerAsignaturas');
        }
    }
});