'use strict';

crsApp.factory('PreguntasServices', function($http, $q){
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
        obtenerPreguntasClase: function (clase) {
            return postHelper('/preguntas/obtenerPreguntasClase',clase);
        },
        obtenerPreguntaPorId: function (id_pregunta) {
            return postHelper('/preguntas/obtenerPreguntaPorId',{'id':id_pregunta});
        },
        crearPregunta: function (pregunta) {
            return postHelper('/preguntas/crearPregunta',pregunta);
        },
        obtenerPreguntasCurso: function (curso) {
            return postHelper('/preguntas/obtenerPreguntasCurso',curso);
        },
        obtenerPreguntasPorSesion: function (sesion) {
            return postHelper('/preguntas/obtenerPreguntasPorSesion',sesion);
        },
        actualizarPregunta: function (pregunta) {
            return postHelper('/preguntas/actualizarPregunta',pregunta);
        },
        eliminarPregunta: function (pregunta) {
            return postHelper('/preguntas/eliminarPregunta',pregunta);
        },
        asignarGanador: function (data) {
            return postHelper('/preguntas/asignarGanador',data);
        }
    }
});