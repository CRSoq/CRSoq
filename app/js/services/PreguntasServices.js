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
            return postHelper('/preguntas/obtenerPreguntaPorId',id_pregunta);
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
        eliminarPreguntaDeLaAsignatura: function (pregunta) {
            return postHelper('/preguntas/eliminarPreguntaDeLaAsignatura',pregunta);
        },
        eliminarPreguntaDelCurso: function (pregunta) {
            return postHelper('/preguntas/eliminarPreguntaDelCurso',pregunta);
        },
        eliminarPreguntaDeLaClase: function (pregunta) {
            return postHelper('/preguntas/eliminarPreguntaDeLaClase',pregunta);
        },
        asignarPreguntaClase: function (data) {
            return postHelper('/preguntas/asignarPreguntaClase',data);
        },
        asignarEstadoParticipacionPregunta: function (data) {
            return postHelper('/preguntas/asignarEstadoParticipacionPregunta',data);
        },
        participarEnPregunta: function (data) {
            return postHelper('/preguntas/participarEnPregunta',data);
        },
        archivarPregunta : function (pregunta) {
            return postHelper('/preguntas/archivarPregunta',pregunta);
        }
    }
});