'use strict';
crsApp.factory('CursosServices', function ($http, $q, $localStorage) {
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
        crearCurso: function (curso) {
            return postHelper('/cursos/crearCurso',curso);
        },
        obtenerCursos: function (data) {
            return postHelper('/cursos/obtenerCursos',data);
        },
        almacenarCursos: function (cursos) {
            delete  $localStorage.cursos;
            $localStorage.cursos = JSON.stringify(cursos);
        },
        obtenerCursosLocal: function () {
            return  JSON.parse($localStorage.cursos);
        },
        establecerMeta: function (meta, curso) {
            return postHelper('/cursos/establecerMeta',{'curso': curso, 'meta': meta});
        }
    }
});