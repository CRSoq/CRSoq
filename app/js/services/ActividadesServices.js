'use strict';

crsApp.factory('ActividadesServices', function ($http, $q) {
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
        obtenerActividadesCurso: function (curso) {
            return postHelper('/actividades/obtenerActividadesCurso',curso);
        }

    }
});