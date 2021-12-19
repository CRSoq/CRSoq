'use strict';
crsApp.factory('CursosServices', function ($http, $q, $localStorage) {
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
        actualizarCursoLocal: function (curso) {
            var asignaturas = JSON.parse($localStorage.cursos);
            _.findIndex(asignaturas, function (asignatura) {
                if(asignatura.asignatura===curso.nombre_curso ){
                    _.findIndex(asignatura.cursos, function (cursoLocal) {
                        if(cursoLocal.id_curso===curso.id_curso){
                            cursoLocal.meta=curso.meta;
			    cursoLocal.meta_alumno=curso.meta_alumno;
                        }
                    });
                }
            });
            delete  $localStorage.cursos;
            $localStorage.cursos = JSON.stringify(asignaturas);
        },
        establecerMeta: function (meta, curso) {
            return postHelper('/cursos/establecerMeta',{'curso': curso, 'meta': meta});
        },
        establecerMetaEstudiante: function (meta_alumno, curso) {
            return postHelper('/cursos/establecerMetaEstudiante',{'curso': curso, 'meta_alumno': meta_alumno});
        },
        obtenerAlumnoCurso: function (data) {
            return postHelper('/cursos/obtenerAlumnoCurso', data);
        },
        actualizarErrores: function (data) {
            return postHelper('/cursos/actualizarErrores', data);
        },
        actualizarPuntos: function (data) {
            return postHelper('/cursos/actualizarPuntos', data);
        },
        actualizarUltEquipo: function(data) {
            return postHelper('/cursos/actualizarUltEquipo', data);
        }
    }
});
