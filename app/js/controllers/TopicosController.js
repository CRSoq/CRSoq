crsApp.controller('TopicosController', function($scope, $rootScope, $mdDialog, $stateParams, toastr, TopicosServices, AsignaturasServices, CursosServices) {
    $scope.promesas = []
    $scope.listaTopicos = []
    $scope.listaAsignaturas = []
    $scope.asignaturas = CursosServices.obtenerCursosLocal();
    $scope.asignatura = _.findWhere($scope.asignaturas,{'asignatura':$stateParams.nombre_asignatura});
    
    TopicosServices.obtenerTopicos($scope.asignatura).then(function (response) {
	if(response.success){
            $scope.listaTopicos = _.cloneDeep(response.result);
        }else{
            toastr.error('No se obtuvo lista de tópicos: '+response.err.code,'Error');
        }
    });
    $scope.nuevoTopico = function () {
        $mdDialog
            .show({
                templateUrl: 'partials/content/asignatura/modalAgregarTopico.html',
                controller: 'modalAgregarTopicoController',
                locals:{
                    titulo: 'Topico asignatura',
                    topico: null,
                    listaTopicos: $scope.listaTopicos
                }
            })
            .then(
            function (topico) {
		topico.id_asignatura = $scope.asignatura.id_asignatura
                TopicosServices.crearTopico(topico).then(function (response) {
                    if(response.success){
                        topico.id_topico = response.id_topico;
			topico.id_asignatura = response.id_asignatura;
                        $scope.listaTopicos.push(topico);
                        toastr.success('Tópico agregado correctamente.');
                    }else{
                        toastr.error('No se pudo agregar el tópico: '+response.err.code,'Error');
                    }
                });
            });
    };
    $scope.editarTopico = function (topico) {
        $mdDialog
            .show({
                templateUrl: '/partials/content/asignatura/modalAgregarTopico.html',
                controller: 'modalAgregarTopicoController',
                locals:{
                    titulo: 'Editar Topico',
                    topico: topico,
                    listaTopicos: $scope.listaTopicos
                }
            })
            .then(
            function (topico) {
                TopicosServices.editarTopico(topico).then(function (response) {
                    if(response.success){
                        var topic = _.findWhere($scope.listaTopicos,{id_topico:topico.id_topico});
			topic.id_topico = topico.id_topico;
                        topic.nombre = topico.nombre;
                        topic.id_asignatura = topico.id_asignatura;
                        toastr.success('Topico editado.');
                    }else{
                        toastr.error('No se pudo editar el tópico: '+response.err.code,'Error');
                    }
                });
            });
    };
    $scope.eliminarTopico = function (topico, index) {
        TopicosServices.eliminarTopico(topico)
            .then(function (response) {
                if (response.success) {
                    $scope.listaTopicos.splice(index, 1);
                    toastr.success('Topico eliminado de la asignatura.');
                } else {
                    toastr.error('No se pudo eliminar el topico de la asignatura: '+response.err.code,'Error');
                }
            });
    };
    $scope.cancelarTopico = function (topico, index) {
        if(!_.isUndefined(topico.nuevo)){
            $scope.listaTopicos.splice(index, 1);
        }else{
            estudiante.edicion = false;
        }
    };
});
crsApp.controller('TemasController', function($scope, $rootScope, $mdDialog, $stateParams, toastr, AsignaturasServices, CursosServices, TopicosServices) {
    $scope.promesas = []
    $scope.listaTemas = []
    $scope.asignaturas = CursosServices.obtenerCursosLocal();
    $scope.asignatura = _.findWhere($scope.asignaturas,{'asignatura':$stateParams.nombre_asignatura});

    $scope.obtenerTemas = function () {
	TopicosServices.obtenerTemas($scope.asignatura).then(function (response) {
       	    if(response.success){
            	$scope.listaTemas = _.cloneDeep(response.result);
            	console.log($scope.listaTemas);
            }else{
            	toastr.error('No se obtuvo lista de temas: '+response.err.code,'Error');
            }
        });
   }
   $scope.obtenerTemas();
   $scope.parearTopico = function (topico) {
        var lista = [];
        _.forEach($scope.listaTemas, function (tema) {
            if(tema.id_topico == topico){
                lista.push(tema);
            }
        });
        return lista;
    };

    $scope.nuevoTema = function () {
        $mdDialog
            .show({
                templateUrl: 'partials/content/asignatura/modalAgregarTema.html',
                controller: 'modalAgregarTemaController',
                locals:{
                    titulo: 'Tema asignatura',
                    tema: null,
                    listaTemas: $scope.listaTemas
                }
            })
            .then(
            function (tema) {
		//tema.id_tema = 3;
		tema.id_asignatura = $scope.asignatura.id_asignatura;
                TopicosServices.crearTema(tema).then(function (response) {
                    if(response.success){
                        tema.id_tema = response.id_tema;
                        tema.id_topico = response.id_topico;
			//tema.nombre_topico = response.nombre_topico;
			//console.log(tema);
                        //$scope.listaTemas.push(tema);
			$scope.obtenerTemas();
                        toastr.success('Tema agregado correctamente.');
                    }else{
                        toastr.error('No se pudo agregar el tema: '+response.err.code,'Error');
                    }
                });
            });
    };
    $scope.editarTema = function (tema) {
        $mdDialog
            .show({
                templateUrl: '/partials/content/asignatura/modalAgregarTema.html',
                controller: 'modalAgregarTemaController',
                locals:{
                    titulo: 'Editar tema',
                    tema: tema,
                    listaTemas: $scope.listaTemas
                }
            })
            .then(
            function (tema) {
                TopicosServices.editarTema(tema).then(function (response) {
                    if(response.success){
                        var tem = _.findWhere($scope.listaTemas,{id_tema:tema.id_tema});
                        console.log($scope.listaTemas);
			tem.id_tema = tema.id_tema;
                        tem.nombre = tema.nombre;
                        tem.nombre_topico = tema.nombre_topico;
			$scope.obtenerTemas();
                        toastr.success('Tema editado.');
			//$scope.listaTemas = _.map(_.sortByOrder($scope.listaTemas, ['posicion'], ['asc']));
                    }else{
                        toastr.error('No se pudo editar el tema: '+response.err.code,'Error');
                    }
                 });
            });
    };
    $scope.eliminarTema = function (tema, index) {
        TopicosServices.eliminarTema(tema)
            .then(function (response) {
                if (response.success) {
                    $scope.listaTemas.splice(index, 1);
                    toastr.success('Tema eliminado de la asignatura.');
                } else {
                    toastr.error('No se pudo eliminar el tema de la asignatura: '+response.err.code,'Error');
                }
            });
    };
    $scope.cancelarTema = function (tema, index) {
        if(!_.isUndefined(tema.nuevo)){
            $scope.listaTemas.splice(index, 1);
        }else{
            tema.edicion = false;
        }
    };
});
crsApp.controller('modalAgregarTopicoController', function($scope, toastr, $mdDialog, topico, titulo, listaTopicos){ 
    $scope.titulo=titulo;
    var listaTopic = _.cloneDeep(listaTopicos);
    if(_.isNull(topico)){
        $scope.topico = {};
    }else{
        $scope.topico = _.clone(topico);
    }
    $scope.aceptar = function () {
        if(!_.isUndefined(!_.isUndefined($scope.topico.nombre))) {
            var index = _.findIndex(listaTopic, function (topico) {
                if(topico.id_topico == $scope.topico.id_topico && topico.id_asignatura == $scope.topico.id_asignatura && topico.id_topico != $scope.topico.id_topico) {
                   return true;
                }
            });
            if(index<0){
                $mdDialog.hide($scope.topico);
            }else{
                toastr.error('Ya existe este tópico','Error');
            }
        }else{
        	toastr.error('Debe ingresar todos los datos.','Error');
        }
    };
    $scope.cancelar = function () {
        $mdDialog.cancel();
    }
});
crsApp.controller('modalAgregarTemaController', function($scope, toastr, $mdDialog, tema, titulo, listaTemas) {
    $scope.titulo=titulo;
    var listaTem = _.cloneDeep(listaTemas);
//    var listaPro = _.cloneDeep(listaTemas);
    if(_.isNull(tema)){
        $scope.tema = {};
    }else{
        $scope.tema = _.clone(tema);
    }
    console.log($scope.tema);
    console.log(tema);
    $scope.aceptar = function () {
        if(!_.isUndefined($scope.tema.nombre) && !_.isUndefined($scope.tema.id_topico)) {
            var index = _.findIndex(listaTem, function (tema) {
                if(tema.nombre == $scope.tema.nombre && tema.id_tema != $scope.tema.id_tema) {
                   return true;
                }
            });
            if(index<0){
                $mdDialog.hide($scope.tema);
            }else{
                toastr.error('Ya existe este tema','Error');
            }
        }else{
                toastr.error('Debe ingresar todos los datos.','Error');
        }
    };
    $scope.cancelar = function () {
        $mdDialog.cancel();
    }
});
crsApp.controller('ConfigTopicosController', function ($scope, $rootScope, $state, $stateParams, $q, $mdDialog, toastr, CursosServices, TopicosServices, SessionServices) {
    var asignaturas = CursosServices.obtenerCursosLocal();
    var asignatura = _.findWhere(asignaturas,{'asignatura':$stateParams.nombre_asignatura});

    $scope._ = _;
    $scope.modulos = [];
    $scope.modulosEditados = [];
    $scope.cambio = false;
    $scope.topicos = [];

    var callbackTopicos = function (response) {
            if(response.result.length>0){
                $scope.topicos= _.cloneDeep(response.result);
                $scope.topicos= _.map(_.sortByOrder($scope.topicos,['posicion'],['asc']));
            }else {
                $scope.agregarTopico();
            }
    };
    console.log("ConfigTopicosController");
    var callBackTopicosError = function (error) {
        toastr.error(error.err.code,'Error tópicos');
    };
    TopicosServices.obtenerTopicos(asignatura)
        .then(callbackTopicos,callBackTopicosError);

    $scope.agregarTopico = function () {
        var topico = {
            'id_topico': '',
            'nombre': '',
            'posicion': $scope.topicos.length+1,
            'nuevo':true,
            'edicion':true
        };
        $scope.topicos.push(topico);
    };

    $scope.guardarTopico = function (topico) {
        if (!_.isEmpty(topico.nombre)) {
            if (_.isUndefined(topico.nuevo)) {
                TopicosServices.actualizarTopico(topico).then(
                    function (response) {
                        //hacer resplandor en el modulo actualizado
                        toastr.success('Tópico actualizado de manera satisfactoria.');
                        topico.edicion = false;
                        $scope.topicos = _.map(_.sortByOrder($scope.topicos, ['posicion'], ['asc']));
                    }, function (error) {
                        toastr.error('No se pudo actualizar el tópico: ' + error.err.code, 'Error');
                    }
                );
            } else {
                TopicosServices.crearTopico(topico).then(
                    function (response) {
                        topico.id_topico = response.id_topico;
                        delete topico['nuevo'];
                        topico.edicion = false;
                        toastr.success('Tópico creado de manera satisfactoria.');
                        $scope.topicos = _.map(_.sortByOrder($scope.topicos, ['posicion'], ['asc']));
                        $rootScope.$emit('actualizarControladores');
                    }, function (error) {
                        toastr.error('No se pudo crear el tópico: ' + error.err.code, 'Error');
                    }
                );
            }
        }else{
            toastr.warning('Debe ingresar el nombre del tópico.');
        }
    };
    $scope.cancelarTopico = function (modulo, indice) {
        if(_.isUndefined(topico.nuevo)){
            $scope.topicos[indice] = _.cloneDeep(_.findWhere($scope.topicosEditados, {'id_modulo':topico.id_topico}));
            $scope.topicosEditados.splice(indice,1);
            $scope.topicos[indice].edicion = false;
            $scope.topicos= _.map(_.sortByOrder($scope.topicos,['posicion'],['asc']));
        }else{
            $scope.topicosEditados.splice(indice,1);
            $scope.topicos.splice(indice,1);
        }
    };
//    $scope.eliminarTopico = function (modulo, indice) {
//        TopicosServices.contarClasesPorModulo(modulo).then(
//            function (response) {
//                if(response.result>0){
//                    $mdDialog.show({
//                        templateUrl: '/partials/content/asignatura/curso/config/modalEliminarModulo.html',
//                        locals : {
//                            nombre_modulo: modulo.nombre_modulo
//                        },
//                        controller: 'ModalEliminarModuloController'
//                    });
//                }else{
//                    ModulosServices.eliminarModulo(modulo).then(
//                        function (response) {
//                            $scope.modulos.splice(indice,1);
//                            toastr.success('Módulo eliminado de manera satisfactoria.');
//                            $scope.modulos= _.map(_.sortByOrder($scope.modulos,['posicion'],['asc']));
//                        }, function (error) {
//                            toastr.error('No se pudo eliminar el módulo: '+error.err.code,'Error');
//                        }
//                    );
//                }
//            }, function (error) {
//                toastr.error('No se pudo eliminar el módulo: '+error.err.code,'Error');
//            }
//        );
//    };
});
crsApp.controller('ConfigTemasController', function ($scope, $rootScope, $state, $stateParams, $q, $mdDialog, toastr, CursosServices, temasServices, SessionServices, TemasServices) {
    var asignaturas = CursosServices.obtenerCursosLocal();
    var asignatura = _.findWhere(asignaturas,{'asignatura':$stateParams.nombre_asignatura});

    $scope._ = _;
    $scope.temas = [];
    $scope.temasEditados = [];
    $scope.cambio = false;

    var callbacktemas = function (response) {
            if(response.result.length>0){
                $scope.temas= _.cloneDeep(response.result);
                $scope.temas= _.map(_.sortByOrder($scope.temas,['posicion'],['asc']));
            }else {
		console.log($scope.temas);
                $scope.agregartema();
            }
    };
    console.log("ConfigTemasController");
    var callBacktemasError = function (error) {
        toastr.error(error.err.code,'Error temas');
    };
    temasServices.obtenertemas(asignatura)
        .then(callbacktemas,callBacktemasError);

    $scope.agregartema = function () {
        var tema = {
            'id_tema': '',
            'nombre': '',
	    'nombre_topico': '',
	    'id_topico': '',
            'posicion': $scope.temas.length+1,
            'nuevo':true,
            'edicion':true
        };
        $scope.temas.push(tema);
    };

    $scope.guardarTema = function (tema) {
        if (!_.isEmpty(tema.nombre)) {
            if (_.isUndefined(tema.nuevo)) {
                TopicosServices.editarTema(tema).then(
                    function (response) {
                        //hacer resplandor en el modulo actualizado
                        toastr.success('Tema actualizadooo de manera satisfactoria.');
                        tema.edicion = false;
                        $scope.temas = _.map(_.sortByOrder($scope.temas, ['posicion'], ['asc']));
                    }, function (error) {
                        toastr.error('No se pudo actualizar el tema: ' + error.err.code, 'Error');
                    }
                );
            } else {
                TopicosServices.creartema(tema).then(
                    function (response) {
                        tema.id_tema = response.id_tema;
                        delete tema['nuevo'];
                        tema.edicion = false;
                        toastr.success('Tema creado de manera satisfactoria.');
                        $scope.temas = _.map(_.sortByOrder($scope.temas, ['posicion'], ['asc']));
                        $rootScope.$emit('actualizarControladores');
                    }, function (error) {
                        toastr.error('No se pudo crear el tópico: ' + error.err.code, 'Error');
                    }
                );
            }
        }else{
            toastr.warning('Debe ingresar el nombre del tema.');
        }
    };
    $scope.cancelartema = function (tema, indice) {
        if(_.isUndefined(tema.nuevo)){
            $scope.temas[indice] = _.cloneDeep(_.findWhere($scope.temasEditados, {'id_tema':tema.id_tema}));
            $scope.temasEditados.splice(indice,1);
            $scope.temas[indice].edicion = false;
            $scope.temas= _.map(_.sortByOrder($scope.temas,['posicion'],['asc']));
        }else{
            $scope.temasEditados.splice(indice,1);
            $scope.temas.splice(indice,1);
        }
    };
//    $scope.eliminartema = function (modulo, indice) {
//        temasServices.contarClasesPorModulo(modulo).then(
//            function (response) {
//                if(response.result>0){
//                    $mdDialog.show({
//                        templateUrl: '/partials/content/asignatura/curso/config/modalEliminarModulo.html',
//                        locals : {
//                            nombre_modulo: modulo.nombre_modulo
//                        },
//                        controller: 'ModalEliminarModuloController'
//                    });
//                }else{
//                    temasServices.eliminarModulo(modulo).then(
//                        function (response) {
//                            $scope.temas.splice(indice,1);
//                            toastr.success('Módulo eliminado de manera satisfactoria.');
//                            $scope.temas= _.map(_.sortByOrder($scope.temas,['posicion'],['asc']));
//                        }, function (error) {
//                            toastr.error('No se pudo eliminar el módulo: '+error.err.code,'Error');
//                        }
//                    );
//                }
//            }, function (error) {
//                toastr.error('No se pudo eliminar el módulo: '+error.err.code,'Error');
//            }
//        );
//    };
});
