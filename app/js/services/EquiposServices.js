'use strict';

crsApp.factory('EquiposServices', function ($http, $q) {
    //var clases = [];
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
        crearEquipo: function (equipo) {
            return postHelper('/equipos/crearEquipo',equipo);
        },
        obtenerEquipos: function (curso) {
            return postHelper('/equipos/obtenerEquipos', curso);
        },
        obtenerAlumnos: function(equipo) {
            return postHelper('/equipos/obtenerAlumnos', equipo);
        },
        obtenerAlumnosSinEquipo: function(curso) {
            return postHelper('/equipos/obtenerAlumnosSinEquipo', curso);
        },
        obtenerEquipoPorID: function (equipo) {
            return postHelper('/equipos/obtenerEquiposPorID', equipo);
        },
        obtenerEquipoAlumno: function(data) {
            return postHelper('/equipos/obtenerEquipoAlumno', data);
        },
        agregarAlumnoAEquipo: function(data) {
            return postHelper('/equipos/agregarAlumnoEquipo', data);
        },
        agregarAlumnosAEquipo: function(data) {
            return postHelper('/equipos/agregarAlumnoEquipo', data);
        },
        actualizarAlumnos: function(data) {
            return postHelper('/equipos/actualizarAlumnos', data);
        },
        actualizarEquipo: function (equipo) {
            return postHelper('/equipos/actualizarEquipo',equipo);
        },
        actualizarEstadoEquipo: function (data) {
            return postHelper('/equipos/actualizarEstadoEquipo',data);
        },
        eliminarEquipo: function (data) {
            return postHelper('/equipos/eliminarEquipo',data);
        },
        eliminarAlumnoEquipo: function (data) {
            return postHelper('/equipos/eliminarAlumnoEquipo',data);
        }
    }
});