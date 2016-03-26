'use strict';

crsApp.factory('CalendarioServices', function ($http, $q) {
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
        obtenerCalendario: function () {
            return postHelper('/calendario/obtenerCalendario');
        }
    }
});