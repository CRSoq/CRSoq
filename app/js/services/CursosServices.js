'use strict';

crsApp.factory('CursosServices', function ($http, $q, $rootScope, SessionServices) {
    var cursos = [];
    function setCursos(listaCursos){
        cursos = listaCursos;
    }
    function getCursos(){
        return cursos;
    }

    return{
        crearCurso: function (curso) {
            var defered = $q.defer();
            var promise = defered.promise;
            $http.post('/cursos/crearCurso', curso)
                .success(function(response){
                    defered.resolve(response);
                })
                .error(function(error){
                    defered.reject(error);
                });
            return promise;
        },
        obtenerCursos: function (data) {
            var defered = $q.defer();
            var promise = defered.promise;
            $http.post('/cursos/obtenerCursos', data)
                .success(function (response) {
                    setCursos(response);
                    defered.resolve(response);
                })
                .error(function (error) {
                    defered.reject(error);
                });
            return promise;
        },
        getAllCursos: function(){
            var listaCursos = getCursos();
            return listaCursos;
        },
        getCursoPorNombre: function (ano_semestre, nombreCurso) {
            //var listaCursos = cursos;
            var positionSemestre = _.findIndex(cursos, {'nombre':ano_semestre});
            if(positionSemestre>=0){
                var positionCurso = _.findIndex(cursos[positionSemestre].cursos, {'nombre_curso':nombreCurso});
                return cursos[positionSemestre].cursos[positionCurso];
            }else{
                return false;
            }
        },
        cambiarEstado: function (id_curso, estado) {
            var cursoEstado = {
                'id_curso': id_curso,
                'estado': estado
            };
            var defered = $q.defer();
            var promise = defered.promise;
            $http.post('/cursos/cambiarEstado', cursoEstado)
                .success(function (response) {
                    defered.resolve(response);
                })
                .error(function (error) {
                    defered.reject(error);
                });
            return promise;
        }
    }
});