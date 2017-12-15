'use strict';

crsApp.factory('PreguntasBibliotecaServices', function($http, $q){
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
        obtenerBibliotecaDePreguntas: function (asignatura) {
            return postHelper('/biblioteca/obtenerBibliotecaDePreguntas',asignatura);
        },
	obtenerBibliotecaDePreguntas2: function (asignatura) {
            return postHelper('/biblioteca/obtenerBibliotecaDePreguntas2',asignatura);
        },
        crearPreguntaBibliotecaDePreguntas: function (asignatura, pregunta) {
            return postHelper('/biblioteca/crearPreguntaBibliotecaDePreguntas',{'id_asignatura':asignatura.id_asignatura,'b_pregunta':pregunta.b_pregunta});
        }

    }
});
