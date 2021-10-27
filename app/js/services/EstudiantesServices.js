'use strict';
crsApp.factory('EstudiantesServices', function ($http, $q) {
    var postHelper = function(ruta, data){
        var defered = $q.defer();
        var promise = defered.promise;
        $http.post(ruta,data)
        /*
            .success(function (response) {
                defered.resolve(response);
            })
            .error(function (error) {
                defered.reject(error);
            });
        */
            .then(function onSuccess(response){
                defered.resolve(response.data);
            }, function onError(response){
                defered.reject(response.data)
            });
        return promise;
    };
    return{
        CrearEstudiante: function(estudiante){
            return postHelper('/estudiante/crearEstudiante',estudiante);
        },
	obtenerAlumnosSistema: function(estudiante){
	    return postHelper('/estudiante/obtenerAlumnosSistema',estudiante);
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
        },
        comprobarUsuarioProfesor: function (usuario) {
            return postHelper('/estudiante/comprobarUsuarioProfesor', {usuario:usuario})
        },
        comprobarUsuarioAdministrador: function (usuario) {
            return postHelper('/estudiante/comprobarUsuarioAdministrador', {usuario:usuario})
        },
	editarEstudiante: function(estudiante) {
	    return postHelper('/estudiante/editarEstudiante', estudiante);
	},
	eliminarEstudiante: function(estudiante) {
	    return postHelper('/estudiante/eliminarEstudiante', estudiante);
	},
	eliminarCursosEstudiante: function(estudiante) {
            return postHelper('/estudiante/eliminarCursosEstudiante', estudiante);
        }
    }
});
