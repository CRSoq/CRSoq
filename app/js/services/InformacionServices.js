'use strict';
crsApp.factory('InformacionServices', function ($http, $q) {
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
        obtenerCantidadPreguntasCursoPorEstado: function (curso, estado_pregunta) {
            return postHelper('/info/obtenerCantidadPreguntasCursoPorEstado', {'id_curso':curso.id_curso, 'estado_pregunta':estado_pregunta});
        },
        obtenerMetaCurso: function (curso) {
            return postHelper('/info/obtenerMetaCurso',curso);
        },
        numeroParticipacionPreguntasCurso: function (curso, estudiante) {
            return postHelper('/info/numeroParticipacionPreguntasCurso',{id_curso:curso.id_curso, id_user:estudiante.id_user});
        },
        numeroNoSeleccionadoPreguntasCurso: function (curso, estudiante) {
            return postHelper('/info/numeroNoSeleccionadoPreguntasCurso',{id_curso:curso.id_curso, id_user:estudiante.id_user});
        },
        numeroCorrectasPreguntasCurso: function (curso, estudiante) {
            return postHelper('/info/numeroCorrectasPreguntasCurso',{id_curso:curso.id_curso, id_user:estudiante.id_user});
        },
        numeroIncorrectasPreguntasCurso: function (curso, estudiante) {
            return postHelper('/info/numeroIncorrectasPreguntasCurso',{id_curso:curso.id_curso, id_user:estudiante.id_user});
        },
        cantidadTotalPreguntasCurso: function (curso) {
            return postHelper('/info/cantidadTotalPreguntasCurso',curso);
        },
        cantidadTotalPreguntasClase: function (clase) {
            return postHelper('/info/cantidadTotalPreguntasClase',clase);
        },
        numeroParticipacionPreguntasClase: function (clase, estudiante) {
            return postHelper('/info/numeroParticipacionPreguntasClase',{id_clase:clase.id_clase, id_user:estudiante.id_user});
        },
        numeroNoSeleccionadoPreguntasClase: function (clase, estudiante) {
            return postHelper('/info/numeroNoSeleccionadoPreguntasClase',{id_clase:clase.id_clase, id_user:estudiante.id_user});
        },
        numeroCorrectasPreguntasClase: function (clase, estudiante) {
            return postHelper('/info/numeroCorrectasPreguntasClase',{id_clase:clase.id_clase, id_user:estudiante.id_user});
        },
        numeroIncorrectasPreguntasClase: function (clase, estudiante) {
            return postHelper('/info/numeroIncorrectasPreguntasClase',{id_clase:clase.id_clase, id_user:estudiante.id_user});
        },
        numeroDeEstudiantesPorCurso: function (curso) {
            return postHelper('/info/numeroDeEstudiantesPorCurso',curso);
        },
        numeroTotalDeParticipacionPorCurso: function (curso) {
            return postHelper('/info/numeroTotalDeParticipacionPorCurso',curso);
        },



        participacionActualCurso: function (curso) {
            return postHelper('/info/participacionActualCurso',curso);
        },
        participacionTotalPosibleCurso: function (curso) {
            return postHelper('/info/participacionTotalPosibleCurso',curso);
        },
        partYNumIntentosFallidosxPreg: function (curso) {
            return postHelper('/info/partYNumIntentosFallidosxPreg',curso);
        },
        ganadoresPerdedoresNoSelecPregxCurso: function (curso) {
            return postHelper('/info/ganadoresPerdedoresNoSelecPregxCurso',curso);
        },
        resultadoPreguntasPorCurso: function(curso){
            return postHelper('/info/resultadoPreguntasPorCurso',curso);
        },
        pregRealiazadasAgrupadasxClases: function (curso) {
            return postHelper('/info/pregRealiazadasAgrupadasxClases',curso);
        },
        partPregRealiazadasAgrupadasxClases: function (curso) {
            return postHelper('/info/partPregRealiazadasAgrupadasxClases',curso);
        },
        partEstudiantePregRelEnCurso: function (curso) {
            return postHelper('/info/partEstudiantePregRelEnCurso',curso);
        },
        obtenerEstudiantesPorCurso: function (curso) {
            return postHelper('/info/obtenerEstudiantesPorCurso',curso);
        },
        partxEstdPregRealEnCurso: function (curso, estudiante) {
            return postHelper('/info/partxEstdPregRealEnCurso',{id_curso:curso.id_curso, id_user:estudiante.id_user});
        },
        partActvidadesCursoxEstudiante: function (curso, estudiante) {
            return postHelper('/info/partActvidadesCursoxEstudiante',{id_curso:curso.id_curso, id_user:estudiante.id_user});
        },
        partActvidadesxCurso: function (curso) {
            return postHelper('/info/partActvidadesxCurso', curso);
        },
        actividadesCurso: function (curso) {
            return postHelper('/info/actividadesCurso',curso);
        },
        partPregBibliotecaRealiazadasPorCurso: function (curso) {
            return postHelper('/info/partPregBibliotecaRealiazadasPorCurso', curso);
        }
    }
});