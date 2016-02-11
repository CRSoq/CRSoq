'use strict';

crsApp.factory('PreguntaSesionService', function ($http, $q) {
    /*var postHelper = function(ruta, data){
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
    };*/
    return{


        /*
        obtenerSesionPreguntas: function (clase) {
            //return postHelper('/estudiante/crearEstudiante',clase);
        },
        iniciarSesionPreguntas: function () {

        },
        actualizarSesionClase: function (clase) {
            return postHelper('/clases/actualizarSesionClase',clase);
        }*/
    };
});