'use strict';

crsApp.factory('ClasesServices', function ($http, $q) {
    var clases = [];
    return{
        obtenerClases: function (id_curso) {
            var defered = $q.defer();
            var promise = defered.promise;
            $http.post('/clases/obtenerClases', id_curso)
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