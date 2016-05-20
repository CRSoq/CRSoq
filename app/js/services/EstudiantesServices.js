'use strict';
crsApp.factory('EstudiantesServices', function ($http, $q) {
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
        CrearEstudiante: function(estudiante){
            return postHelper('/estudiante/crearEstudiante',estudiante);
        },
        ObtenerEstudiante: function (estudiante) {
            return postHelper('/estudiante/obtenerEstudiante',estudiante);
        },
        obtenerEstudiantesPorCurso: function (curso) {
            return postHelper('/estudiante/obtenerEstudiantesPorCurso',curso);
        },
        AsignarCursoAEstudiante: function (data) {
            return postHelper('/estudiante/asignarCursoAEstudiante',data);
        },
        EliminarEstudianteDelCurso: function (data) {
            return postHelper('/estudiante/eliminarEstudianteDelCurso',data);
        },
        ActualizarEstudiante: function (data) {
            return postHelper('/estudiante/actualizarEstudiante', data);
        }
    }
});