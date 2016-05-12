'use strict';
crsApp.controller('InformacionController', function ($scope, $stateParams, $mdSidenav, $timeout, $q, toastr, InformacionServices, CursosServices, ClasesServices) {
    var asignaturas = CursosServices.obtenerCursosLocal();
    var asignatura = _.findWhere(asignaturas,{'asignatura':$stateParams.nombre_asignatura});
    $scope.curso = _.findWhere(asignatura.cursos, {'id_curso':Number($stateParams.id_curso)});
    $scope._ = _;

    $scope.configurarGrafico = function () {
        $mdSidenav('right').toggle();
    };
    $scope.configurarGrafico2 = function () {
        $mdSidenav('configGraf2').toggle();
    };
    $scope.configurarGrafico4 = function () {
        $mdSidenav('configGraf4').toggle();
    };
    $scope.configurarGrafico6 = function () {
        $mdSidenav('configGraf6').toggle();
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
                type: 'stackedAreaChart',
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
                key: "faltantes",
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

    $scope.deshabilitarConfig=true;
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
                "key": "No seleccionados",
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
                "key": "No seleccionados",
                "color": "#CDDC39",
                "values": noSeleccionados
            }
        ];
    });
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
    var prom2EstGrafo1 = InformacionServices.obtenerEstudiantesPorCurso($scope.curso).then(function (response) {
        if(response.success){
            estudiantesCurso = _.cloneDeep(response.result);
        }
    });
    promesasEstGrafo1.push(prom2EstGrafo1);
    promesasEstGrafo2.push(prom2EstGrafo1);
    $q.all(promesasEstGrafo1).then(function () {
        var valBuenas = [];
        var valMalas = [];
        var valNoSel = [];
        var valNoPart = [];
        _.forEach(estudiantesCurso, function (estudiante) {
            var buenas = 0;
            var malas = 0;
            var noSel = 0;
            var noPart = 0;
            _.forEach(resPartEstudiantePregRelEnCurso, function (partPreg) {
                if(partPreg.id_user==estudiante.id_user){
                    if(partPreg.participacion=='ganador'){
                        buenas++;
                    }else if(partPreg.participacion=='perdedor'){
                        malas++;
                    }else if(partPreg.participacion=='no seleccionado'){
                        noSel++;
                    }else if(partPreg.participacion=='no participa'){
                        noPart++;
                    }
                }
            });
            valBuenas.push({
                x:estudiante.nombre+' '+estudiante.apellido,
                y:buenas
            });
            valMalas.push({
                x:estudiante.nombre+' '+estudiante.apellido,
                y:malas
            });
            valNoSel.push({
                x:estudiante.nombre+' '+estudiante.apellido,
                y:noSel
            });
            valNoPart.push({
                x:estudiante.nombre+' '+estudiante.apellido,
                y:noPart
            });
        });

        $scope.optGrafoEst1 = {
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
                    axisLabel: 'Estudiante',
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
        $scope.dataGrafoEst1 = [
            {
                key: 'T.Correctas',
                values:valBuenas
            },
            {
                key: 'T.Malas',
                values:valMalas
            },
            {
                key: 'T.No Selec',
                values:valNoSel
            },
            {
                key: 'T.No Part',
                values:valNoPart
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
                        axisLabel: 'X Axis',
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
                        axisLabel: 'Y Axis',
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
            valuesPartPregReal.push([
                new Date(clase.fecha),
                clase.participantes
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
                        if (series.value === null) return;
                        var titulo = (_.isUndefined(series.key)) ? 'Preguntas realizadas':series.key;
                        var rows =
                            "<tr>" +
                            "<td class='key'>" + 'Fecha: ' + "</td>" +
                            "<td class='x-value'>" + d3.time.format('%d/%m/%Y')(new Date(e.value)) + "</td>" +
                            "</tr>" +
                            "<tr>" +
                            "<td class='key'>" + 'Total: ' + "</td>" +
                            "<td class='x-value'><strong>" + series.value + "</strong></td>" +
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
                        return d3.time.format('%d/%m/%Y')(new Date(dx))
                        //return d3.time.format('%b-%Y')(new Date(dx))
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
                    axisLabel: 'Nº Participaciones',
                    tickFormat: function(d) {
                        return (d)
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
    var semestre = _.findWhere(semestres,{'ano':Number($stateParams.ano),'semestre':Number($stateParams.semestre)});
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
    var participaciones=[];
    var cursosAsignatura = [];
    var promesasGrafoAsig1 = [];
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
    promesasGrafoAsig1.push(prom1);
    promesasGrafoAsig2.push(prom1);
    var cargarData = function () {
        //console.log(dataGrafoAsig1);
        fullData=_.map(
            _.sortByOrder(fullData, ['ano', 'semestre'], ['asc', 'asc'])
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
            var totalNoSeleccionados=0;
            var noSelec =_.countBy(curso.participaciones, {participacion:'no seleccionado'});
            if(!_.isUndefined(noSelec.true)){
                totalNoSeleccionados=noSelec.true;
            }
            dataNoSeleccionados.push({
                x: curso.ano+' Sem '+curso.semestre,
                y:totalNoSeleccionados
            });
            var totalNoParticipan=0;
            var noPart =_.countBy(curso.participaciones, {participacion:'no participa'});
            if(!_.isUndefined(noPart.true)){
                totalNoParticipan=noPart.true;
            }
            dataNoParticipan.push({
                x: curso.ano+' Sem '+curso.semestre,
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
    var prom3 = PreguntasBibliotecaServices.obtenerBibliotecaDePreguntas(asignatura).then(function (response) {
        if(response.success){
            pregBiblioteca = _.cloneDeep(response.result)
        }
    });
    promesasGrafoAsig2.push(prom3);

    $q.all(promesasGrafoAsig2).then(function () {
        _.forEach(pregBiblioteca, function (pregunta) {
            _.forEach(fullData, function (curso) {
                var dataPB = _.filter(curso.participacion, {id_b_pregunta: pregunta.id_b_pregunta});
                var ganador = 0;
                var perdedores = 0;
                var noSelec = 0;
                var noPart = 0;
                _.forEach(dataPB, function (pB) {
                    if(pB.participacion=='ganador'){
                        ganador++;
                    }else if(pB.participacion=='perdedor'){
                        perdedores++;
                    }else if(pB.participacion=='no seleccionado'){
                        noSelec++;
                    }else if(pB.participacion=='no participa'){
                        noPart++;
                    }
                });
                var participacion = ganador+perdedores+noSelec;

            });

        });
    });
    $timeout(function() {
        $scope.mostrar = !$scope.mostrar;
    }, 1000);
});