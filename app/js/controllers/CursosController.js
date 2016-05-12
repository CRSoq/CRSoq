crsApp.controller('CursosController', function($scope, $rootScope, $mdDialog, $stateParams, toastr, CursosServices, CalendarioServices, AsignaturasServices, SessionServices) {
    $scope.crearCurso = function () {
        $mdDialog.show({
            templateUrl: '/partials/content/main/modalCrearCurso.html',
            controller: 'ModalCrearCursoController'
        })
            .then(
            function (curso) {
                CursosServices.crearCurso(curso)
                    .then(function (response) {
                        $rootScope.$emit('actualizarControladores');
                        toastr.success('Curso creado');
                    }, function (error) {
                        toastr.error('No se pudo crear el curso: '+error.err.code,'Error');
                    });
            },function () {
            });
    };
});

crsApp.controller('ModalCrearCursoController', function ($scope, $mdDialog, toastr, SessionServices, CalendarioServices, AsignaturasServices) {
    $scope.curso = {};
    $scope.asignaturas = [];
    $scope.anos = [];
    $scope.semestres = [];
    $scope.asignaturaSeleccionada = {};
    $scope.anoSeleccionado = {};
    $scope.semestreSeleccionado = {};
    $scope.calendario = [];
    $scope.Asignatura=true;
    $scope.Ano=true;

    AsignaturasServices.obtenerAsignaturas()
        .then(function (response) {
            if(response.success){
                $scope.asignaturas = _.cloneDeep(response.result);
            }else{
                toastr.error('No se obtuvieron las asignaturas: '+response.err.code,'Error');
            }
        });

    CalendarioServices.obtenerCalendario()
        .then(function (response) {
            if(response.success){
                $scope.anos = _.cloneDeep(response.result);
                $scope.anos = _.chain($scope.anos)
                    .groupBy('ano')
                    .pairs()
                    .map(function (item) {
                        return _.object(_.zip(['ano', 'semestres'], item));
                    })
                    .value();
                $scope.anos=_.map(_.sortByOrder($scope.anos, ['ano'], ['desc']));
            }else{
                toastr.error('No se obtuvo el calendario: '+response.err.code,'Error');
            }

        });

    $scope.cargarAsignatura = function () {
        $scope.Asignatura=false;
    };

    $scope.cargarSemestre = function (ano) {
        $scope.semestres = _.cloneDeep(ano.semestres);
        $scope.semestres = _.chain($scope.semestres)
            .groupBy('semestre')
            .pairs()
            .map(function (item) {
                return _.object(_.zip(['semestre', 'calendario'], item));
            })
            .value();
        $scope.semestres=_.map(_.sortByOrder($scope.semestres, ['semestre'], ['desc']));
        $scope.Ano=false;
    };

    $scope.guardarCalendario = function (calendario) {
        if(!_.isUndefined(calendario)){
            $scope.calendario = _.cloneDeep(calendario[0]);
        }
    };

    $scope.aceptar = function () {
        var dataUsuario = SessionServices.getSessionData();
        $scope.curso = {
            nombre_curso    : $scope.asignaturaSeleccionada.nombre_asignatura,
            id_asignatura   : $scope.asignaturaSeleccionada.id_asignatura,
            id_calendario   : $scope.calendario.id_calendario,
            ano             : $scope.calendario.ano,
            semestre        : $scope.calendario.semestre,
            id_user         : dataUsuario.id_user
        };
        if(_.isUndefined($scope.curso.nombre_curso) || _.isUndefined($scope.curso.id_calendario) ){
            toastr.error('Todos los campos son obligatorios','Error');
        }else{
            $mdDialog.hide($scope.curso);
        }
    };

    $scope.cancelar = function() {
        $mdDialog.cancel();
    };

});

crsApp.controller('CursoGralInfoController', function ($scope, $rootScope, $stateParams, CursosServices) {
    if($rootScope.user.tipo=='profesor'){
        obtenerInfo();
    }else if($rootScope.user.tipo='estudiante'){
        obtenerInfoEstudiante();
    }

    $rootScope.$on('actualizarControladores', function () {
        if($rootScope.user.tipo=='profesor'){
            obtenerInfo();
        }else if($rootScope.user.tipo=='estudiante'){
            obtenerInfoEstudiante();
        }
    });

    function obtenerInfo(){
        var asignaturas = CursosServices.obtenerCursosLocal();
        var asignatura = _.findWhere(asignaturas,{'asignatura':$stateParams.nombre_asignatura});
        $scope.curso = _.findWhere(asignatura.cursos, {'id_curso': Number($stateParams.id_curso)});
    }
    function obtenerInfoEstudiante(){
        var semestres = CursosServices.obtenerCursosLocal();
        var semestre = _.findWhere(semestres,{'ano':Number($stateParams.ano),'semestre':Number($stateParams.semestre)});
        $scope.curso = _.findWhere(semestre.cursos, {'id_curso': Number($stateParams.id_curso)});
    }
});

