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
    var postHelperMisCursos = function(ruta, data){
        var defered = $q.defer();
        var promise = defered.promise;
        $http.post(ruta, data)
            .success(function (response) {
                setCursos(response);
                defered.resolve(response);
            })
            .error(function (error, status) {
                defered.reject(error);
            });
        return promise;
    };
    var cursos = [];
    function setCursos(listaCursos){
        cursos = listaCursos;
    }
    function getCursos(){
        return cursos;
    }

    return{
        crearCurso: function (curso) {
            return postHelper('/cursos/crearCurso',curso);
        },
        obtenerCursos: function (data) {
            return postHelperMisCursos('/cursos/obtenerCursos',data);
        },
        getAllCursos: function(){
            var listaCursos = getCursos();
            return listaCursos;
        },
        getCursoPorNombre: function (ano_semestre, nombreCurso) {
            var positionSemestre = _.findIndex(cursos, {'nombre':ano_semestre});
            if(positionSemestre>=0){
                var positionCurso = _.findIndex(cursos[positionSemestre].cursos, {'nombre_curso':nombreCurso});
                return cursos[positionSemestre].cursos[positionCurso];
            }else{
                return false;
            }
        },
        cambiarEstado: function (id_curso, estado) {
            return postHelper('/cursos/cambiarEstado',{'id_curso': id_curso, 'estado': estado});
        },
        almacenarCursos: function (cursos) {
            delete  $localStorage.cursos;
            $localStorage.cursos = JSON.stringify(cursos);
        },
        obtenerCursosLocal: function () {
            return  JSON.parse($localStorage.cursos);
        }
    }
});