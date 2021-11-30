crsApp.controller('EquiposController', function($scope, $rootScope, $mdDialog, $q, $state, $stateParams, toastr, EquiposServices, CursosServices, SessionServices, SocketServices){
    $scope.listaEquipos = [];
    $scope.promesas = [];

    $scope.equipoAlumno = null;
    $scope.listaEquipoAlumno = [];

    if($rootScope.user.tipo=='profesor'){
        var asignaturas = CursosServices.obtenerCursosLocal();
        var asignatura = _.findWhere(asignaturas,{'asignatura':$stateParams.nombre_asignatura});
        var curso = _.findWhere(asignatura.cursos, {'id_curso':Number($stateParams.id_curso)});
    }else if($rootScope.user.tipo='estudiante'){
        var semestres = CursosServices.obtenerCursosLocal();
        var semestre = _.findWhere(semestres,{'ano':Number($stateParams.ano),'semestre':Number($stateParams.semestre),'grupo_curso':String($stateParams.grupo_curso)});
        var curso = _.findWhere(semestre.cursos, {'id_curso': Number($stateParams.id_curso)});

        var dat = {
            id_curso: curso.id_curso,
            id_user: $rootScope.user.id_user
        };
        EquiposServices.obtenerEquipoAlumno(dat)
            .then(function (response) {
                if(response.success){
                    $scope.equipoAlumno = _.isArray(response.result) ? response.result[0] : response.result;
                    EquiposServices.obtenerAlumnos($scope.equipoAlumno)
                    .then(function (response){
                        if(response.success){
                                $scope.listaEquipoAlumno = response.result;
                            } else {
                                toastr.error('No se pudo obtener alumnos del equipo del alumno: '+response.err.code,'Error');
                            }
                        });
                }else{
                    toastr.error('No se pudo obtener el equipo del alumno: '+response.err.code,'Error');
                }
            });
    }
    $scope.curso = _.cloneDeep(curso);
    $scope.selected = [];

    $scope.title = "";
    $scope.editingTitle = false;
    $scope.editingIndex = -1;

    EquiposServices.obtenerEquipos(curso)
        .then(function (response) {
            if(response.success){
                $scope.listaEquipos = response.result;
            }else{
                toastr.error('No se pudo actualizar el equipo: '+response.err.code,'Error');
            }
        });

    $scope.gestionarAlumnos = function(equipo) {
        $mdDialog.show({
            templateUrl: '/partials/content/asignatura/curso/equipos/modalEdicionAlumnos.html',
            locals : {
                curso: $scope.curso,
                equipo: equipo
            },
            controller: 'ModalEdicionAlumnosController'
        })
            .then(function (response) {
                var alumnosFixed = [];
                _.forEach(response.alumnos, function(o){
                    var obj = _.omit(o, ['selected']);
                    alumnosFixed.push(obj);
                });
                var data = {
                    equipo: response.equipo,
                    alumnos: alumnosFixed
                };
                EquiposServices.actualizarAlumnos(data)
                    .then(function (response){
                        if(response.success){
                            SocketServices.emit('actualizarEquipo', $scope.curso);
                            toastr.success('Alumnos actualizados correctamente');
                        }else{
                            toastr.error('No se pudo actualizar los alumnos del equipo: '+response.err.code,'Error');
                        }
                    });
                
            });
    };
    
    $scope.agregarEquipo = function (curso) {
        var equipo = {
            'id_equipo': null,
            'id_curso': curso.id_curso,
            'nombre_equipo': 'Equipo nuevo',
        };

        EquiposServices.crearEquipo(equipo)
            .then(function (response) {
                if(response.success){
                    equipo.id_equipo = response.id_equipo;
                    $scope.listaEquipos.push(equipo);
                }else{
                    toastr.error('No se pudo crear equipo: '+response.err.code,'Error');
                }
            });
    };

    /*
    $scope.guardarEquipo = function (equipo) {

        if(_.isUndefined(equipo.nuevo)){
            $scope.promesas = EquiposServices.actualizarEquipo(equipo)
                .then(function (response) {
                    if(response.success){
                        equipos.edicion = false;
                        toastr.success('Equipo actualizado correctamente');
                        SocketServices.emit('actualizarListaEquipo', curso);
                    }else{
                        toastr.error('No se pudo actualizar el equipo: '+response.err.code,'Error');
                    }
                });
        }else{
            delete equipo['nuevo'];
            $scope.promesas = EquiposServices.crearEquipo(equipo)
                .then(function (response) {
                    if(response.success){
                        equipo.edicion = false;
                        equipo.id_equipo = response.id_equipo;
                        SocketServices.emit('actualizarListaEquipo', curso);
                        toastr.success('Equipo creado correctamente');
                    }else{
                        toastr.error('No se pudo crear el equipo: '+response.err.code,'Error');
                    }
                });
        }
    };*/
    /*
    $scope.cancelarEquipo = function (equipo, index) {
        $scope.listaEquipos.splice(index, 1);
    };
    */

    $scope.editarNombreEquipo = function(equipo, index) {
        $scope.editingIndex = index;
        $scope.title = equipo.nombre_equipo;
        $scope.editingTitle = true;
    }

    $scope.guardarNombreEquipo = function(title, index) {
        if($scope.listaEquipos[index].nombre_equipo == title) {
            $scope.editingIndex = -1;
            $scope.editingTitle = false;

            return;
        }

        $scope.listaEquipos[index].nombre_equipo = title;

        EquiposServices.actualizarEquipo($scope.listaEquipos[index])
            .then(function (response) {
                if(response.success){
                    toastr.success('Nombre actualizado correctamente!');
                }else{
                    toastr.error('No se pudo actualizar el nombre de equipo: '+response.err.code,'Error');
                }
            });

        $scope.editingIndex = -1;
        $scope.title = "";
        $scope.editingTitle = false;
    }

    /*$scope.eliminarEquipo = function (equipo) {
        $mdDialog.show({
            templateUrl: '/partials/content/asignatura/curso/clases/modalEliminarEquipo.html',
            locals : {
                fecha: clase.fecha,
                modulo: clase.modulo,
                descripcion: clase.descripcion,
                estado_sesion: clase.estado_sesion
            },
            controller: 'ModalEliminarClaseController'
            })
            .then(
            function () {
                ClasesServices.eliminarClase(clase).then(
                    function (response) {
                        if(response.success){
                            toastr.success('Clase eliminada.');
                            SocketServices.emit('actualizarListaClase', curso);
                            $scope.listaClases.splice(_.findIndex($scope.listaClases,{'id_clase':clase.id_clase}), 1);
                        }else{
                            toastr.error('No se pudo eliminar la clase: '+response.err.code,'Error.');
                        }
                    }
                );
            });
    };*/
    
    $rootScope.$on('actualizarEquipoAlumno', function () {
        if($rootScope.user.tipo=='estudiante'){
            var dat = {
                id_curso: $scope.curso.id_curso,
                id_user: $rootScope.user.id_user
            };
            EquiposServices.obtenerEquipoAlumno(dat)
                .then(function (response) {
                    if(response.success){
                        $scope.equipoAlumno = _.isArray(response.result) ? response.result[0] : response.result;
                        EquiposServices.obtenerAlumnos($scope.equipoAlumno)
                        .then(function (response){
                            if(response.success){
                                    $scope.listaEquipoAlumno = response.result;
                                    toastr.success('Equipo sincronizado');
                                } else {
                                    toastr.error('No se pudo obtener alumnos del equipo del alumno: '+response.err.code,'Error');
                                }
                            });
                    }else{
                        toastr.error('No se pudo obtener el equipo del alumno: '+response.err.code,'Error');
                    }
                });
        }

    });
    
});

