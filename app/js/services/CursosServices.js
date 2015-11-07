'use strict';

crsApp.factory('CursosServices', function ($http, $q) {
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
            return cursos;
        },
        getCursoPorNombre: function (ano_semestre, nombreCurso) {
            var listaCursos = getCursos();
            var positionSemestre = _.findIndex(listaCursos, {'nombre':ano_semestre});
            //var positionCurso = _.findIndex(cursos[positionSemestre].cursos, {'nombre_curso': nombreCurso});
            if(positionSemestre>=0){
                var positionCurso = _.findIndex(listaCursos[positionSemestre].cursos, {'nombre_curso':nombreCurso});
                return listaCursos[positionSemestre].cursos[positionCurso];
            }else{
                return false;
            }
            //return cursos[positionSemestre];//.cursos[positionCurso];
        }
    }
});