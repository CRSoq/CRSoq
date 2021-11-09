'use strict';
crsApp.controller('InformacionController', function ($scope, $stateParams, $mdSidenav, $mdDialog, $timeout, $q, toastr, InformacionServices, CursosServices) {
    var asignaturas = CursosServices.obtenerCursosLocal();
    var asignatura = _.findWhere(asignaturas,{'asignatura':$stateParams.nombre_asignatura});
    $scope.curso = _.findWhere(asignatura.cursos, {'id_curso':Number($stateParams.id_curso)});
    $scope._ = _;
    $scope.alumnoSeleccionado;
    $scope.configurarGrafico = function () {
        $mdSidenav('right').toggle();
    };
    $scope.configurarGrafico2 = function () {
        $mdSidenav('configGraf2').toggle();
    };
    $scope.configurarGraficoPuntosGanados = function () {
        $mdSidenav('configGrafPuntosGanados').toggle();
    };
    $scope.configurarGrafico4 = function () {   
        $mdSidenav('configGraf4').toggle();
    };
    $scope.configurarGrafico6 = function () {
        $mdSidenav('configGraf6').toggle();
    };
    $scope.datosPuntosGanados = null;
    var mostrarDatos = true;
    var deferedPuntos = $q.defer();
    var promesaPuntos = deferedPuntos.promise;
    promesaPuntos.then(function (data) {
        mostrarDatos = false;
        $scope.datosPuntosGanados = function () {
            $mdDialog.show({
                templateUrl: '/partials/content/asignatura/curso/info/modalPuntosGanados.html',
                locals:{
                    datos: data,
                    curso: $scope.curso
                },
                controller: 'ModalPuntosGanadosController'
            });
        };
        $scope.seleccionarEstudiante = function () {
        $mdDialog
            .show({
                templateUrl: '/partials/content/asignatura/curso/info/modalSeleccionarEstudiante.html',
                locals : {
                    datos: data,
                    curso: $scope.curso
                },
                controller: 'modalSeleccionarEstudianteController'
            })
            .then(
            function (listaPreguntaSeleccionadas) {
                respuestas(listaPreguntaSeleccionadas);
                participacion(listaPreguntaSeleccionadas);
                seleccion(listaPreguntaSeleccionadas);
		        $scope.alumnoSeleccionado = listaPreguntaSeleccionadas;
            });
        };              
    });
    var promesaRespuesta=[];
    var respuestas = function (listaPreguntaSeleccionadas) {
        var promesas =[];
        var data =[];
        var incorrectas;
        var correctas;
        var id_user;
        var rut = listaPreguntaSeleccionadas[0].rut;
        var id_curso = $scope.curso.id_curso;
        InformacionServices.estudiante({'rut':rut}).then(function (response) {
            if(response.success){
                id_user=response.result;
            } 
                var promesa9 = InformacionServices.incorrectaAlumno(id_user, id_curso).then(function (response) {
                    if(response.success){
                        incorrectas=response.result;
                    } 
                });
                promesas.push(promesa9);
                var promesa10 = InformacionServices.correctaAlumno(id_user, id_curso).then(function (response) {
                    if(response.success){
                        correctas=response.result;
                    } 
                });
                promesas.push(promesa10);
                $q.all(promesas).then(function () {
                var titulo = null;
                var total = correctas + incorrectas;
                if(correctas>0){
                    titulo = ((correctas*100)/total).toFixed(0)+'%';
                }else{
                    titulo = '0%'
                }
                $scope.dataRespuesta = [
                    {
                        key: "correctas",
                        y: correctas
                    },
                    {
                        key: "Incorrectas",
                        y: incorrectas
                    }
                ];
                $scope.opcionRespuesta = {
                    chart: {
                        type: 'pieChart',
                        color: ["#448aff","#bbdefb"],
                        height: 250,
                        donut: true,
                        x: function(d){return d.key;},
                        y: function(d){return d.y;},
                        showLabels: false,
                        pie: {
                        startAngle: function(d) {
                            return d.startAngle
                        },
                        endAngle: function(d) {
                            return d.endAngle
                        },
                        title: titulo
                    },
                    duration: 500,
                    showLegend: true
                },
                caption: {
                    enable: true,
                    text: 'De un total de '+total+' preguntas seleccionadas fue posible responder correctamente '
                    +correctas+' '
                }
                };
                });
        });
    };
    var participacion = function (listaPreguntaSeleccionadas) {
        var promesas =[];
        var data =[];
        var participacion;
        var pregunta;
        var id_user;
        var rut = listaPreguntaSeleccionadas[0].rut;
        var id_curso = $scope.curso.id_curso;
        InformacionServices.estudiante({'rut':rut}).then(function (response) {
            if(response.success){
                id_user=response.result;
            } 
                var promesa9 = InformacionServices.participacionAlumno(id_user, id_curso).then(function (response) {
                    if(response.success){
                        participacion=response.result;
                    } 
                });
                promesas.push(promesa9);
                var promesa10 = InformacionServices.preguntasRealizadas(id_curso).then(function (response) {
                    if(response.success){
                        pregunta=response.result;
                    } 
                });
                promesas.push(promesa10);
                $q.all(promesas).then(function () {
                var noParticipacion = pregunta - participacion;
                var titulo = null;
                if(participacion>0){
                    titulo = ((participacion*100)/pregunta).toFixed(0)+'%';
                }else{
                    titulo = '0%'
                }
                $scope.dataParticipacion = [
                    {
                        key: "Participación",
                        color: "#8BC34A",
                        y: participacion
                    },
                    {
                        key: "No Participación",
                        color: "#DCEDC8",
                        y: noParticipacion
                    }
                ];
                $scope.opcionParticipacion = {
                    chart: {
                        type: 'pieChart',
                        color: ["#448aff","#bbdefb"],
                        height: 250,
                        donut: true,
                        x: function(d){return d.key;},
                        y: function(d){return d.y;},
                        showLabels: false,
                        pie: {
                        startAngle: function(d) {
                            return d.startAngle
                        },
                        endAngle: function(d) {
                            return d.endAngle
                        },
                        title:titulo
                    },
                    duration: 500,
                    showLegend: true
                },
                caption: {
                    enable: true,
                    text: 'De un total de '+pregunta+' preguntas realizadas fue posible participar '
                    +participacion+' preguntas'
                }
                };
                });
        });
    };
    var seleccion = function (listaPreguntaSeleccionadas) {
        var promesas =[];
        var data =[];
        var seleccionados;
        var noSeleccionados;
        var id_user;
        var rut = listaPreguntaSeleccionadas[0].rut;
        var id_curso = $scope.curso.id_curso;
        InformacionServices.estudiante({'rut':rut}).then(function (response) {
            if(response.success){
                id_user=response.result;
            } 
                var promesa9 = InformacionServices.preguntasSeleccionada(id_user, id_curso).then(function (response) {
                    if(response.success){
                        seleccionados=response.result;
                    } 
                });
                promesas.push(promesa9);
                var promesa10 = InformacionServices.preguntasNoSeleccionada(id_user, id_curso).then(function (response) {
                    if(response.success){
                        noSeleccionados=response.result;
                    } 
                });
                promesas.push(promesa10);
                $q.all(promesas).then(function () {
                var titulo = null;
                var total = seleccionados + noSeleccionados;
                if(seleccionados>0){
                    titulo = ((seleccionados*100)/total).toFixed(0)+'%';
                }else{
                    titulo = '0%'
                }
                $scope.dataSeleccion = [
                    {
                        key: "Seleccionado",
                        y: seleccionados
                    },
                    {
                        key: "No seleccionado",
                        y: noSeleccionados
                    }
                ];
                $scope.opcionSeleccion = {
                    chart: {
                        type: 'pieChart',
                        color: ["#448aff","#bbdefb"],
                        height: 250,
                        donut: true,
                        x: function(d){return d.key;},
                        y: function(d){return d.y;},
                        showLabels: false,
                        pie: {
                        startAngle: function(d) {
                            return d.startAngle
                        },
                        endAngle: function(d) {
                            return d.endAngle
                        },
                        title:titulo
                    },
                    duration: 500,
                    showLegend: true
                },
                caption: {
                    enable: true,
                    text: 'De un total de '+total+' preguntas participadas fue seleccionado '+seleccionados+''
                }
                };
                });
        });
    };
    $scope.general=true;
    $scope.seleccionPartIntentos = [];
    var cantidadPreguntasRealizadas = 0;
    var meta = 0;
    var totalEstudiantesCurso = 0;
    var participacionActualCurso = 0;
    var participacionTotalPosibleCurso = 0;
    var resultadosPreguntas = [];
    var preguntasPartIntentos = [];
    var ganadoresxActividad = [];
    $scope.fechaInicio = new Date();
    $scope.fechaFin = new Date();
    $scope.fechaMin = new Date();
    $scope.fechaMax = new Date();
    $scope.preguntaSeleccionada=0;
    var promesasMeta = [];
    var promesasPartPromxPreg=[];
    var promesasPartPromxEst=[];
    var promesasTotalCurso = [];
    var promesasIntetosVsPart = [];
    var promesasResultadoPreguntaPorClase = [];
    var promesaGanadores = [];
    var promesasEstGrafoPuntos = [];
    var promesa1 = InformacionServices.obtenerCantidadPreguntasCursoPorEstado($scope.curso,'realizada').then(
        function (response) {
            if(response.success){
                cantidadPreguntasRealizadas = response.result.realizada;
            }
        }
    );
    promesasPartPromxPreg.push(promesa1);
    promesasMeta.push(promesa1);
    var promesa2 = InformacionServices.obtenerMetaCurso($scope.curso).then(
        function (response) {
            if(response.success){
                meta = response.result;
            }
        }
    );
    promesasMeta.push(promesa2);
    var promesa3 = InformacionServices.participacionActualCurso($scope.curso).then(function (response) {
        if(response.success){
            participacionActualCurso=response.result;
        }
    });
    promesasTotalCurso.push(promesa3);
    promesasPartPromxPreg.push(promesa3);
    promesasPartPromxEst.push(promesa3);
    var promesa4 = InformacionServices.participacionTotalPosibleCurso($scope.curso).then(function (response) {
        if(response.success){
            participacionTotalPosibleCurso=response.result;
        }
    });
    promesasTotalCurso.push(promesa4);
    var promesa5 = InformacionServices.numeroDeEstudiantesPorCurso($scope.curso).then(function (response) {
        if(response.success){
            totalEstudiantesCurso=response.result;
        }
    });
    promesasPartPromxPreg.push(promesa5);
    promesasPartPromxEst.push(promesa5);
    var promesa6 = InformacionServices.ganadoresPerdedoresNoSelecPregxCurso($scope.curso).then(function (response) {
        if(response.success){
            preguntasPartIntentos = _.cloneDeep(response.result);

            $scope.preguntasPorClase = _.chain(response.result)
                .groupBy('fecha')
                .pairs()
                .map(function (item) {
                    var obj = _.object(_.zip(["fecha", "preguntas"], item));
                    if(!_.isNull(obj.preguntas[0].descripcion)){
                        obj.descripcion=obj.preguntas[0].descripcion;
                    }
                    return obj;
                }).value();
            _.forEach(preguntasPartIntentos, function (pregunta) {
                $scope.seleccionPartIntentos.push(pregunta);
            });
        }
    });
    promesasIntetosVsPart.push(promesa6);
    var fechas=[];
    var promesasEstGrafo2=[];
    /*var promesa8 = InformacionServices.obtenerCantidadGanadores($scope.curso).then(function (response) {
       if(response.success){
                obtenerCantidadGanadores=response.result;
                console.log(obtenerCantidadGanadores);
        } 
    });
    promesaGanadores.push(promesa8);*/
    var promesa7 = InformacionServices.resultadoPreguntasPorCurso($scope.curso).then(function (response) {
        if(response.success){
            resultadosPreguntas = _.cloneDeep(response.result);

            _.forEach(response.result, function (item) {
                fechas.push(new Date(item.fecha));
            });
            if(fechas.length>0){
                $scope.fechaInicio = _.min(fechas);
                $scope.fechaMin = _.min(fechas);
                $scope.fechaFin = _.max(fechas);
                $scope.fechaMax = _.max(fechas);
            }
        }
    });
    promesasEstGrafo2.push(promesa7);
    promesasResultadoPreguntaPorClase.push(promesa7);

    $scope.nuevaSeleccionFechas = function (fechaInicio, fechaFin) {
        var backResult = _.cloneDeep(resultadosPreguntas);
        var nuevaSelccion = [];
        _.forEach(backResult, function (item) {
            var fecha = new Date(item.fecha);
            var fechamin= new Date(fechaInicio);
            var fechamax= new Date(fechaFin);
            if(fecha>=fechamin && fecha<=fechamax){
                nuevaSelccion.push(item);
            }
        });
        var valoresRspCorrectas = [];
        _.forEach(nuevaSelccion, function (clase) {
            valoresRspCorrectas[valoresRspCorrectas.length] = [
                new Date(clase.fecha),
                clase.respuestasCorrectas
            ];
        });
        var valoresRspIncorrectas = [];
        _.forEach(nuevaSelccion, function (clase) {
            valoresRspIncorrectas[valoresRspIncorrectas.length] = [
                new Date(clase.fecha),
                clase.respuestasIncorrectas
            ];
        });
        var valoresRspNoRespondidas = [];
        _.forEach(nuevaSelccion, function (clase) {
            valoresRspNoRespondidas[valoresRspNoRespondidas.length] = [
                new Date(clase.fecha),
                clase.SinRespuestas
            ];
        });
        $scope.dataGrafoGrl2 = [
            {
                "key": "Preguntas correctas",
                "color":"#ffeb3b",
                "values" : valoresRspCorrectas
            },
            {
                "key": "Preguntas incorrectas",
                "color":"#f44336",
                "values" : valoresRspIncorrectas
            },
            {
                "key": "Preguntas no respondidas",
                "color":"#b2ebf2",
                "values" : valoresRspNoRespondidas
            }
        ];
    };
    $q.all(promesasResultadoPreguntaPorClase).then(function () {
        var valoresRspCorrectas = [];
        _.forEach(resultadosPreguntas, function (clase) {
            valoresRspCorrectas[valoresRspCorrectas.length] = [
                new Date(clase.fecha),
                clase.respuestasCorrectas
            ];
        });
        var valoresRspIncorrectas = [];
        _.forEach(resultadosPreguntas, function (clase) {
            valoresRspIncorrectas[valoresRspIncorrectas.length] = [
                new Date(clase.fecha),
                clase.respuestasIncorrectas
            ];
        });
        var valoresRspNoRespondidas = [];
        _.forEach(resultadosPreguntas, function (clase) {
            valoresRspNoRespondidas[valoresRspNoRespondidas.length] = [
                new Date(clase.fecha),
                clase.SinRespuestas
            ];
        });
        $scope.optGrafoGrl2 = {
            chart: {
                type: 'multiBarChart',
                height: 450,
                margin : {
                    top: 20,
                    right: 20,
                    bottom: 30,
                    left: 40
                },
                x: function(d){return d[0];},
                y: function(d){return d[1];},
                useVoronoi: false,
                clipEdge: true,
                duration: 100,
                useInteractiveGuideline: true,
                noData: 'Sin información',
                xAxis: {
                    showMaxMin: false,
                    tickFormat: function(d) {
                        return d3.time.format('%d/%m/%Y')(new Date(d))
                    }
                },
                yAxis: {
                    tickFormat: function(d){
                        return d;
                    }
                },
                zoom: {
                    enabled: true,
                    scaleExtent: [1, 10],
                    useFixedDomain: false,
                    useNiceScale: false,
                    horizontalOff: false,
                    verticalOff: true,
                    unzoomEventType: 'dblclick.zoom'
                },
                controlOptions: [
                    "stack",
                    "stream",
                    "expand"
                ],
                style: 'stack'
            }
        };

        $scope.dataGrafoGrl2 = [
            {
                "key": "Preguntas correctas",
                "color":"#ffeb3b",
                "values" : valoresRspCorrectas
            },
            {
                "key": "Preguntas incorrectas",
                "color":"#f44336",
                "values" : valoresRspIncorrectas
            },
            {
                "key": "Preguntas no respondidas",
                "color":"#b2ebf2",
                "values" : valoresRspNoRespondidas
            }
        ];
    });
    $q.all(promesasMeta).then(function () {
        var tituloMeta = null;
        if(cantidadPreguntasRealizadas>0){
            tituloMeta = ((cantidadPreguntasRealizadas*100)/meta).toFixed(0)+'%';
        }else{
            tituloMeta = '0%'
        }
        var pregReal = null;
        if(cantidadPreguntasRealizadas>meta){
            pregReal = 0;
        }else{
            pregReal = meta-cantidadPreguntasRealizadas
        }
        $scope.dataMeta = [
            {
                key: "hechas",
                y: cantidadPreguntasRealizadas
            },
            {
                key: "No Hechas",
                y: pregReal
            }
        ];
        $scope.opcionesMeta = {
            chart: {
                type: 'pieChart',
                color: ["#448aff","#bbdefb"],
                height: 250,
                donut: true,
                x: function(d){return d.key;},
                y: function(d){return d.y;},
                showLabels: false,
                pie: {
                    startAngle: function(d) {
                        return d.startAngle
                    },
                    endAngle: function(d) {
                        return d.endAngle
                    },
                    title: tituloMeta
                },
                duration: 500,
                showLegend: true
            },
            caption: {
                enable: true,
                text: 'La meta para este curso es de realizar '+meta+' preguntas durante el semestre.'
            }
        };
    });
    $q.all(promesasTotalCurso).then(function () {
        var tituloPartCurso = null;
        if(participacionActualCurso>0){
            tituloPartCurso = ((participacionActualCurso*100)/participacionTotalPosibleCurso).toFixed(0)+'%';
        }else{
            tituloPartCurso = '0%'
        }
        $scope.dataPartTotal = [
            {
                key: "Participación actual",
                color: "#d50000",
                y: participacionActualCurso
            },
            {
                key: "Sin Participar",
                color: "#ffcdd2",
                y: (participacionTotalPosibleCurso-participacionActualCurso)
            }
        ];
        $scope.opcPartTotal = {
            chart: {
                type: 'pieChart',
                height: 250,
                noData: 'Sin información',
                donut: true,
                x: function(d){return d.key;},
                y: function(d){return d.y;},
                showLabels: false,
                pie: {
                    startAngle: function(d) {
                        return d.startAngle
                    },
                    endAngle: function(d) {
                        return d.endAngle
                    },
                    title: tituloPartCurso
                },
                duration: 500,
                showLegend: true
            },
            caption: {
                enable: true,
                text: 'De un total de '+participacionTotalPosibleCurso+' posibles participaciones, solo se registraron '
                +participacionActualCurso+' '
            }
        };
    });

    $q.all(promesasPartPromxPreg).then(function () {
        var tituloPartPromxPreg = null;
        var participacionPromedio = null;
        if(participacionActualCurso>0){
            participacionPromedio = (participacionActualCurso/cantidadPreguntasRealizadas).toFixed(0);
            tituloPartPromxPreg = participacionPromedio;
        }else{
            tituloPartPromxPreg = '0'
        }
        $scope.dataParPromxPreg = [
           {
                key: "Participantes por pregunta",
                color: "#8BC34A",
                y: participacionPromedio
            },
            {
                key: "Sin Participar",
                color: "#DCEDC8",
                y: (totalEstudiantesCurso-participacionPromedio)
            }
        ];
        $scope.opcParPromxPreg = {
            chart: {
                type: 'pieChart',
                height: 250,
                noData: 'Sin información',
                donut: true,
                x: function(d){return d.key;},
                y: function(d){return d.y;},
                showLabels: false,
                pie: {
                    startAngle: function(d) {
                        return d.startAngle
                    },
                    endAngle: function(d) {
                        return d.endAngle
                    },
                    title: tituloPartPromxPreg
                },
                duration: 500,
                showLegend: true
            },
            caption: {
                enable: true,
                text: 'De un total de '+totalEstudiantesCurso+' estudiantes, en promedio participa(n) '
                +participacionPromedio+' por pregunta.'
            }
        };
    });

    $q.all(promesasPartPromxEst).then(function () {
        var tituloPartPromxEst = null;
        var partPromxEst = null;
        if(participacionActualCurso>0){
            partPromxEst = (participacionActualCurso/totalEstudiantesCurso).toFixed(0);
            tituloPartPromxEst = partPromxEst;
        }else{
            tituloPartPromxEst = '0'
        }
        $scope.dataPartPromxEst = [
            {
                key: "Preguntas en que participa",
                color: "#FFC107",
                y: partPromxEst
            },
            {
                key: "Sin Participar",
                color: "#FFECB3",
                y: (cantidadPreguntasRealizadas-partPromxEst)
            }
        ];
        $scope.opcPartPromxEst = {
            chart: {
                type: 'pieChart',
                height: 250,
                noData: 'Sin información',
                donut: true,
                x: function(d){return d.key;},
                y: function(d){return d.y;},
                showLabels: false,
                pie: {
                    startAngle: function(d) {
                        return d.startAngle
                    },
                    endAngle: function(d) {
                        return d.endAngle
                    },
                    title: tituloPartPromxEst
                },
                duration: 500,
                showLegend: true
            },
            caption: {
                enable: true,
                text: 'De un total de '+cantidadPreguntasRealizadas+' preguntas realizadas, un estudiante participa en '
                +partPromxEst+' preguntas.'
            }
        };
    });

    $scope.deshabilitarConfig=false;
    $scope.existePreguntaEnSeleccion = function (pregunta) {
        return _.findIndex($scope.seleccionPartIntentos,{id_pregunta:pregunta.id_pregunta}) > -1;
    };
    $scope.seleccionarPregunta = function (pregunta) {
        var index = _.findIndex($scope.seleccionPartIntentos,{id_pregunta:pregunta.id_pregunta});
        if(index>-1){
            $scope.seleccionPartIntentos.splice(index,1);
            $scope.nuevaSeleccion($scope.seleccionPartIntentos);
        }else{
            $scope.seleccionPartIntentos.push(pregunta);
            $scope.nuevaSeleccion($scope.seleccionPartIntentos);
        }
    };
    $scope.seleccionarTodo = function () {
        if($scope.seleccionPartIntentos.length === preguntasPartIntentos.length){
            $scope.seleccionPartIntentos = [];
        }else{
            $scope.seleccionPartIntentos = [];
            $scope.seleccionPartIntentos = _.cloneDeep(preguntasPartIntentos);
        }
        $scope.nuevaSeleccion($scope.seleccionPartIntentos);
    };
    $scope.todasSeleccionadas = function () {
      return $scope.seleccionPartIntentos.length === preguntasPartIntentos.length;
    };

/////////////////////////////////////////////////////////7
var app = angular.module('plunker', ['nvd3']);

app.controller('MainCtrl', function($scope) {
  $scope.options = {
            chart: {
                type: 'pieChart',
                height: 500,
                x: function(d){return d.key;},
                y: function(d){return d.y;},
                showLabels: true,
                duration: 500,
                labelThreshold: 0.01,
                labelSunbeamLayout: true,
                legend: {
                    margin: {
                        top: 5,
                        right: 35,
                        bottom: 5,
                        left: 0
                    }
                }
            }
        };

        $scope.data = [
            {
                key: "One",
                y: 5
            },
            {
                key: "Two",
                y: 2
            },
            {
                key: "Three",
                y: 9
            },
            {
                key: "Four",
                y: 7
            },
            {
                key: "Five",
                y: 4
            },
            {
                key: "Six",
                y: 3
            },
            {
                key: "Seven",
                y: .5
            }
        ];
});
///////////////////////////////////////////////////
    /*
    $scope.nuevaSeleccion  = function (seleccion) {
        var ganadores = [];
        var perdedores = [];
        var noSeleccionados = [];
        _.forEach(seleccion, function (pregunta) {
            ganadores.push({label:pregunta.pregunta, value:pregunta.ganadores});
        });
        _.forEach(seleccion, function (pregunta) {
            perdedores.push({label:pregunta.pregunta, value:pregunta.perdedores});
        });
        _.forEach(seleccion, function (pregunta) {
            noSeleccionados.push({label:pregunta.pregunta, value:pregunta.noSeleccionados});
        });
        $scope.dataGrafoGrl1 = [
            {
                "key": "Ganadores",
                "color": "#90caf9",
                "values": ganadores
            },
            {
                "key": "Perdedores",
                "color": "#ef9a9a",
                "values": perdedores
            },
            {
                "key": "111111",
                "color": "#CDDC39",
                "values": noSeleccionados
            }
        ];
    };
    $q.all(promesasIntetosVsPart).then(function () {
        $scope.deshabilitarConfig=false;
        var ganadores = [];
        var perdedores = [];
        var noSeleccionados = [];
        _.forEach($scope.seleccionPartIntentos, function (pregunta) {
            ganadores.push({label:pregunta.pregunta, value:pregunta.ganadores});
        });
        _.forEach($scope.seleccionPartIntentos, function (pregunta) {
            perdedores.push({label:pregunta.pregunta, value:pregunta.perdedores});
        });
        _.forEach($scope.seleccionPartIntentos, function (pregunta) {
            noSeleccionados.push({label:pregunta.pregunta, value:pregunta.noSeleccionados});
        });
        $scope.optGrafoGrl1 = {
            chart: {
                type: 'multiBarHorizontalChart',
                height: 450,
                x: function(d){return d.label;},
                y: function(d){
                    return d.value;
                },

                showControls: false,
                stacked:false,
                showValues: true,
                showLegend: true,
                duration: 500,
                xAxis: {
                    showMaxMin: false
                },
                yAxis: {
                    axisLabel: 'Valores',
                    tickFormat: function(d){
                        return d3.format('')(d);
                    }
                },
                noData:'Sin información'
            }
        };

        $scope.dataGrafoGrl1 = [
            {
                "key": "Ganadores",
                "color": "#90caf9",
                "values": ganadores
            },
            {
                "key": "Perdedores",
                "color": "#ef9a9a",
                "values": perdedores
            },
            {
                "key": "No seleccionados123",
                "color": "#CDDC39",
                "values": noSeleccionados
            }
        ];
    });         */
    var resPartEstudiantePregRelEnCurso=[];
    var estudiantesCurso = [];
    var promesasEstGrafo1 = [];
    var prom1EstGrafo1 = InformacionServices.partEstudiantePregRelEnCurso($scope.curso).then(function (response) {
        if(response.success){
            resPartEstudiantePregRelEnCurso = _.cloneDeep(response.result);
        }
    });
    promesasEstGrafo1.push(prom1EstGrafo1);
    promesasEstGrafo2.push(prom1EstGrafo1);
    promesasEstGrafoPuntos.push(prom1EstGrafo1);
    var prom2EstGrafo1 = InformacionServices.obtenerEstudiantesPorCurso($scope.curso).then(function (response) {
        if(response.success){
            estudiantesCurso = _.cloneDeep(response.result);
        }
    });
    promesasEstGrafo1.push(prom2EstGrafo1);
    promesasEstGrafo2.push(prom2EstGrafo1);
    promesasEstGrafoPuntos.push(prom2EstGrafo1);
    var promGrafoPuntos = InformacionServices.partActvidadesxCurso($scope.curso).then(function (response) {
        if(response.success){
            ganadoresxActividad = _.cloneDeep(response.result);
        }
    });
    promesasEstGrafoPuntos.push(promGrafoPuntos);
    $q.all(promesasEstGrafoPuntos).then(function () {
        var puntosPreguntas = []
            , puntosActividades = []
            , datosTotalPuntos = [];
        _.forEach(estudiantesCurso, function (estudiante) {
            var buenas = 0;
            var actividades_ganador = 0;
            _.forEach(resPartEstudiantePregRelEnCurso, function (partPreg) {
                if(partPreg.id_user==estudiante.id_user){
                    if(partPreg.participacion=='ganador'){
                        buenas++;
                    }
                }
            });
            _.forEach(ganadoresxActividad, function (actividad) {
                if(actividad.id_user==estudiante.id_user){
                    if(actividad.participacion=='ganador'){
                        actividades_ganador++;
                    }
                }
            });
            datosTotalPuntos.push({
                rut: estudiante.rut,
                nombre: estudiante.nombre,
                apellido: estudiante.apellido,
                preguntas: buenas,
                actividades: actividades_ganador,
                totalPuntos: actividades_ganador+buenas
            });
            puntosPreguntas.push({
                x:estudiante.nombre+' '+estudiante.apellido,
                y:buenas
            });
            puntosActividades.push({
                x:estudiante.nombre+' '+estudiante.apellido,
                y:actividades_ganador
            });
        });

        deferedPuntos.resolve(datosTotalPuntos);


        $scope.optGrafoEstPuntos = {
            chart: {
                type: 'multiBarChart',
  
                height: 450,
                margin : {
                    top: 20,
                    right: 20,
                    bottom: 45,
                    left: 45
                },
                clipEdge: true,
                duration: 500,
                showControls:false,
                stacked: true,
                xAxis: {
                    axisLabel: 'Estudiantes',
                    showMaxMin: false,
                    tickFormat: function(d){
                        return d;
                    }
                },
                yAxis: {
                    axisLabelDistance: -20,
                    tickFormat: function(d){
                        return d;
                    }
                }
            }
        };
        $scope.dataGrafoEstPuntos = [
            {
                key: 'Puntos por preguntas',
                values:puntosPreguntas
            },
            {
                key: 'Puntos por actividades',
                values:puntosActividades
            }
        ];
    });
    //data grafo 2 est
    $q.all(promesasEstGrafo2).then(function () {
        var data = [];
        _.forEach(estudiantesCurso, function (estudiante) {
            var values = [];
            _.forEach(fechas, function(fecha){
                var participacion = 0;
                _.forEach(resPartEstudiantePregRelEnCurso, function (partPreg) {
                    var  fechaP = new Date(partPreg.fecha);
                    var  fechaC = new Date(fecha);
                    if(fechaP.getTime()===fechaC.getTime()){
                        if(partPreg.id_user==estudiante.id_user){
                            if(partPreg.participacion!='no participa'){
                                participacion++;
                            }
                        }
                    }
                });
                values.push({
                    x: new Date(fecha),
                    y: participacion
                });
            });

            data.push({
                    key     : estudiante.nombre+' '+estudiante.apellido,
                    values  : values
                }
            );
        });
        $scope.optGrafoEst2 = {
                chart: {
                    type: 'lineWithFocusChart',
                    height: 450,
                    margin : {
                        top: 20,
                        right: 20,
                        bottom: 60,
                        left: 40
                    },
                    duration: 50,
                    xAxis: {
                        axisLabel: 'Clases (Fecha)',
                        tickFormat: function(d){
                            return d3.time.format('%d/%m/%y')(new Date(d));
                        }
                    },
                    x2Axis: {
                        tickFormat: function(d){
                            return d3.time.format('%d/%m/%y')(new Date(d));
                        }
                    },
                    yAxis: {
                        axisLabel: 'Participación',
                        tickFormat: function(d){
                            return d;
                        },
                        rotateYLabel: false
                    },
                    y2Axis: {
                        tickFormat: function(d){
                            return d;
                        }
                    }

                }
        };
        $scope.dataGrafoEst2 = data;

    });
    var resPregRealiazadasAgrupadasxClases = [];
    var resPartPregRealiazadasAgrupadasxClases = [];
    var promesasGrafo3 = [];
    var promesaPregAgrupxClases = InformacionServices.pregRealiazadasAgrupadasxClases($scope.curso).then(function (response) {
        if(response.success){
            resPregRealiazadasAgrupadasxClases = _.cloneDeep(response.result);
            resPregRealiazadasAgrupadasxClases=_.sortByOrder(resPregRealiazadasAgrupadasxClases, 'fecha');
        }
    });
    promesasGrafo3.push(promesaPregAgrupxClases);
    var promesaPartPregAgrupxClases = InformacionServices.partPregRealiazadasAgrupadasxClases($scope.curso).then(function (response) {
        if(response.success){
            resPartPregRealiazadasAgrupadasxClases = _.cloneDeep(response.result);
            resPartPregRealiazadasAgrupadasxClases=_.sortByOrder(resPartPregRealiazadasAgrupadasxClases, 'fecha');
        }
    });
    promesasGrafo3.push(promesaPartPregAgrupxClases);
    $q.all(promesasGrafo3).then(function(){
        var valuesPregReal = [];

        _.forEach(resPregRealiazadasAgrupadasxClases, function(clase){
            valuesPregReal.push([
                new Date(clase.fecha),
                clase.preguntasRealizadas
            ]);
        });
        var valuesPartPregReal = [];

        _.forEach(resPartPregRealiazadasAgrupadasxClases, function(clase){
            var idx = _.findIndex(resPregRealiazadasAgrupadasxClases,{id_clase:clase.id_clase});
            var participacion = 0;
            if(idx>-1){
                var totalPreguntasRealizadas = resPregRealiazadasAgrupadasxClases[idx].preguntasRealizadas;
                var totalEstudiantes = estudiantesCurso.length;
                participacion = (clase.participantes / ( totalEstudiantes * totalPreguntasRealizadas))*100;
            }
            valuesPartPregReal.push([
                new Date(clase.fecha),
                //clase.participantes
                participacion
            ]);
        });
        $scope.optGrafoGrl3 = {
            chart: {
                type: 'linePlusBarChart',
                height: 500,
                margin: {
                    top: 30,
                    right: 75,
                    bottom: 50,
                    left: 75
                },
                bars: {
                    forceY: [0]
                },
                bars2: {
                    forceY: [0]
                },
                color: ['#81D4FA', '#D32F2F'],
                x: function(d,i) {
                    if(_.isUndefined(i)){
                        return (d.x)
                    }
                    return i
                },
                useInteractiveGuideline: false,
                tooltip: {
                    contentGenerator: function (e) {
                        var series = e.series[0];
                        var titulo = null;
                        var porcentaje = null;
                        if (series.value === null) return;
                        if(_.isUndefined(series.key)){
                             titulo= 'Preguntas realizadas';
                            porcentaje = '';
                        }else{
                            titulo = '% de Participación';
                            porcentaje = '%'
                        }
                        var rows =
                            "<tr>" +
                            "<td class='key'>" + 'Fecha: ' + "</td>" +
                            "<td class='x-value'>" + d3.time.format('%d/%m/%Y')(new Date(e.value)) + "</td>" +
                            "</tr>" +
                            "<tr>" +
                            "<td class='key'>" + 'Total: ' + "</td>" +
                            "<td class='x-value'><strong>" + series.value + porcentaje +"</strong></td>" +
                            "</tr>";
                        var header =
                            "<thead>" +
                            "<tr>" +
                            "<td class='legend-color-guide'><div style='background-color: " + series.color + ";'></div></td>" +
                            "<td class='key'><strong>" + titulo + "</strong></td>" +
                            "</tr>" +
                            "</thead>";
                        return "<table>" +
                            header +
                            "<tbody>" +
                            rows +
                            "</tbody>" +
                            "</table>";
                    }
                },
                xAxis: {
                    axisLabel: 'Clases (Fecha)',
                    tickFormat: function(d) {
                        var dx = $scope.dataGrafoGrl3[0].values[d] && $scope.dataGrafoGrl3[0].values[d].x || 0;
                        if(dx>0){
                            return d3.time.format('%d/%m/%Y')(new Date(dx))
                        }
                        return null
                    }
                },
                x2Axis: {
                    tickFormat: function(d) {
                        var dx = $scope.dataGrafoGrl3[0].values[d] && $scope.dataGrafoGrl3[0].values[d].x || 0;
                        return d3.time.format('%d/%m/%Y')(new Date(dx));
                    },
                    showMaxMin: false
                },
                y1Axis: {
                    axisLabel: 'Nº Preguntas Realizadas',
                    tickFormat: function(d){
                        return (d);
                    },
                    axisLabelDistance: 12
                },
                y2Axis: {
                    axisLabel: '% Participación',
                    tickFormat: function(d) {
                        return d+'%';
                    }
                },
                y3Axis: {
                    tickFormat: function(d){
                        return (d);
                    }
                },
                y4Axis: {
                    tickFormat: function(d) {
                        return (d)
                    }
                }
            }
        };
        
        $scope.dataGrafoGrl3 = [
            {
                "key" : "Preguntas realizadas" ,
                "bar": true,
                "values":valuesPregReal
            },
            {
                "key" : "Participación" ,
                "values": valuesPartPregReal
            }
        ].map(function(series) {
                series.values = series.values.map(function(d) { return {x: d[0], y: d[1] } });
                return series;
            });
    });


    $q.all(promesasGrafo3).then(function() {
        var input = _.cloneDeep(resPartEstudiantePregRelEnCurso);
        var data = _.chain(input)
            .groupBy('id_pregunta')
            .pairs()
            .map(function (item) {
                var obj = _.object(_.zip(["id_pregunta", "estudiantes"], item));
                obj.id_pregunta=Number(obj.id_pregunta);
                if(_.isUndefined(obj.name)){
                    obj.name=obj.estudiantes[0].pregunta;
                }
                var participan=[];
                var noParticipan=[];
                _.forEach(obj.estudiantes, function (estudiante) {
                    if(estudiante.participacion=='no participa'){
                        estudiante.name=estudiante.nombre+' '+estudiante.apellido;
                        estudiante.size=1;
                        noParticipan.push(estudiante);
                    }else{
                        estudiante.name=estudiante.nombre+' '+estudiante.apellido;
                        estudiante.size=1;
                        participan.push(estudiante);
                    }
                });
                var ganador=[];
                var perdedores=[];
                var noSeleccionados=[];

                var tamGanador=0;
                var tamPerdedores=0;
                var tamNoSelec=0;
                _.forEach(participan, function (participante) {
                    if(participante.participacion=='ganador'){
                        ganador.push(participante);
                        tamGanador++;
                    }else if(participante.participacion=='perdedor'){
                        perdedores.push(participante);
                        tamPerdedores++;
                    }else if(participante.participacion=='no seleccionado'){
                        noSeleccionados.push(participante);
                        tamNoSelec++;
                    }
                });
                var sizePart=tamGanador+tamPerdedores+tamNoSelec;
                var participantes = [
                    {
                        name:'Ganador',
                        size:tamGanador,
                        children:ganador
                    }
                    ,{
                        name:'Perdedores',
                        size:tamPerdedores,
                        children:perdedores
                    },{
                        name:'No seleccionados',
                        size:tamNoSelec,
                        children:noSeleccionados
                    }
                ];
                obj.children = [];
                obj.children.push({
                    name:'Participan',
                    size:sizePart,
                    children: participantes
                });
                obj.children.push({
                    name:'No Participan',
                    size:noParticipan.length,
                    children: noParticipan
                });
                return obj;
            }).value();

        if(!_.isUndefined(data[$scope.preguntaSeleccionada])){
            $scope.preguntaTitulo = data[$scope.preguntaSeleccionada].name;
        }else{
            $scope.preguntaTitulo = '';
        }

        $scope.optGrafoPreg1 = {
            chart: {
                type: 'sunburstChart',
                height: 450,
                color: d3.scale.category20c(),
                duration: 250,
                noData:'Sin informacion'
            }
        };
        $scope.dataGrafo6 = _.cloneDeep(data);

        if(!_.isUndefined(data[$scope.preguntaSeleccionada])){
            $scope.dataGrafoPreg1 = [
                data[$scope.preguntaSeleccionada]
            ];
        }else{
            $scope.dataGrafoPreg1 = [];
        }
    });
    $scope.cambiarPregunta = function (id_pregunta_seleccionada) {
        var idx=_.findIndex($scope.dataGrafo6, {'id_pregunta':id_pregunta_seleccionada});
        $scope.preguntaSeleccionada=idx;
        $scope.dataGrafoPreg1 = [
            $scope.dataGrafo6[idx]
        ];
        $scope.preguntaTitulo = $scope.dataGrafo6[idx].name;
    };

    $scope.mostrar = false;

    $timeout(function() {
	$scope.mostrar = !$scope.mostrar;
    }, 1000);

});

