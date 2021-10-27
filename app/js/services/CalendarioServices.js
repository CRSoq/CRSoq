'use strict';
crsApp.factory('CalendarioServices', function ($http, $q) {
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
        obtenerCalendario: function () {
            return postHelper('/calendario/obtenerCalendario');
        },
        crearCalendario: function (calendario) {
            return postHelper('/calendario/crearCalendario', calendario);
        },
        editarCalendario: function (calendario) {
            return postHelper('/calendario/editarCalendario', calendario);
        }
    }
});