crsApp.controller('ConfigCursoController', function ($scope, $rootScope, $state, $stateParams, $mdDialog, toastr, CursosServices, ModulosServices, ClasesServices, SessionServices, EstudiantesServices) {
    var asignaturas = CursosServices.obtenerCursosLocal();
    var asignatura = _.findWhere(asignaturas,{'asignatura':$stateParams.nombre_asignatura});
    var curso = _.findWhere(asignatura.cursos, {'id_curso':Number($stateParams.id_curso)});
    $scope.curso= _.cloneDeep(curso);
    $scope._ = _;
    $scope.modulos = [];
    $scope.modulosEditados = [];
    $scope.cambio = false;

    var normalize = (function() {
        var from = "ÃÀÁÄÂÈÉËÊÌÍÏÎÒÓÖÔÙÚÜÛãàáäâèéëêìíïîòóöôùúüûÑñÇç",
            to   = "AAAAAEEEEIIIIOOOOUUUUaaaaaeeeeiiiioooouuuunncc",
            mapping = {};

        for(var i = 0, j = from.length; i < j; i++ )
            mapping[ from.charAt( i ) ] = to.charAt( i );

        return function( str ) {
            var ret = [];
            for( var i = 0, j = str.length; i < j; i++ ) {
                var c = str.charAt( i );
                if( mapping.hasOwnProperty( str.charAt( i ) ) )
                    ret.push( mapping[ c ] );
                else
                    ret.push( c );
            }
            return ret.join( '' );
        }

    })();

    var callbackModulos = function (response) {
            if(response.result.length>0){
                $scope.modulos= _.cloneDeep(response.result);
                $scope.modulos= _.map(_.sortByOrder($scope.modulos,['posicion'],['asc']));
            }else {
                $scope.agregarModulo();
            }
    };

    var callBackModulosError = function (error) {
        toastr.error(error.err.code,'Error módulos');
    };
    ModulosServices.obtenerModulos(curso)
        .then(callbackModulos,callBackModulosError);

    $scope.agregarModulo = function () {
        var modulo = {
            'nombre_modulo': '',
            'posicion': $scope.modulos.length+1,
            'id_curso': curso.id_curso,
            'nuevo':true,
            'edicion':true
        };
        $scope.modulos.push(modulo);
    };

    $scope.guardarModulo = function (modulo) {
        if (!_.isEmpty(modulo.nombre_modulo)) {
            if (_.isUndefined(modulo.nuevo)) {
                ModulosServices.actualizarModulo(modulo).then(
                    function (response) {
                        //hacer resplandor en el modulo actualizado
                        toastr.success('Módulo actualizado de manera satisfactoria.');
                        modulo.edicion = false;
                        $scope.modulos = _.map(_.sortByOrder($scope.modulos, ['posicion'], ['asc']));
                    }, function (error) {
                        toastr.error('No se pudo actualizar el módulo: ' + error.err.code, 'Error');
                    }
                );
            } else {
                ModulosServices.crearModulo(modulo).then(
                    function (response) {
                        modulo.id_modulo = response.id_modulo;
                        delete modulo['nuevo'];
                        modulo.edicion = false;
                        toastr.success('Módulo creado de manera satisfactoria.');
                        $scope.modulos = _.map(_.sortByOrder($scope.modulos, ['posicion'], ['asc']));
                        $rootScope.$emit('actualizarControladores');
                    }, function (error) {
                        toastr.error('No se pudo crear el módulo: ' + error.err.code, 'Error');
                    }
                );
            }
        }else{
            toastr.warning('Debe ingresar el nombre del módulo.');
        }
    };
    $scope.cancelarModulo = function (modulo, indice) {
        if(_.isUndefined(modulo.nuevo)){
            $scope.modulos[indice] = _.cloneDeep(_.findWhere($scope.modulosEditados, {'id_modulo':modulo.id_modulo}));
            $scope.modulosEditados.splice(indice,1);
            $scope.modulos[indice].edicion = false;
            $scope.modulos= _.map(_.sortByOrder($scope.modulos,['posicion'],['asc']));
        }else{
            $scope.modulosEditados.splice(indice,1);
            $scope.modulos.splice(indice,1);
        }
    };
    $scope.eliminarModulo = function (modulo, indice) {
        ClasesServices.contarClasesPorModulo(modulo).then(
            function (response) {
                if(response.result>0){
                    $mdDialog.show({
                        templateUrl: '/partials/content/asignatura/curso/config/modalEliminarModulo.html',
                        locals : {
                            nombre_modulo: modulo.nombre_modulo
                        },
                        controller: 'ModalEliminarModuloController'
                    });
                }else{
                    ModulosServices.eliminarModulo(modulo).then(
                        function (response) {
                            $scope.modulos.splice(indice,1);
                            toastr.success('Módulo eliminado de manera satisfactoria.');
                            $scope.modulos= _.map(_.sortByOrder($scope.modulos,['posicion'],['asc']));
                        }, function (error) {
                            toastr.error('No se pudo eliminar el módulo: '+error.err.code,'Error');
                        }
                    );
                }
            }, function (error) {
                toastr.error('No se pudo eliminar el módulo: '+error.err.code,'Error');
            }
        );
    };

    $scope.editarModulo = function (modulo) {
        var moduloSinEditar = _.cloneDeep(modulo);
        $scope.modulosEditados.push(moduloSinEditar);
        modulo.edicion = true;
    };

    //alumnos
    $scope.generarUsuario = true;
    $scope.generarClave = true;
    $scope.sugerencia = true;
    $scope.guardar = false;

    EstudiantesServices.obtenerEstudiantesPorCurso(curso)
        .then(function (response) {
            $scope.listaEstudiantes= _.cloneDeep(response.result);
        }, function (error) {
            toastr.error('No se pudo conseguir lista de estudiantes: '+error.err.code,'Error.');
        });
    $scope.agregarEstudiante = function () {
        var estudiante = {
            'id_curso': curso.id_curso,
            'nombre': null,
            'apellido': null,
            'rut': null,
            'usuario': null,
            'clave': null,
            'edicion': true,
            'nuevo': true
        };
        $scope.listaEstudiantes.push(estudiante);
    };

    $scope.generarUsuarioEstudiante = function (estudiante) {
        if($scope.generarUsuario){
            if(!_.isNull(estudiante.nombre)){
                if(_.isNull(estudiante.apellido)){
                    estudiante.usuario = estudiante.nombre.charAt(0);
                    estudiante.usuario=normalize(estudiante.usuario);
                }else{
                    estudiante.usuario = estudiante.nombre.charAt(0)+estudiante.apellido;
                    estudiante.usuario=normalize(estudiante.usuario);
                }
            }
        }
    };
    $scope.generarClaveEstudiante = function (estudiante) {
        if($scope.generarClave && !_.isUndefined(estudiante.rut)){
            estudiante.clave = estudiante.rut.replace(/\D+/g, '');
        }
    };
    $scope.camposCompletos = function (estudiante) {
        if(!_.isUndefined(estudiante.rut) && !_.isUndefined(estudiante.nombre)
            && !_.isUndefined(estudiante.apellido) && !_.isUndefined(estudiante.usuario)
            && !_.isUndefined(estudiante.clave)){
            if(!_.isNull(estudiante.rut) && !_.isNull(estudiante.nombre)
                && !_.isNull(estudiante.apellido) && !_.isNull(estudiante.usuario)
                && !_.isNull(estudiante.clave)){
                if($scope.guardar){
                    return false;
                }else{
                    return true;
                }

            }else{
                return true;
            }
        }else{
            return true;
        }
    };
    $scope.buscarCoincidencia = function (estudiante, index, hashkey) {
        if(!_.isUndefined(estudiante.rut)){
            //comprueba si ya esta en la lista previniendo que no se compare con el mismo
            if(_.findIndex($scope.listaEstudiantes, function (est) {
                    if(est.rut.replace(/\D+/g, '') == estudiante.rut.replace(/\D+/g, '') && est.$$hashKey!=hashkey){
                        return true;
                    }
                })>=0){
                //alerta usuario existe, desactiva botón guardar
                toastr.warning('El estudiante ya forma parte del curso.','Advertencia.');
                $scope.guardar = false;
            }else{
                $scope.guardar = true;
                //no se encuentra en la lista, se obtiene estudiante y se pregunta si quiere agregar al curso.
                EstudiantesServices.ObtenerEstudiante(estudiante)
                    .then(function (response) {
                        if(!_.isUndefined(response.result)){
                            $mdDialog.show({
                                templateUrl: '/partials/content/asignatura/curso/config/modalEstudianteCoincide.html',
                                locals : {
                                    rut: response.result.rut,
                                    nombre: response.result.nombre,
                                    apellido: response.result.apellido,
                                    usuario: response.result.usuario,
                                    clave: response.result.clave,
                                    curso: curso.nombre_curso,
                                    ano: curso.ano,
                                    semestre: curso.semestre
                                },
                                controller: 'ModalEstudianteEncontrado'
                            })
                                .then(
                                function () {
                                    //reemplazar en el indice y poner response.result objeto
                                    $scope.listaEstudiantes.splice(index,1, response.result);
                                    //asociar en la bd
                                    var EstudianteCurso = {
                                        'id_user': response.result.id_user,
                                        'id_curso': estudiante.id_curso
                                    };
                                    EstudiantesServices.AsignarCursoAEstudiante(EstudianteCurso).then(
                                        function (response) {
                                            delete estudiante['nuevo'];
                                            estudiante.edicion = false;
                                        }, function (error) {
                                            toastr.error('No se pudo asignar el estudiante al curso: '+error.err.code,'Error.');
                                        }
                                    );
                                });
                        }
                    }, function (error) {
                        toastr.error('No se pudo obtener estudiante: '+error.err.code,'Error.');
                    });
            }
        }
    };

    $scope.guardarEstudiante = function (estudiante) {
        if(!_.isUndefined(estudiante.nuevo)) {
            EstudiantesServices.CrearEstudiante(estudiante).then(
                function (response) {
                    var EstudianteCurso = {
                        'id_user': response.id_user,
                        'id_curso': estudiante.id_curso
                    };
                    toastr.success('Nuevo estudiante creado.');
                    EstudiantesServices.AsignarCursoAEstudiante(EstudianteCurso).then(
                        function (response) {
                            delete estudiante['nuevo'];
                            estudiante.edicion = false;
                            toastr.success('Estudiante asociado al curso.');
                        }, function (error) {
                            toastr.error('No se pudo asignar el estudiante al curso: '+error.err.code,'Error.');
                        }
                    );
                }, function (error) {
                    if (error.err.code == 'ER_DUP_ENTRY') {
                        toastr.error('Ya existe estudiante con el mismo usuario. Por favor modifique el usuario.','Error.');
                    }
                }
            );
        }else{
            EstudiantesServices.ActualizarEstudiante(estudiante).then(
                function (response) {
                    estudiante.edicion = false;
                    toastr.success('Información del estudiante actualizada.');
                }, function (error) {
                    toastr.error('No se pudo actualizar información del estudiante: '+error.err.code,'Error.');
                }
            );
        }
    };
    $scope.editarEstudiante = function (estudiante) {
        estudiante.edicion = true;
    };
    $scope.eliminarEstudianteDelCurso = function (estudiante, index) {
        EstudiantesServices.EliminarEstudianteDelCurso(estudiante)
            .then(function (response) {
                $scope.listaEstudiantes.splice(index,1);
                toastr.success('Estudiante eliminado del curso.');
            }, function (error) {
                toastr.error('No se pudo eliminar al estudiante del curso: '+error.err.code,'Error');
            });
    };
    $scope.cancelarEstudiante = function (estudiante, index) {
        if(!_.isUndefined(estudiante.nuevo)){
            $scope.listaEstudiantes.splice(index, 1);
        }else{
            estudiante.edicion = false;
        }
    };
    //meta
    //obtener meta del curso

    $scope.guardarMeta = function () {
        CursosServices.establecerMeta($scope.curso.meta, $scope.curso).then(
            function (response) {
                toastr.success('Se estableció la meta del curso.');
            }, function (error) {
                toastr.error('No se pudo establecer la meta del curso: '+error.err.code,'Error');
            }
        );
    };
});

crsApp.controller('ModalEstudianteEncontrado',function($scope, $mdDialog, rut, nombre, apellido, usuario, clave, curso, ano, semestre){
    $scope.rut=rut;
    $scope.nombre=nombre;
    $scope.apellido=apellido;
    $scope.usuario=usuario;
    $scope.clave=clave;
    $scope.curso=curso;
    $scope.ano=ano;
    $scope.semestre=semestre;

    $scope.cancelar = function() {
        $mdDialog.cancel();
    };

    $scope.aceptar = function() {
        $mdDialog.hide();
    };
});
crsApp.controller('ModalEliminarModuloController',function($scope, $mdDialog, nombre_modulo){
    $scope.nombre_modulo=nombre_modulo;

    $scope.aceptar = function() {
        $mdDialog.hide();
    };
});