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
        crearPreguntaCurso: function (pregunta) {
            return postHelper('/preguntas/crearPreguntaCurso',pregunta);
        },
        crearPreguntaAsignatura: function (pregunta) {
            return postHelper('/preguntas/crearPreguntaAsignatura',pregunta);
        },
        obtenerPreguntasCurso: function (curso) {
            return postHelper('/preguntas/obtenerPreguntasCurso',curso);
        },
        obtenerPreguntasListaClases: function (clases) {
            return postHelper('/preguntas/obtenerPreguntasListaClases',clases);
        },
        obtenerPreguntasAsignatura: function (curso) {
            return postHelper('/preguntas/obtenerPreguntasAsignatura',curso);
        },
        obtenerPreguntasPorSesion: function (sesion) {
            return postHelper('/preguntas/obtenerPreguntasPorSesion',sesion);
        },
        actualizarPregunta: function (pregunta) {
            return postHelper('/preguntas/actualizarPregunta',pregunta);
        },
        actualizarEstadoPregunta: function (pregunta) {
            return postHelper('/preguntas/actualizarEstadoPregunta',pregunta);
        },
        actualizarID_B_Pregunta: function (pregunta) {
            return postHelper('/preguntas/actualizarID_B_Pregunta',pregunta);
        },
        eliminarPregunta: function (pregunta) {
            return postHelper('/preguntas/eliminarPregunta',pregunta);
        },
        asignarPreguntaClase: function (data) {
            return postHelper('/preguntas/asignarPreguntaClase',data);
        },
        asignarGanador: function (data) {
            return postHelper('/preguntas/asignarGanador',data);
        },
        archivarPregunta : function (pregunta) {
            return postHelper('/preguntas/archivarPregunta',pregunta);
        }
    }
});