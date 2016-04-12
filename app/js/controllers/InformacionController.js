'use strict';
crsApp.controller('InformacionController', function ($scope, $stateParams, $timeout, InformacionServices, CursosServices) {
    var asignaturas = CursosServices.obtenerCursosLocal();
    $scope.asignatura = _.findWhere(asignaturas,{'asignatura':$stateParams.nombre_asignatura});

    $scope._ = _;


    //conseguir preguntas realizadas
    //
    $scope.options = {
        chart: {
            type: 'multiBarHorizontalChart',
            height: 450,
            x: function(d){return d.label;},
            y: function(d){
                return d.value;
            },

            showControls: true,
            showValues: true,
            showLegend: true,
            duration: 500,
            xAxis: {
                showMaxMin: false
            },
            yAxis: {
                axisLabel: 'Values',
                tickFormat: function(d){
                    return d3.format('')(d);
                }
            }
        }
    };

    $scope.data = [
        {
            "key": "Intentos",
            "color": "#ef9a9a",
            "values": [
                {
                    "label" : "Preg 1" ,
                    "value" : 4
                } ,
                {
                    "label" : "Preg 2" ,
                    "value" : 3
                } ,
                {
                    "label" : "Preg 3" ,
                    "value" : 0
                } ,
                {
                    "label" : "Preg 4" ,
                    "value" : 5
                }
            ]
        },
        {
            "key": "Participantes",
            "color": "#90caf9",
            "values": [
                {
                    "label" : "Preg 1" ,
                    "value" : 7
                } ,
                {
                    "label" : "Preg 2" ,
                    "value" : 8
                } ,
                {
                    "label" : "Preg 3" ,
                    "value" : 2
                } ,
                {
                    "label" : "Preg 4" ,
                    "value" : 5
                }
            ]
        }
    ];

    $scope.opcionesGraficoMetas = {
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
            xAxis: {
                showMaxMin: false,
                tickFormat: function(d) {
                    return d3.time.format('%x')(new Date(d))
                }
            },
            yAxis: {
                tickFormat: function(d){
                    return d3.format(',.2f')(d);
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
            }
        }
    };

    $scope.dataMetas = [
        {
            "key": "Preguntas correctas",
            "color":"#dce775",
            "values" : [
                [ 1442040400000 , 5] ,
                [ 1443040400000 , 7] ,
                [ 1444040400000 , 8] ,
                [ 1445040400000 , 4] ,
                [ 1446040400000 , 10]
            ]
        },
        {
            "key": "Preguntas incorrectas",
            "color":"#ff9800",
            "values" : [
                [ 1442040400000 , 2] ,
                [ 1443040400000 , 3] ,
                [ 1444040400000 , 3] ,
                [ 1445040400000 , 7] ,
                [ 1446040400000 , 2]
            ]
        }
    ];

});