crsApp.controller('ResumenController', function ($scope, $stateParams, $timeout, $q, toastr, InformacionServices, CursosServices, ClasesServices) {
    var asignaturas = CursosServices.obtenerCursosLocal();
    $scope.mostrar = false;
    $scope.ultimosCursos = [];
    var defered = $q.defer();
    var promesa = defered.promise;
    _.forEach(asignaturas, function (asignatura, index) {
        $scope.ultimosCursos.push(asignatura.cursos[0]);
        if(index==asignaturas.length-1){
            defered.resolve();
        }
    });
    var metas = [];
    $q.all(promesa).then(function () {
        var numPregRealizadas = [];
        var metasCursos = [];
        _.forEach($scope.ultimosCursos, function (curso) {
            var cantidadPreguntasRealizadas=0;
            var meta=0;
            var promesa1 = InformacionServices.obtenerCantidadPreguntasCursoPorEstado(curso,'realizada').then(
                function (response) {
                    if(response.success){
                        cantidadPreguntasRealizadas = response.result.realizada;
                        numPregRealizadas.push(response.result.realizada);
                    }
                }
            );
            metas.push(promesa1);
            var promesa2 = InformacionServices.obtenerMetaCurso(curso).then(
                function (response) {
                    if(response.success){
                        meta = response.result;
                        metasCursos.push(response.result);
                    }
                }
            );
            metas.push(promesa2);
        });

        $q.all(metas).then(function () {
            _.forEach($scope.ultimosCursos, function (curso, index) {
                var tituloMeta = null;
                var cantMetaActual = null;
                if(numPregRealizadas[index]>0){
                    tituloMeta = ((numPregRealizadas[index]*100)/metasCursos[index]).toFixed(0)+'%';
                    cantMetaActual = Number(((numPregRealizadas[index]*100)/metasCursos[index]).toFixed(0));
                }else{
                    cantMetaActual = 0;
                    tituloMeta = '0%'
                }
                var pregReal = null;
                if(numPregRealizadas[index]>metasCursos[index]){
                    pregReal = 0;
                }else{
                    pregReal = metasCursos[index]-numPregRealizadas[index]
                }
                var dataMeta = [
                    {
                        key: "hechas",
                        y: numPregRealizadas[index]
                    },
                    {
                        key: "faltantes",
                        y: pregReal
                    }
                ];
                if(_.isNull(curso.meta)){
                    tituloMeta = "Sin meta"
                }
                curso.dataMeta = _.cloneDeep(dataMeta);
                var colores= [];
                if(cantMetaActual<25){
                    //rojo
                    colores=["#E53935","#EF9A9A"];
                }else if(cantMetaActual>=25 && cantMetaActual<50){
                    //naranja
                    colores=["#FB8C00","#FFCC80"];
                }else if(cantMetaActual>=50 && cantMetaActual<75){
                    //amarillo
                    colores=["#FDD835","#FFF59D"];
                }else if(cantMetaActual>=75){
                    //verde
                    colores=["#7CB342","#C5E1A5"];
                }

                var opcionesMeta = {
                    chart: {
                        type: 'pieChart',
                        color: colores,
                        height: 250,
                        donut: true,
                        x: function(d){return d.key;},
                        y: function(d){return d.y;},
                        showLabels: false,
                        pie: {
                            startAngle: function(d) {
                                return d.startAngle
                            },
                            endAngle: function(d) {
                                return d.endAngle
                            }

                        },
                        duration: 500,
                        showLegend: true,
                        title: tituloMeta
                    }

                };
                curso.opcionesMeta = _.cloneDeep(opcionesMeta);
            });

            $scope.mostrar = true;
        });
    });
});
crsApp.controller('InformacionEstudianteController', function ($scope, $stateParams, $mdSidenav, $timeout, $q, toastr, InformacionServices, CursosServices, ClasesServices, SessionServices) {
    var estudiante = SessionServices.getSessionData();
    var semestres = CursosServices.obtenerCursosLocal();
    var semestre = _.findWhere(semestres,{'ano':Number($stateParams.ano),'semestre':Number($stateParams.semestre),'grupo_curso':String($stateParams.grupo_curso)});
    $scope.curso = _.findWhere(semestre.cursos, {'id_curso': Number($stateParams.id_curso)});
    $scope._ = _;

    var misPreguntas;
    var misActividades;
    $scope.tGanador = 0;
    $scope.tPerdedor = 0;
    $scope.tNoSeleccionado = 0;
    $scope.tNoParticipa = 0;
    $scope.tGanadorActividad = 0;
    $scope.totalPreguntas = 0;
    $scope.totalActividades = 0;
    $scope.promesas = [];
    var prom1 =InformacionServices.partxEstdPregRealEnCurso($scope.curso, estudiante).then(function (response) {
        if(response.success){
            misPreguntas = _.cloneDeep(response.result);
            $scope.totalPreguntas = misPreguntas.length;
            _.forEach(misPreguntas, function (fila) {
                if(fila.participacion=='ganador'){
                    $scope.tGanador++;
                }else if(fila.participacion=='perdedor'){
                    $scope.tPerdedor++;
                }else if(fila.participacion=='no seleccionado'){
                    $scope.tNoSeleccionado++;
                }else if(fila.participacion=='no participa'){
                    $scope.tNoParticipa++;
                }
            });
        }
    });
    $scope.promesas.push(prom1);
    var prom2 =InformacionServices.partActvidadesCursoxEstudiante($scope.curso, estudiante).then(function (response) {
        if(response.success){
            misActividades = _.cloneDeep(response.result);
            _.forEach(misActividades, function (fila) {
                if(fila.estado_part_act=='ganador'){
                    $scope.tGanadorActividad++;
                }
            });
        }
    });
    $scope.promesas.push(prom2);
    var prom3 =InformacionServices.actividadesCurso($scope.curso).then(function (response) {
        if(response.success){
            $scope.totalActividades=response.result.length;
        }
    });
    $scope.promesas.push(prom3);
    var promesasEstGrafo2 = [];
    var resPartEstudiantePregRelEnCurso = [];
    var estudiantesCurso = [];
    var resultadosPreguntas = [];
    var fechas = [];
    var promesa7 = InformacionServices.resultadoPreguntasPorCurso($scope.curso).then(function (response) {
        if(response.success){
            resultadosPreguntas = _.cloneDeep(response.result);

            _.forEach(response.result, function (item) {
                fechas.push(new Date(item.fecha));
            });
            if(fechas.length>0){
                $scope.fechaInicio = _.min(fechas);
                $scope.fechaMin = _.min(fechas);
                $scope.fechaFin = _.max(fechas);
                $scope.fechaMax = _.max(fechas);
            }
        }
    });
    promesasEstGrafo2.push(promesa7);

    var prom1EstGrafo1 = InformacionServices.partEstudiantePregRelEnCurso($scope.curso).then(function (response) {
        if(response.success){
            resPartEstudiantePregRelEnCurso = _.cloneDeep(response.result);
        }
    });

    promesasEstGrafo2.push(prom1EstGrafo1);
    var prom2EstGrafo1 = InformacionServices.obtenerEstudiantesPorCurso($scope.curso).then(function (response) {
        if(response.success){
            estudiantesCurso = _.cloneDeep(response.result);
        }
    });

    promesasEstGrafo2.push(prom2EstGrafo1);

    $q.all(promesasEstGrafo2).then(function () {
        var data = [];
        var sesion = SessionServices.getSessionData();
        var values = [];
        _.forEach(fechas, function(fecha){
            var participacion = 0;
            _.forEach(resPartEstudiantePregRelEnCurso, function (partPreg) {
                var  fechaP = new Date(partPreg.fecha);
                var  fechaC = new Date(fecha);
                if(fechaP.getTime()===fechaC.getTime()){
                    if(partPreg.id_user==sesion.id_user){
                        if(partPreg.participacion!='no participa'){
                            participacion++;
                        }
                    }
                }
            });
            values.push({
                x: new Date(fecha),
                y: participacion
            });
        });

        data.push({
                key     : sesion.nombre+' '+sesion.apellido,
                values  : values
            }
        );

        $scope.optGrafoEst2 = {
            chart: {
                type: 'lineWithFocusChart',
                height: 450,
                margin : {
                    top: 20,
                    right: 20,
                    bottom: 60,
                    left: 40
                },
                duration: 50,
                xAxis: {
                    axisLabel: 'Clases (Fecha)',
                    tickFormat: function(d){
                        return d3.time.format('%d/%m/%y')(new Date(d));
                    }
                },
                x2Axis: {
                    tickFormat: function(d){
                        return d3.time.format('%d/%m/%y')(new Date(d));
                    }
                },
                yAxis: {
                    axisLabel: 'Participación',
                    tickFormat: function(d){
                        return d;
                    },
                    rotateYLabel: false
                },
                y2Axis: {
                    tickFormat: function(d){
                        return d;
                    }
                }

            }
        };
        $scope.dataGrafoEst2 = data;

    });
});
crsApp.controller('InformacionAsignaturaController', function ($scope, $stateParams, $mdSidenav, $timeout, $q, toastr, InformacionServices, CursosServices, ClasesServices, SessionServices, AsignaturasServices, PreguntasBibliotecaServices) {
    var asignaturas = CursosServices.obtenerCursosLocal();
    var asignatura = _.findWhere(asignaturas,{'asignatura':$stateParams.nombre_asignatura});
    $scope.curso = _.findWhere(asignatura.cursos, {'id_curso':Number($stateParams.id_curso)});
    $scope._ = _;
    $scope.mostrar = false;
    $scope.configurarGrafoAsig1 = function () {
        $mdSidenav('ConfigGrafoAsig1').toggle();
    };
    $scope.configurarGrafoAsig2 = function () {
        $mdSidenav('ConfigGrafoAsig2').toggle();
    };
    $scope.configurarGrafoAsig3 = function () {
        $mdSidenav('ConfigGrafoAsig3').toggle();
    };
    var participaciones=[];
    var cursosAsignatura = [];
    var promesasGrafoAsig1 = [];
    var promesas0 = [];
    var promesasGrafoAsig2 = [];
    var fullData = [];
    var prom1 = AsignaturasServices.obtenerListaCursosAsignatura(asignatura).then(function (response) {
        if(response.success){
            cursosAsignatura = _.cloneDeep(response.result);
            _.forEach(cursosAsignatura, function (curso, index) {
                var prom2 = InformacionServices.partEstudiantePregRelEnCurso(curso).then(function (response) {
                    if(response.success){
                        participaciones = _.cloneDeep(response.result);
                        fullData.push({
                            ano: curso.ano,
                            semestre: curso.semestre,
                            grupo_curso: curso.grupo_curso,
                            id_calendario: curso.id_calendario,
                            id_curso: curso.id_curso,
                            participaciones: participaciones
                        });
                    }
                });
                promesasGrafoAsig1.push(prom2);

            });
            $q.all(promesasGrafoAsig1).then(function () {
                cargarData();
            });
        }
    });
    /*var cargarGrafico = function (data) {
        console.log("Hola Ale!!");
            //console.log(dataGrafoAsig1);
        fullData=_.map(
            _.sortByOrder(fullData, ['ano', 'semestre'], ['asc', 'asc'])
        );
        var dataGanadores = [];
        var dataPerdedores = [];

        _.forEach(fullData, function (curso) {
            var totalGanadores=0;
            var ganadores=_.countBy(curso.participaciones, {participacion:'ganador'});
            if(!_.isUndefined(ganadores.true)){
                totalGanadores=ganadores.true;
            }
            dataGanadores.push({
                x: curso.ano+' Sem '+curso.semestre,
                y:totalGanadores
            });
            var totalPerdedores=0;
            var perdedores=_.countBy(curso.participaciones, {participacion:'perdedor'});
            if(!_.isUndefined(perdedores.true)){
                totalPerdedores=perdedores.true;
            }
            dataPerdedores.push({
                x: curso.ano+' Sem '+curso.semestre,
                y:totalPerdedores
            });
        });
        $scope.optGraf0 = {
            chart: {
                type: "pieChart",
                height: 500,
                showLabels: true,
                duration: 500,
                labelThreshold: 0.01,
                labelSunbeamLayout: true,
                legend: {
                    margin: {
                        top: 5,
                        right: 35,
                        bottom: 5,
                        left: 0
                    }
                },
                x: function (d){return d.key;},
                y: function (d){return d.y;},
            },

        };
        $scope.dataGraf0 = [
            {
                key: 'T.Ganadores',
                values:dataGanadores
            },
            {
                key: 'T.Perdedores',
                values:dataPerdedores
            },
        ];
    };*/
    promesasGrafoAsig1.push(prom1);
    promesasGrafoAsig2.push(prom1);
    var cargarData = function () {
        fullData=_.map(
            _.sortByOrder(fullData, ['ano', 'semestre', 'grupo_curso'], ['asc', 'asc', 'desc'])
        );
        var dataGanadores = [];
        var dataPerdedores = [];
        var dataNoSeleccionados = [];
        var dataNoParticipan = [];

        _.forEach(fullData, function (curso) {
            var totalGanadores=0;
            var ganadores=_.countBy(curso.participaciones, {participacion:'ganador'});
            if(!_.isUndefined(ganadores.true)){
                totalGanadores=ganadores.true;
            }
            dataGanadores.push({
                x: curso.ano+' Sem '+curso.semestre+' Gp '+curso.grupo_curso,
                y:totalGanadores
            });
            var totalPerdedores=0;
            var perdedores=_.countBy(curso.participaciones, {participacion:'perdedor'});
            if(!_.isUndefined(perdedores.true)){
                totalPerdedores=perdedores.true;
            }
            dataPerdedores.push({
                x: curso.ano+' Sem '+curso.semestre+' Gp '+curso.grupo_curso,
                y:totalPerdedores
            });
            var totalNoSeleccionados=0;
            var noSelec =_.countBy(curso.participaciones, {participacion:'no seleccionado'});
            if(!_.isUndefined(noSelec.true)){
                totalNoSeleccionados=noSelec.true;
            }
            dataNoSeleccionados.push({
                x: curso.ano+' Sem '+curso.semestre+' Gp '+curso.grupo_curso,
                y:totalNoSeleccionados
            });
            var totalNoParticipan=0;
            var noPart =_.countBy(curso.participaciones, {participacion:'no participa'});
            if(!_.isUndefined(noPart.true)){
                totalNoParticipan=noPart.true;
            }
            dataNoParticipan.push({
                x: curso.ano+' Sem '+curso.semestre+' Gp '+curso.grupo_curso,
                y:totalNoParticipan
            });
        });
        $scope.optGrafoAsig1 = {
            chart: {
                type: 'multiBarChart',
                height: 450,
                margin : {
                    top: 20,
                    right: 20,
                    bottom: 45,
                    left: 45
                },
                clipEdge: true,
                duration: 500,
                showControls:false,
                stacked: true,
                xAxis: {
                    axisLabel: 'Cursos',
                    showMaxMin: false,
                    tickFormat: function(d){
                        return  d;
                    }
                },
                yAxis: {
                    axisLabelDistance: -20,
                    tickFormat: function(d){
                        return d;
                    }
                }
            }
        };
        $scope.dataGrafoAsig1 = [
            {
                key: 'T.Ganadores',
                values:dataGanadores
            },
            {
                key: 'T.Perdedores',
                values:dataPerdedores
            },
            {
                key: 'T.No seleccionados',
                values:dataNoSeleccionados
            },
            {
                key: 'T.No participan',
                values:dataNoParticipan
            }
        ];

    };
    var pregBiblioteca = [];
    var prom2 = PreguntasBibliotecaServices.obtenerBibliotecaDePreguntas(asignatura).then(function (response) {
        if(response.success){
            pregBiblioteca = _.cloneDeep(response.result);
        }
    });
    promesasGrafoAsig2.push(prom2);
    var dataCursos = [];
    var total;
    $q.all(promesasGrafoAsig2).then(function () {
        var cursos=_.map(
            _.sortByOrder(cursosAsignatura, ['ano', 'semestre', 'grupo_curso'], ['asc', 'asc', 'desc'])
        );
        _.forEach(cursos, function (curso, index) {
            var promesas = [];
            var partPregBiblio = [];
            var totalEstudiantes = 0;
            var promesa1 = InformacionServices.partPregBibliotecaRealiazadasPorCurso(curso).then(function (response) {
                if(response.success){
                    partPregBiblio = _.cloneDeep(response.result);
                }
            });
            promesas.push(promesa1);
            var promesa2 = InformacionServices.numeroDeEstudiantesPorCurso(curso).then(function (response) {
                if(response.success){
                    totalEstudiantes=response.result;
                    total = totalEstudiantes;
                }
            });
            promesas.push(promesa2);
            $q.all(promesas).then(function () {
                dataCursos.push({
                    curso: curso,
                    numEstudiantes: totalEstudiantes,
                    partPregBiblio: partPregBiblio
                });
                if(index==cursos.length-1){
                    crearData();
                    crearData2();
                    //crearData3();
                    Ganadores();
                    totalParticipacion();
                }
            });

        });
    });
    var Ganadores = function () {
        var totalNoGanadores = 0;
        var totalCurso = 0;
        var promesas = [];
        var tituloGanadores = null;
        var data = [];
        var cursos=_.map(
            _.sortByOrder(cursosAsignatura, ['ano', 'semestre', 'grupo_curso'], ['asc', 'asc', 'desc'])
        );
        _.forEach(cursos, function (curso, index) {
            var obtenerCantidadNoGanadores = 0;
            var obtenerCantidadCurso = 0;
            var promesa8 = InformacionServices.obtenerCantidadNoGanadores(curso).then(function (response) {
                if(response.success){
                    obtenerCantidadNoGanadores=response.result;
                    totalNoGanadores = totalNoGanadores + obtenerCantidadNoGanadores;
                } 
            });
            promesas.push(promesa8);
            var promesa9 = InformacionServices.numeroDeEstudiantesPorCurso(curso).then(function (response) {
                if(response.success){
                    obtenerCantidadCurso=response.result;
                    totalCurso = totalCurso + obtenerCantidadCurso;
                } 
            });
            promesas.push(promesa9);
        });
        $q.all(promesas).then(function () {
            var totalGanadores;
            totalGanadores = totalCurso - totalNoGanadores
            total = totalNoGanadores+totalGanadores
            if(total>0){
                tituloGanadores = ((totalGanadores*100)/total).toFixed(0)+'%';
            }else{
                tituloGanadores = '0%'
            }
            data.push(
            {
                key: "Ganadores",
                color: "#FFC107",
                y: totalGanadores
            },
            {
                key: "No Ganadores",
                color: "#FFECB3",
                y: totalNoGanadores
            }
            );
        cargarGanadores(data, tituloGanadores);
        });
    };
    var cargarGanadores = function (data, tituloGanadores) {
        $scope.opcionGanador= {
            chart: {
                type: 'pieChart',
                color: ["#448aff","#bbdefb"],
                height: 250,
                donut: true,
                x: function(d){return d.key;},
                y: function(d){return d.y;},
                showLabels: false,
                pie: {
                    startAngle: function(d) {
                        return d.startAngle
                    },
                    endAngle: function(d) {
                        return d.endAngle
                    },
                    title: tituloGanadores
                },
                duration: 500,
                showLegend: true
            },
            caption: {
                enable: true,
                text: 'La asignatura tiene un porcentaje de '+tituloGanadores+' de ganadores'
            }
        };
        $scope.dataGanador = data;
    };
    var totalParticipacion = function(){
        var tituloParticipacion = null;
        var totalParticipacion = 0;
        var totalParticipacionCurso = 0;
        var promesas = [];
        var data = [];
        var cursos=_.map(
            _.sortByOrder(cursosAsignatura, ['ano', 'semestre', 'grupo_curso'], ['asc', 'asc', 'desc'])
        );
        _.forEach(cursos, function (curso, index) {
            var obtenerCantidadParticipacion = 0;
            var obtenerParticipacionCurso = 0;
            var promesa8 = InformacionServices.participacionActualCurso(curso).then(function (response) {
                if(response.success){
                    obtenerCantidadParticipacion=response.result;
                    totalParticipacion = totalParticipacion + obtenerCantidadParticipacion;
                } 
            });
            promesas.push(promesa8);
            var promesa9 = InformacionServices.participacionTotalPosibleCurso(curso).then(function (response) {
                if(response.success){
                    obtenerParticipacionCurso=response.result;
                    totalParticipacionCurso = totalParticipacionCurso + obtenerParticipacionCurso;
                } 
            });
            promesas.push(promesa9);
        });
        $q.all(promesas).then(function () {
            var totalNoParticipacion;
            totalNoParticipacion = totalParticipacionCurso - totalParticipacion
            total = totalNoParticipacion+totalParticipacion
            if(total>0){
                tituloParticipacion = ((totalParticipacion*100)/total).toFixed(0)+'%';
            }else{
                tituloParticipacion = '0%'
            }
            data.push(
            {
                key: "Participación",
                y: totalParticipacion
            },
            {
                key: "No Participación",
                y: totalNoParticipacion
            }
            );
            cargarParticipacion(data, tituloParticipacion);
        });
    };
    var cargarParticipacion = function(data, tituloParticipacion){
        $scope.opcionPart= {
            chart: {
                type: 'pieChart',
                color: ["#448aff","#bbdefb"],
                height: 250,
                donut: true,
                x: function(d){return d.key;},
                y: function(d){return d.y;},
                showLabels: false,
                pie: {
                    startAngle: function(d) {
                        return d.startAngle
                    },
                    endAngle: function(d) {
                        return d.endAngle
                    },
                    title: tituloParticipacion
                },
                duration: 500,
                showLegend: true
            },
            caption: {
                enable: true,
                text: 'La asignatura tiene un porcentaje de '+tituloParticipacion+' de participación'
            }
        };
         $scope.dataPart = data;
    };
    var crearData = function () {
        var data = [];
        _.forEach(pregBiblioteca, function (pregunta) {
            var values = [];
            _.forEach(dataCursos, function (curso) {
                var idx = _.findIndex(curso.partPregBiblio, {id_b_pregunta: pregunta.id_b_pregunta});
                var participacion = 0;
                if(idx>-1){
                    var part = curso.partPregBiblio[idx].participantes;
                    participacion = ((part*100)/curso.numEstudiantes);
                }
                values.push({
                    x: curso.curso.id_curso,
                    y: participacion
                });
            });
            data.push({
                key:pregunta.b_pregunta,
                values: values
            });
        });
        cargarGrafo(data);
    };
    var cargarGrafo = function (data) {
        $scope.optGrafoAsig3 = {
            chart: {
                type: 'multiBarChart',
                height: 450,
                margin : {
                    top: 20,
                    right: 20,
                    bottom: 45,
                    left: 45
                },
                clipEdge: true,
                duration: 500,
                showControls:false,
                stacked: true,
                xAxis: {
                    axisLabel: 'Cursos',
                    showMaxMin: false,
                    tickFormat: function(d){
                        var curso = _.findWhere(cursosAsignatura, {id_curso: d});
                        if(_.isUndefined(curso)){
                            return d;
                        }else{
                            return curso.ano+' Sem '+curso.semestre+' Gp '+curso.grupo_curso;
                            //return curso.ano+' Sem '+curso.semestre;
                        }
                    }
                },
                yAxis: {
                    axisLabelDistance: -20,
                    tickFormat: function(d){
                        if($scope.optGrafoAsig3.chart.stacked==false){
                            return d+'%';
                        }else{
                            return d;
                        }

                    }
                }
            }
        };
        $scope.dataGrafoAsig3 = data;
    };
    var crearData2 = function () {
        var data = [];
        _.forEach(pregBiblioteca, function (pregunta) {
            var values = [];
            var values2 = [];
            _.forEach(dataCursos, function (curso) {
                var idx = _.findIndex(curso.partPregBiblio, {id_b_pregunta: pregunta.id_b_pregunta});
                var participacion = 0;
                var fecha = 0;
                if(idx>-1){
                    var part = curso.partPregBiblio[idx].participantes;
                    participacion = ((part*100)/curso.numEstudiantes);
                    fecha = curso.partPregBiblio[idx].fecha;
                    values.push({
                        x: new Date(fecha),
                        y: participacion
                    });
                    values2.push({
                        x: new Date(fecha),
                        y: participacion,
                        curso:curso
                    });
                }

            });
            values=_.map(
                _.sortByOrder(values, ['x'], ['asc'])
            );
            data.push({
                key:pregunta.b_pregunta,
                values: values
            });
        });
        cargarGrafo2(data);
    };
    var cargarGrafo2 = function (data) {
        $scope.optGrafoAsig2 = {
            chart: {
                type: 'lineWithFocusChart',
                height: 450,
                margin : {
                    top: 20,
                    right: 20,
                    bottom: 60,
                    left: 40
                },
                duration: 50,
                useInteractiveGuideline: false,
                xAxis: {
                    axisLabel: '',
                    tickFormat: function(d){
                        return d3.time.format('%d %b %Y')(new Date(d))
                    }
                },
                x2Axis: {
                    tickFormat: function(d){
                        return d3.time.format('%d %b %Y')(new Date(d))
                    }
                },
                yAxis: {
                    axisLabel: '% de participación',
                    tickFormat: function(d){
                        return d+'% de participación';
                    },
                    rotateYLabel: false
                },
                y2Axis: {
                    tickFormat: function(d){
                        return d+'%';
                    }
                }

            }
        };
        $scope.dataGrafoAsig2 = data;
        //cargarGrafo3();
    };
    $timeout(function() {
        $scope.mostrar = !$scope.mostrar;
    }, 1000);
});

