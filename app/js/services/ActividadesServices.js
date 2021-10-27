'use strict';

crsApp.factory('ActividadesServices', function ($http, $q) {
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
        obtenerActividadesCurso: function (curso) {
            return postHelper('/actividades/obtenerActividadesCurso',curso);
        },
        crearActividad: function (actividad) {
            return postHelper('/actividades/crearActividad',actividad);
        },
        eliminarActividad: function (actividad) {
            return postHelper('/actividades/eliminarActividad',actividad);
        },
        actualizarActividad: function (actividad) {
            return postHelper('/actividades/actualizarActividad',actividad);
        },
        eliminarParticipanteActividad: function (actividad, participante) {
            return postHelper('/actividades/eliminarParticipanteActividad',{id_actividad:actividad.id_actividad,id_user:participante.id_user});
        },
        asignarParticipanteActividad: function (actividad, participante, estado_participacion) {
            return postHelper('/actividades/asignarParticipanteActividad',{'estado_part_act':estado_participacion,'id_actividad':actividad.id_actividad,'id_user':participante.id_user});
        },
        eliminarParticipacionActividad: function (actividad) {
            return postHelper('/actividades/eliminarParticipacionActividad',actividad);
        },
        obtenerParticipantesActividad: function (actividad) {
            return postHelper('/actividades/obtenerParticipantesActividad',actividad);
        },
        obtenerParticipacionPorEstudiante: function (estudiante) {
            return postHelper('/actividades/obtenerParticipacionPorEstudiante',{id_user:estudiante.id_user});
        }
    }
});