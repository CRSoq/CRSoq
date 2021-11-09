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
        obtenerEquiposPorID: function (equipo) {
            return postHelper('/equipos/obtenerEquiposPorID',equipo);
        },
        actualizarAlumnos: function(data) {
            return postHelper('/equipos/actualizarAlumnos', data);
        },
        actualizarEquipo: function (equipo) {
            return postHelper('/equipos/actualizarEquipo',equipo);
        },
        eliminarEquipo: function (equipo) {
            return postHelper('/equipos/eliminarEquipo',equipo);
        },
    }
});