crsApp.controller('ModalPuntosGanadosController',function($scope, $mdDialog, datos, curso){
    $scope.listaEstudiantes = _.cloneDeep(datos);
    $scope.exportar = function () {
        var header = '<meta http-equiv="content-type" content="application/vnd.ms-excel; charset=UTF-8">';
        var blob = new Blob([header + document.getElementById('exportable').innerHTML], {
            type: "data:application/vnd.ms-excel;charset=UTF-8"});
        saveAs(blob, "PuntosGanados_"+curso.asignatura+"_"+curso.ano+"_Sem_"+curso.semestre+"_Gp_"+curso.grupo_curso+".xls");
    };

    $scope.cancelar = function() {
        $mdDialog.cancel();
    };
});
crsApp.controller('modalSeleccionarEstudianteController',function($scope, $stateParams, $mdSidenav, $timeout, $q, toastr, $mdDialog, datos, curso, InformacionServices){
    $scope.promesas = [];                           
    $scope.listaSeleccionEstudiante = [];
    var promesasTotalCurso = [];
    $scope.listaEstudiantes = _.cloneDeep(datos);
    var mostrarDatos = true;
    $scope.cancelar = function() {
        $mdDialog.cancel();
    }
    $scope.aceptar = function () {
        $mdDialog.hide($scope.listaSeleccionEstudiante);
    };
});
