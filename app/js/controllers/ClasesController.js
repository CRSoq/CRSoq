crsApp.controller('ClasesController', function($scope, $stateParams){
    /*
    var columnDefs = [
        {headerName: "Default String", field: "defaultString", width: 150, editable: true},
        {headerName: "Upper Case Only", field: "upperCaseOnly", width: 150, editable: true, newValueHandler: upperCaseNewValueHandler},
        {headerName: "Number", valueGetter: 'data.number', width: 150, editable: true, newValueHandler: numberNewValueHandler},
        {headerName: "Custom With Angular", field: "setAngular", width: 175, cellRenderer: customEditorUsingAngular},
        {headerName: "Custom No Angular", field: "setNoAngular", width: 175, cellRenderer: customEditorNoAngular}
    ];
*/
    $scope.titulo = $stateParams.curso;
    //get clases para el curso x
    var columnDefs = [
        {
            headerName: "Id",
            field: "id",
            width: 30,

            editable: false
        },
        {headerName: "Fecha", field: "fecha", width: 80, editable: true},
        {headerName: "Descripción", field: "descripcion", width: 400, editable: true},
        {headerName: "Módulo", field: "modulo", width: 200, editable: true},
        {
            headerName: "Sesión",
            field: "sesion",
            width: 120,
            cellStyle: {height: '40'},
            editable: false,
            cellRenderer: sesionCellRendererFunc}
    ];
    var data = [
        {id: '1', fecha: '10/10/15', descripcion: 'Clase de presentación del programa', modulo: 'Introducción'},
        {id: '2', fecha: '13/10/15', descripcion: 'Que es algo...', modulo: 'Introducción'}
    ];
    $scope.gridOptions = {
        columnDefs: columnDefs,
        rowData: data,
        rowHeight: 40,
        angularCompileRows: true,
        enableColResize: true
    };

    $scope.newRow = function(){
        console.log("new");
        var row =
        {

        };
        data.push(row);
        $scope.gridOptions.api.setRowData(data);
    };

    function sesionCellRendererFunc(params) {
        params.$scope.play = play;
        params.$scope.del = del;
        return '' +
            '<div style="text-align: center; font-size: 11px">' +
            '<span  class="fa-stack fa-lg">' +
            '<i class="fa fa-play-circle fa-2x" style="color:#4CC417" ui-sref="crsApp.cursosSemestre.clases.sesion()"></i>' +
            '</span>' +
            '<span class="fa-stack fa-lg">' +
            '<i class="fa fa-circle fa-stack-2x"></i>' +
            '<i class="fa fa-pencil fa-stack-1x fa-inverse"></i>' +
            '</span>' +
            '<span  class="fa-stack fa-lg">' +
            '<i class="fa fa-minus-circle fa-2x" style="color:#FF0000" ng-click="del()"></i>' +
            '</span>' +
            '</div>';
    }

    function play(id) {
        window.alert("Play !!"+id);
    }

    function del() {
        window.alert("Delete !!");
    }
});