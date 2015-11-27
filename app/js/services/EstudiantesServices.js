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
        CrearEstudiante: function(data){
            return postHelper('/estudiante/crearEstudiante',data);
        },
        ObtenerEstudiante: function (data) {
            return postHelper('/estudiante/obtenerEstudiante',data);
        },
        ObtenerListaEstudiantes: function (data) {
            return postHelper('/estudiante/obtenerEstudiantesPorCurso',data);
        },
        AsignarCursoAEstudiante: function (data) {
            return postHelper('/estudiante/asignarCursoAEstudiante',data);
        },
        EliminarEstudianteDelCurso: function (data) {
            return postHelper('/estudiante/eliminarEstudianteDelCurso',data);
        }
    }
});