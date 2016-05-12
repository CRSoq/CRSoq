'use strict';

crsApp.factory('ProfesoresServices', function ($http, $q) {
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
        obtenerProfesores: function () {
            return postHelper('/profesores/obtenerProfesores');
        },
        crearProfesor: function (profesor) {
            return postHelper('/profesores/crearProfesor',profesor);
        },
        editarProfesor: function (profesor) {
            return postHelper('/profesores/editarProfesor',profesor);
        }
    }
});