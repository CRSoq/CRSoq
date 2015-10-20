crsApp.controller('SesionController', function($scope){
    var width = calcula();
    function calcula(){
        var tabla=document.getElementById("tablaSesion").clientWidth;
        return tabla-82
    }
    var columnDefs = [
        {
            headerName: "Preguntas",
            field: "pregunta",
            width: width,
            editable: true
        },
        {
            headerName: "Edición",
            field: "edicion",
            width: 80,
            cellStyle: {height: '40'},
            editable: false,
            cellRenderer: edicionCellRendererFunc
        }
    ];
    var data = [
        {

        }
    ];
    $scope.gridOptions = {
        columnDefs: columnDefs,
        rowData: data,
        rowHeight: 40,
        angularCompileRows: true,
        enableColResize: true
    };

    $scope.newRow = function(){
        var row =
        {

        };
        data.push(row);
        var height = calcula();
        function calcula(){
            var tabla=document.getElementById("listaPreguntas").clientHeight;
            return tabla+40
        }
        angular.element(document.querySelector('tablaSesion')).css({height:height});
        $scope.gridOptions.api.setRowData(data);
    };
    function edicionCellRendererFunc(){}
});