/*crsApp.controller('ModalEliminarClaseController',function($scope, $mdDialog, ClasesServices, fecha, descripcion, modulo, estado_sesion){
    $scope.fecha=fecha;
    $scope.descripcion=descripcion;
    $scope.modulo=modulo;
    $scope.estado_sesion=estado_sesion;

    $scope.cancelar = function() {
        $mdDialog.cancel();
    };

    $scope.aceptar = function() {
        $mdDialog.hide();
    };
});*/


/*crsApp.controller('modalSesionCerradaController',function($scope, $mdDialog){
    $scope.cancelar = function() {
        $mdDialog.cancel();
    };

    $scope.aceptar = function(opcion) {
        $mdDialog.hide(opcion);
    };
});*/
/*
crsApp.controller('ModalEdicionEquipoController',function($scope, $mdDialog, equipo){
    $scope.equipo= _.cloneDeep(equipo);
    $scope.cancelar = function() {
        $mdDialog.cancel();
    };

    $scope.aceptar = function() {
        $mdDialog.hide($scope.equipo);
    };
});
*/

crsApp.controller('ModalEdicionAlumnosController', function($scope, $mdDialog, $q, curso, equipo, toastr, EquiposServices) {
    $scope.curso = _.cloneDeep(curso);
    $scope.equipo = _.cloneDeep(equipo);
    $scope.listaAlumnos = [];
    $scope.listaAlumnosSinEquipo = [];
    $scope.AlumnosSel = 0;
    $scope.AlumnosSESel = 0;
    $q.when(EquiposServices.obtenerAlumnos($scope.equipo))
        .then(function (response){
            if(response.success){
                _.forEach(response.result, function (o) {
                    var item = o;
                    _.assign(item, {selected: false});
                    $scope.listaAlumnos.push(item);
                });
            } else {
                toastr.error('No se pudo obtener alumnos del equipo: '+response.err.code,'Error');
            }
        });

    $q.when(EquiposServices.obtenerAlumnosSinEquipo($scope.curso))
        .then(function (response){
            if(response.success){
                _.forEach(response.result, function (o) {
                    var item = o;
                    _.assign(item, {selected: false});
                    _.assign(item, {estado_part: 'Disponible'});
                    $scope.listaAlumnosSinEquipo.push(item);
                });
            } else {
                toastr.error('No se pudo obtener alumnos sin equipo: '+response.err.code,'Error');
            }
        });
    
    $scope.toggleAlumno = function(index) {
        if($scope.listaAlumnos[index].selected) {
            $scope.listaAlumnos[index].selected = false;
            $scope.AlumnosSel--;
        } else {
            $scope.listaAlumnos[index].selected = true;
            $scope.AlumnosSel++;
        }
    };

    $scope.toggleAlumno2 = function(index) {
        if($scope.listaAlumnosSinEquipo[index].selected) {
            $scope.listaAlumnosSinEquipo[index].selected = false;
            $scope.AlumnosSESel--;
        } else {
            $scope.listaAlumnosSinEquipo[index].selected = true;
            $scope.AlumnosSESel++;
        }
    };

    $scope.agregarAlumno = function() {
        if($scope.AlumnosSESel < 1)
            return;
        
        var removedItems = _.remove($scope.listaAlumnosSinEquipo, function(o) {
            if(o.selected){
                o.selected = false;
                return true;
            }
            return false;
        });

        $scope.listaAlumnos = _.union($scope.listaAlumnos, removedItems);
    };

    $scope.quitarAlumno = function() {
        if($scope.AlumnosSel < 1)
            return;
            
        var removedItems = _.remove($scope.listaAlumnos, function(o) {
            if(o.selected){
                o.selected = false;
                return true;
            }
            return false;
        });

        $scope.listaAlumnosSinEquipo = _.union($scope.listaAlumnosSinEquipo, removedItems);
    };
    
    $scope.cancelar = function() {
        $mdDialog.cancel();
    };

    $scope.aceptar = function() {
        $mdDialog.hide({ equipo: $scope.equipo, alumnos: $scope.listaAlumnos});
    };
});
