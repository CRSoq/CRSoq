'use strict';

crsApp.factory('InformacionServices', function ($http, $q) {
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
        participantesPorPreguntas: function (clase) {
            return postHelper('/preguntas/participantesPorPreguntas',clase);
        },
        intentosPorPreguntas: function (clase) {
            return postHelper('/preguntas/intentosPorPreguntas',clase);
        }
    }
});