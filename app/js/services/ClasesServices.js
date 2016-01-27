'use strict';

crsApp.factory('ClasesServices', function ($http, $q) {
    //var clases = [];
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
        crearClase: function (clase) {
            return postHelper('/clases/crearClase',clase);
        },
        obtenerClases: function (listaModulos) {
            return postHelper('/clases/obtenerClases',listaModulos);
        },
        obtenerClasePorIDSesion: function (sesion) {
            return postHelper('/clases/obtenerClasePorIDSesion',sesion);
        },
        actualizarClase: function (clase) {
            return postHelper('/clases/actualizarClase',clase);
        },
        eliminarClase: function (clase) {
            return postHelper('/clases/eliminarClase',clase);
        },
        actualizarSesionClase: function (clase) {
            return postHelper('/clases/actualizarSesionClase',clase);
        }
    }
});